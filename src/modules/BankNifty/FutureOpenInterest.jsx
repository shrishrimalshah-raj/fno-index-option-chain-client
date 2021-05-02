import React, { useState, useEffect } from "react";
import Chart from "react-google-charts";
import axios from "axios";
import { stockList, BankNiftyList, NiftyList } from "./StockList";
import Select from "react-select";

const FutureOpenInterest = () => {
  const [state, setState] = useState("");
  const [filterBy, setFilterBy] = useState({
    value: "All Stocks",
    label: "All",
  });
  const [futureOIData, setFutureOIData] = useState([]);
  const [stockListOption, setStockListOption] = useState(stockList);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        `http://localhost:7000/api/nse/get-future-stock-open-interest/${state.value}`
      );

      const result1 = await axios(
        `http://localhost:7000/api/nse/test/${state.value}`
      );

      // console.log("result1 **********", result1.data.);
      setFutureOIData(result.data);
      setMessage(result1.data.filterBY);
    };

    fetchData();
  }, [state]);

  console.log("futureOIData ********", futureOIData);

  const handleChange = (selectedOption) => {
    setState(selectedOption);
  };

  const returnSortedData = (array) => {
    return array.sort(function (a, b) {
      return new Date(a.timestamp) - new Date(b.timestamp);
    });
  };

  const returnPriceAndOpenInterest = (data) => {
    const tempData = [["createdAt", "future-open-interest", "spot-price"]];

    data.forEach((item, idx) => {
      const { createdAt } = item;
      let date = new Date(createdAt);
      let time = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
      tempData.push([time, item["future-open-interest"], item["spot-price"]]);
    });

    return tempData;
  };

  const returnCallandPutOpenInterest = (data) => {
    const tempData = [["createdAt", "call-open-interest", "put-open-interest"]];

    data.forEach((item, idx) => {
      const { createdAt } = item;
      let date = new Date(createdAt);
      let time = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
      tempData.push([
        time,
        item["call-open-interest"],
        item["put-open-interest"],
      ]);
    });

    return tempData;
  };

  const returnPCRData = (data) => {
    const tempData = [["createdAt", "pcr-oi"]];

    data.forEach((item, idx) => {
      const { createdAt } = item;
      let date = new Date(createdAt);
      let time = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
      tempData.push([time, item["pcr-oi"]]);
    });

    return tempData;
  };

  const returnSpotPrice = (data) => {
    const tempData = [["createdAt", "spot-price"]];

    data.forEach((item, idx) => {
      const { createdAt } = item;
      let date = new Date(createdAt);
      let time = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
      tempData.push([time, item["spot-price"]]);
    });

    return tempData;
  };

  const filterOptions = [
    {
      label: "Select",
      value: "Select",
    },
    {
      label: "All Stocks",
      value: "All",
    },
    {
      label: "Max Open Interest in Futures",
      value: "maxOpenInterest",
    },
    {
      label: "Max PCR Stocks",
      value: "maxPCR",
    },
    {
      label: "PCR Value is Less Than 0.50",
      value: "pcrLessThan",
    },
    {
      label: "PCR Value is More Than 1",
      value: "pcrMoreThan",
    },
    {
      label: "Max Open Interest in Call",
      value: "maxOICALL",
    },
    {
      label: "Max Open Interest in Put",
      value: "maxOIPUT",
    },
  ];

  const sumStockPercentage = (IndexStockList, AllStocksList) => {
    let total = 0;
    IndexStockList.forEach((stock) => {
      AllStocksList.forEach((item) => {
        if (item.value === stock.symbol) {
          total += stock.weightage;
        }
      });
    });
    return Math.round(total);
  };

  const handleFilterBy = async (selectedOption) => {
    const { value } = selectedOption;

    if (value === "All" || value === "Select") {
      setStockListOption(stockList);
    } else {
      const result = await axios(
        `http://localhost:7000/api/nse/future-stock-list/${value}`
      );
      let data = [];

      data = result.data.length > 0 && result.data.map((item) => ({
        label: item.symbol,
        value: item.symbol,
      }));
      setStockListOption(data);
    }

    setFilterBy(selectedOption);
  };
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: "400px", marginRight: "50px" }}>
          <div>Filter Stock List</div>
          <Select
            value={filterBy}
            onChange={handleFilterBy}
            options={filterOptions}
          />
        </div>
        {/* stockListOption */}
        <div style={{ width: "400px", marginRight: "50px" }}>
          <div>Select Stock</div>
          <Select
            value={state}
            onChange={handleChange}
            options={stockListOption}
          />
        </div>
        <div style={{ width: "400px", fontSize: "20px" }}>
          <div>Total Stocks Array Length</div>
          <div style={{ marginTop: "15px", marginLeft: "15px" }}>
            <b>{stockListOption.length}</b>
          </div>
        </div>
        <div style={{ width: "400px", fontSize: "20px" }}>
          <div>Nifty Percentage</div>
          <div style={{ marginTop: "15px", marginLeft: "15px" }}>
            <b>{sumStockPercentage(NiftyList, stockListOption)}%</b>
          </div>
        </div>
        <div style={{ width: "400px", fontSize: "20px" }}>
          <div>Bank Nifty Percentage</div>
          <div style={{ marginTop: "15px", marginLeft: "15px" }}>
            <b>{sumStockPercentage(BankNiftyList, stockListOption)}%</b>
          </div>
        </div>  
      </div>

      <div style={{ textAlign: "center" }}>
        <h2>{state.value}</h2>
        <h3>{message ? message : "NO DECISION FOUND"}</h3>
      </div>
      {futureOIData.length > 0 ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginRight: "200px",
          }}
        >
          <div>
            <Chart
              width={"100%"}
              height={"500"}
              chartType="Line"
              loader={<div>Loading Chart</div>}
              data={returnPriceAndOpenInterest(futureOIData)}
              options={{
                chart: {
                  title: "future-open-interest and spot-price",
                },
                width: 1500,
                height: 500,
                series: {
                  // Gives each series an axis name that matches the Y-axis below.
                  0: { axis: "openInterest" },
                  1: { axis: "spotPrice" },
                },
                axes: {
                  // Adds labels to each axis; they don't have to match the axis names.
                  y: {
                    openInterest: { label: "future-open-interest" },
                    spotPrice: { label: "spot-price" },
                  },
                },
                colors: ["#262E57", "#F62E31"],
              }}
              rootProps={{ "data-testid": "4" }}
            />
            <Chart
              width={"100%"}
              height={"500"}
              chartType="Line"
              loader={<div>Loading Chart</div>}
              data={returnCallandPutOpenInterest(futureOIData)}
              options={{
                chart: {
                  title: "PUT and CALL Open Interest",
                },
                width: 1500,
                height: 500,
                series: {
                  // Gives each series an axis name that matches the Y-axis below.
                  0: { axis: "CallOpenInterest" },
                  1: { axis: "PutOpenInterest" },
                },
                axes: {
                  // Adds labels to each axis; they don't have to match the axis names.
                  y: {
                    CallOpenInterest: { label: "call-open-interest" },
                    PutOpenInterest: { label: "put-open-interest" },
                  },
                },
                colors: ["#262E57", "#F62E31"],
              }}
              rootProps={{ "data-testid": "4" }}
            />
            <Chart
              width={"1500px"}
              height={"500px"}
              chartType="LineChart"
              loader={<div>Loading Chart</div>}
              data={returnPCRData(futureOIData)}
              options={{
                hAxis: {
                  title: "Date",
                },
                vAxis: {
                  title: "PCR OI",
                },
                series: {
                  1: { curveType: "function" },
                },
                tooltip: {
                  title: "PCR OI",
                },
                colors: ["#262E57", "#F62E31"],
              }}
              rootProps={{ "data-testid": "2" }}
            />
            <Chart
              width={"1500px"}
              height={"500px"}
              chartType="LineChart"
              loader={<div>Loading Chart</div>}
              data={returnSpotPrice(futureOIData)}
              options={{
                hAxis: {
                  title: "Date",
                },
                vAxis: {
                  title: "SPOT PRICE",
                },
                series: {
                  1: { curveType: "function" },
                },
                tooltip: {
                  title: "SPOT PRICE",
                },
                colors: ["#262E57", "#F62E31"],
              }}
              rootProps={{ "data-testid": "2" }}
            />
          </div>
        </div>
      ) : (
        <div> Fetching data </div>
      )}
    </div>
  );
};

export default FutureOpenInterest;
