import Chart from "react-google-charts";
import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import axios from "axios";

const BankNifty = () => {
  const [state, setState] = useState({
    response: false,
    bankNiftyData: [],
    niftyData: [],
    endpoint: "http://127.0.0.1:5000/",
  });
  const { response, endpoint, bankNiftyData, niftyData } = state;

  useEffect(() => {
    const socket = socketIOClient(endpoint);

    socket.on("FromAPI", (data) => {
      console.log("FETCH SOCKET IO **************", data);
      // if (JSON.stringify(data.niftyData) !== JSON.stringify(niftyData)) {
      if (
        // JSON.stringify(data.bankNiftyData) !== JSON.stringify(bankNiftyData) &&
        data.bankNiftyData.length !== bankNiftyData.length
      ) {
        console.log("!!! state updated !!!");

        setState({
          ...state,
          niftyData: data.niftyData,
          bankNiftyData: data.bankNiftyData,
        });
      } else {
        console.log("!!! same data !!!");
      }
      // }
    });
  }, [bankNiftyData, endpoint, niftyData, response, state]);

  console.log("state ****", state);

  const returnOpenInterestData = (data, keys) => {
    const tempData = [["timestamp", "openInterest"]];

    data.forEach((item) => {
      const { openInterest, timestamp } = item;
      let date = new Date(timestamp);
      let time = `${date.getHours()}:${date.getMinutes()}`;
      tempData.push([time, openInterest]);
    });

    return tempData;
  };

  const returnLastPriceData = (data, keys) => {
    const tempData = [["timestamp", "lastPrice"]];

    data.forEach((item) => {
      const { lastPrice, timestamp } = item;
      let date = new Date(timestamp);
      let time = `${date.getHours()}:${date.getMinutes()}`;
      tempData.push([time, lastPrice]);
    });

    return tempData;
  };

  const returnCombinedBankNiftyData = (data) => {
    const tempData = [["timestamp", "openInterest", "lastPrice"]];
    data.forEach((item) => {
      const { openInterest, lastPrice, timestamp } = item;
      let date = new Date(timestamp);
      let time = `${date.getHours()}:${date.getMinutes()}`;
      tempData.push([time, openInterest, lastPrice]);
    });

    return tempData;
  };

  const returnCombinedNiftyData = (data) => {
    const tempData = [["timestamp", "openInterest", "lastPrice"]];
    data.forEach((item) => {
      const { openInterest, lastPrice, timestamp } = item;
      let date = new Date(timestamp);
      let time = `${date.getHours()}:${date.getMinutes()}`;
      tempData.push([time, openInterest, lastPrice]);
    });

    return tempData;
  };
  return (
    <div>
      <>
        {bankNiftyData.length === 0 && <div> Fetching data </div>}
        {bankNiftyData.length > 0 ? (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <Chart
                width={"900px"}
                height={"500px"}
                chartType="LineChart"
                loader={<div>Loading Chart</div>}
                data={returnOpenInterestData(bankNiftyData)}
                options={{
                  hAxis: {
                    title: "Time",
                  },
                  vAxis: {
                    title: "Bank Nifty openInterest",
                  },
                  series: {
                    1: { curveType: "function" },
                  },
                  tooltip: {
                    title: "Time",
                  },
                }}
                rootProps={{ "data-testid": "2" }}
              />
            </div>
            <div>
              <Chart
                width={"900px"}
                height={"500px"}
                chartType="LineChart"
                loader={<div>Loading Chart</div>}
                data={returnLastPriceData(bankNiftyData)}
                options={{
                  hAxis: {
                    title: "Time",
                  },
                  vAxis: {
                    title: "Bank Nifty lastPrice",
                  },
                  series: {
                    1: { curveType: "function" },
                  },
                  colors: ["red"],
                }}
                rootProps={{ "data-testid": "2" }}
              />
            </div>
          </div>
        ) : null}

        {bankNiftyData.length > 0 ? (
          <>
            <Chart
              width={"100%"}
              height={"500"}
              chartType="Line"
              loader={<div>Loading Chart</div>}
              data={returnCombinedBankNiftyData(bankNiftyData)}
              options={{
                chart: {
                  title: "Bank Nifty and Open Interest Chart",
                },
                width: 1600,
                height: 500,
                series: {
                  // Gives each series an axis name that matches the Y-axis below.
                  0: { axis: "openInterest" },
                  1: { axis: "lastPrice" },
                },
                axes: {
                  // Adds labels to each axis; they don't have to match the axis names.
                  y: {
                    openInterest: { label: "openInterest" },
                    lastPrice: { label: "lastPrice" },
                  },
                },
              }}
              rootProps={{ "data-testid": "4" }}
            />
          </>
        ) : null}

        {niftyData.length > 0 ? (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <Chart
                width={"900px"}
                height={"500px"}
                chartType="LineChart"
                loader={<div>Loading Chart</div>}
                data={returnOpenInterestData(niftyData, [
                  "timestamp",
                  "openInterest",
                ])}
                options={{
                  hAxis: {
                    title: "Time",
                  },
                  vAxis: {
                    title: "Nifty openInterest",
                  },
                  series: {
                    1: { curveType: "function" },
                  },
                }}
                rootProps={{ "data-testid": "2" }}
              />
            </div>
            <div>
              <Chart
                width={"900px"}
                height={"500px"}
                chartType="LineChart"
                loader={<div>Loading Chart</div>}
                data={returnLastPriceData(niftyData, [
                  "timestamp",
                  "openInterest",
                ])}
                options={{
                  hAxis: {
                    title: "Time",
                  },
                  vAxis: {
                    title: "Nifty lastPrice",
                  },
                  series: {
                    1: { curveType: "function" },
                  },
                  colors: ["red"],
                }}
                rootProps={{ "data-testid": "2" }}
              />
            </div>
          </div>
        ) : null}
      </>

      {niftyData.length > 0 ? (
        <>
          <Chart
            width={"100%"}
            height={"500"}
            chartType="Line"
            loader={<div>Loading Chart</div>}
            data={returnCombinedNiftyData(niftyData)}
            options={{
              chart: {
                title: "Nifty and Open Interest Chart",
              },
              width: 1600,
              height: 500,
              series: {
                // Gives each series an axis name that matches the Y-axis below.
                0: { axis: "openInterest" },
                1: { axis: "lastPrice" },
              },
              axes: {
                // Adds labels to each axis; they don't have to match the axis names.
                y: {
                  openInterest: { label: "openInterest" },
                  lastPrice: { label: "lastPrice" },
                },
              },
            }}
            rootProps={{ "data-testid": "4" }}
          />
        </>
      ) : null}
    </div>
  );
};

export default BankNifty;
