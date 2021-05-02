import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import { useCallback } from "react";
import Chart from "react-google-charts";

const BankNiftyStrikePrices = () => {
  const [state, setState] = useState({ value: "22200", label: "22200" });
  const [data, setData] = useState({
    allStrikePricesData: [],
    endpoint: "http://127.0.0.1:7000/",
  });

  const { endpoint, allStrikePricesData } = data;

  const returnDuplicateData = (apiData, localData) => {
    return apiData.every((item) => {
      return localData.find((row) => {
        if (row._id === item._id) {
          return true;
        }
        return false;
      });
    });
  };

  useEffect(() => {
    const socket = socketIOClient("http://127.0.0.1:7000/", {
      query: `strikePrice=${state.value}`,
    });

    socket.on("FromAPI", (data) => {
      console.log("FETCH SOCKET IO **************", data);
      if (
        data.allStrikePricesData.length === allStrikePricesData.length &&
        returnDuplicateData(data.allStrikePricesData[0], allStrikePricesData[0])
      ) {
        console.log("!!! same data !!!");
      } else {
        console.log("!!! state updated !!!");
        setData({
          ...data,
          bankNiftyOptionChainData: data.bankNiftyOptionChainData,
        });
      }
    });
  }, [allStrikePricesData, endpoint, state]);

  console.log("data ********", data);

  const returnSortedData = (array) => {
    return array.sort(function (a, b) {
      return new Date(a.timestamp) - new Date(b.timestamp);
    });
  };

  const returnCallPutLastPrice = (data) => {
    const tempData = [["timestamp", "Put Price", "Call Price"]];

    const callData = data.filter((item) => {
      if (item["optionType"] === "Call") {
        return item;
      }
    });

    const putData = data.filter((item) => {
      if (item["optionType"] === "Put") {
        return item;
      }
    });

    const sortCallData = returnSortedData(callData);
    const sortPutData = returnSortedData(putData);

    sortPutData.forEach((item, idx) => {
      const { lastPrice, timestamp } = item;
      let date = new Date(timestamp);
      let time = `${date.getHours()}:${date.getMinutes()}`;
      tempData.push([time, lastPrice, sortCallData[idx].lastPrice]);
    });

    return tempData;
  };

  return (
    <div>
      {allStrikePricesData.length === 0 && <div> Fetching data </div>}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {allStrikePricesData.length > 0 &&
          allStrikePricesData[0].length > 0 &&
          allStrikePricesData.map((num) => {
            return (
              <>
                <div style={{ textAlign: "center" }}>
                  <h1>{num[0].strikePrice}</h1>
                  <Chart
                    width={"100%"}
                    height={"500"}
                    chartType="Line"
                    loader={<div>Loading Chart</div>}
                    data={returnCallPutLastPrice(num)}
                    options={{
                      chart: {
                        title: "Bank Nifty and Open Interest Chart",
                      },
                      width: 1500,
                      height: 500,
                      series: {
                        // Gives each series an axis name that matches the Y-axis below.
                        0: { axis: "callPrice" },
                        1: { axis: "putPrice" },
                      },
                      axes: {
                        // Adds labels to each axis; they don't have to match the axis names.
                        y: {
                          callPrice: { label: "Call Price" },
                          putPrice: { label: "Put Price" },
                        },
                      },
                    }}
                    rootProps={{ "data-testid": "4" }}
                  />
                </div>
              </>
            );
          })}
      </div>
    </div>
  );
};

export default BankNiftyStrikePrices;
