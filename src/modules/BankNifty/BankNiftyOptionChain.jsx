import React, { useState, useEffect } from "react";
import Select from "react-select";
import { strikePriceData } from "./options";
import socketIOClient from "socket.io-client";
import axios from "axios";
import { useCallback } from "react";
import Chart from "react-google-charts";

const BankNiftyOptionChain = () => {
  const [state, setState] = useState({ value: "22200", label: "22200" });
  const [data, setData] = useState({
    bankNiftyOptionChainData: [],
    endpoint: "http://127.0.0.1:7000/",
  });

  const { endpoint, bankNiftyOptionChainData } = data;

  console.log('bankNiftyOptionChainData *****************', bankNiftyOptionChainData)
  const fetchData = async () => {
    const result = await axios(
      `http://localhost:7000/api/nse/bankniftyOptionChain/${state.value}`
    );

    // setData(result.data);
  };

  const objectsEqual = useCallback((o1, o2) =>
    typeof o1 === "object" && Object.keys(o1).length > 0
      ? Object.keys(o1).length === Object.keys(o2).length &&
        Object.keys(o1).every((p) => objectsEqual(o1[p], o2[p]))
      : o1 === o2
  );

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
        data.bankNiftyOptionChainData.length ===
          bankNiftyOptionChainData.length &&
        returnDuplicateData(
          data.bankNiftyOptionChainData,
          bankNiftyOptionChainData
        )
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
  }, [bankNiftyOptionChainData, endpoint, objectsEqual, state]);

  const handleChange = (selectedOption) => {
    setState(selectedOption);
    // fetchData();
  };

  console.log("data ********", data);

  const returnSortedData = (array) => {
    return array.sort(function (a, b) {
      return new Date(a.timestamp) - new Date(b.timestamp);
    });
  };

  const returnCombinedBankNiftyData = (data) => {
    const tempData = [["timestamp", "Put OI", "Call OI"]];

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
      const { openInterest, timestamp } = item;
      let date = new Date(timestamp);
      let time = `${date.getHours()}:${date.getMinutes()}`;
      tempData.push([time, openInterest, sortCallData[idx].openInterest]);
    });

    return tempData;
  };

  const returnPutLastPriceData = (data) => {
    const tempData = [["timestamp", "lastPrice"]];

    const putData = data.filter((item) => {
      if (item["optionType"] === "Put") {
        return item;
      }
    });

    const sortPutData = returnSortedData(putData);

    sortPutData.forEach((item, idx) => {
      const { lastPrice, timestamp } = item;
      let date = new Date(timestamp);
      let time = `${date.getHours()}:${date.getMinutes()}`;
      tempData.push([time, lastPrice]);
    });

    return tempData;
  };

  const returnCallLastPriceData = (data) => {
    const tempData = [["timestamp", "lastPrice"]];

    const callData = data.filter((item) => {
      if (item["optionType"] === "Call") {
        return item;
      }
    });

    const sortCallData = returnSortedData(callData);

    sortCallData.forEach((item, idx) => {
      const { lastPrice, timestamp } = item;
      let date = new Date(timestamp);
      let time = `${date.getHours()}:${date.getMinutes()}`;
      tempData.push([time, lastPrice]);
    });

    return tempData;
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
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: "500px" }}>
          <Select
            value={state}
            onChange={handleChange}
            options={strikePriceData}
          />
        </div>
      </div>
      {bankNiftyOptionChainData.length === 0 && <div> Fetching data </div>}
      {bankNiftyOptionChainData.length > 0 ? (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <Chart
              width={"900px"}
              height={"500px"}
              chartType="LineChart"
              loader={<div>Loading Chart</div>}
              data={returnPutLastPriceData(bankNiftyOptionChainData)}
              options={{
                hAxis: {
                  title: "Time",
                },
                vAxis: {
                  title: "PUT PRICE",
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
              data={returnCallLastPriceData(bankNiftyOptionChainData)}
              options={{
                hAxis: {
                  title: "Time",
                },
                vAxis: {
                  title: "CALL PRICE",
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
      {bankNiftyOptionChainData.length > 0 ? (
        <>
          <Chart
            width={"100%"}
            height={"500"}
            chartType="Line"
            loader={<div>Loading Chart</div>}
            data={returnCombinedBankNiftyData(bankNiftyOptionChainData)}
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
      {bankNiftyOptionChainData.length > 0 ? (
        <>
          <Chart
            width={"100%"}
            height={"500"}
            chartType="Line"
            loader={<div>Loading Chart</div>}
            data={returnCallPutLastPrice(bankNiftyOptionChainData)}
            options={{
              chart: {
                title: "Bank Nifty and Open Interest Chart",
              },
              width: 1600,
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
        </>
      ) : null}
    </div>
  );
};

export default BankNiftyOptionChain;
