import "date-fns";
import React, { useState, useEffect } from "react";
// import socketIOClient from "socket.io-client";
import { io } from "socket.io-client";
import DateFnsUtils from "@date-io/date-fns";
import Grid from "@material-ui/core/Grid";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import axios from "axios";

import GenericChart from "../components/GenericChart";
import TableComponent from "./TableComponent";
import GenericBarChart from "../components/GenericBarChart";

const BankNiftyOptionChain = () => {
  let endpoint = "http://localhost:9000";
  // let endpoint = "ws://localhost:9000";

  const [data, setData] = useState({
    bankNiftyOptionChainData: [],
    bankNiftyFutureData: [],
    bankNiftyStrikePricesData: {},
  });

  // new Date("2021-04-15T19:52Z")
  const [selectedDate, setSelectedDate] = useState(new Date());
  const {
    bankNiftyOptionChainData,
    bankNiftyFutureData,
    bankNiftyStrikePricesData,
  } = data;

  // useEffect(() => {
  //   // const socket = socketIOClient(endpoint, {
  //   //   query: `timestamp=${selectedDate}`,
  //   // });
  //   const socket = io(endpoint);

  //   socket.on("BANKNIFTY", (data) => {
  //     if (
  //       data.bankNiftyOptionChainData.length ===
  //         bankNiftyOptionChainData.length &&
  //       data.bankNiftyFutureData.length === bankNiftyFutureData.length
  //     ) {
  //       console.log("!!! same data !!!");
  //     } else {
  //       console.log("!!! state updated !!!");
  //       setData({
  //         ...data,
  //         bankNiftyOptionChainData: data.bankNiftyOptionChainData,
  //         bankNiftyFutureData: data.bankNiftyFutureData,
  //         bankNiftyStrikePricesData: data.bankNiftyStrikePricesData,
  //       });
  //     }
  //   });
  // }, [data, selectedDate]);

  useEffect(() => {
    // const socket = io(endpoint);
    const socket = io(`${endpoint}/bankNiftyRoom`, {
      transports: ["websocket"],
      query: `timestamp=${selectedDate}`,
    });
    socket.on("BANKNIFTY", (data) => {
      console.log("BANKNIFTY", data);
      if (
        data.bankNiftyOptionChainData.length ===
          bankNiftyOptionChainData.length &&
        data.bankNiftyFutureData.length === bankNiftyFutureData.length
      ) {
        console.log("!!! same data !!!");
      } else {
        console.log("!!! state updated !!!");
        setData({
          ...data,
          bankNiftyOptionChainData: data.bankNiftyOptionChainData,
          bankNiftyFutureData: data.bankNiftyFutureData,
          bankNiftyStrikePricesData: data.bankNiftyStrikePricesData,
        });
      }
    });
  }, [selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const formatDate = (date, displayDateFormat) => {
    let daysInWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let formatDate = new Date(date);
    let hours = formatDate.getHours();
    let minutes = formatDate.getMinutes();
    let ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    // let strTime = hours + ":" + minutes + " " + ampm;
    let strTime = hours + ":" + minutes;

    if (displayDateFormat === "minutes") return strTime;

    return `${formatDate.getDate()}/${
      formatDate.getMonth() + 1
    }/${formatDate.getFullYear()} ===> ${daysInWeek[formatDate.getDay()]}`;
  };

  return (
    <div>
      {bankNiftyOptionChainData.length === 0 && <div> Fetching data </div>}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid container justify="space-around">
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="dd/M/yyyy"
              margin="normal"
              id="date-picker-inline"
              label="Date picker"
              value={selectedDate}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
          </Grid>
        </MuiPickersUtilsProvider>
      </div>

      {bankNiftyFutureData.length > 0 ? (
        <>
          <div style={{ textAlign: "center" }}>
            <h3>FUTURE OI ===> {formatDate(bankNiftyFutureData[0].timestamp, "date")}</h3>
          </div>
          <GenericChart
            data={bankNiftyFutureData}
            column={["timestamp", "openInterest", "lastPrice"]}
            title="BANKNIFTY FUTURE OPEN INTEREST (FUTURE EXPIRY LAST PRICE)"
            type="MULTIPLE"
            displayDateFormat="minutes"
          />
        </>
      ) : null}

      {/* {bankNiftyOptionChainData.length > 0 ? (
        <GenericChart
          data={bankNiftyOptionChainData}
          column={[
            "timestamp",
            "CECumulativeChangeInOpenInterest",
            "PECumulativeChangeInOpenInterest",
          ]}
          title="BANKNIFTY OPTION CHAIN CHANGE IN OI (BANKNIFTY SPOT LAST PRICE)"
          type="MULTIPLE"
          displayDateFormat="minutes"
        />
      ) : null} */}

      {/* {bankNiftyOptionChainData.length > 0 ? (
        <GenericChart
          data={bankNiftyOptionChainData}
          column={[
            "timestamp",
            "CECumulativeOpenInterest",
            "PECumulativeOpenInterest",
          ]}
          title="CUMULATIVE CE AND PE Open Interest"
          type="MULTIPLE"
          displayDateFormat="minutes"
        />
      ) : null} */}

      {bankNiftyOptionChainData.length > 0 ? (
        <>
          <div style={{ textAlign: "center" }}>
            <h3>CHANGE IN OI ===> {formatDate(bankNiftyOptionChainData[0].timestamp, "date")}</h3>
          </div>
          <GenericChart
            data={bankNiftyOptionChainData}
            column={[
              "timestamp",
              "DiffCumulativeChangeInOpenInterest",
              "underlyingValue",
            ]}
            title="DIFF CHANGE IN OI (BANK NIFTY SPOT LAST PRICE)"
            type="MULTIPLE"
            displayDateFormat="minutes"
          />
        </>
      ) : null}

      {bankNiftyOptionChainData.length > 0 ? (
        <>
          <div style={{ textAlign: "center" }}>
            <h3>CUMULATIVE OI ===> {formatDate(bankNiftyOptionChainData[0].timestamp, "date")}</h3>
          </div>
          <GenericChart
            data={bankNiftyOptionChainData}
            column={[
              "timestamp",
              "DiffCumulativeOpenInterest",
              "underlyingValue",
            ]}
            title="DIFF Open Interest (BANK NIFTY SPOT LAST PRICE)"
            type="MULTIPLE"
            displayDateFormat="minutes"
          />
        </>
      ) : null}

      {/* {bankNiftyOptionChainData.length > 0 ? (
        <GenericChart
          data={bankNiftyOptionChainData}
          column={[
            "timestamp",
            "DiffCumulativeOpenInterest",
            "underlyingValue",
          ]}
          title="DIFF Open Interest (BANK NIFTY SPOT LAST PRICE)"
          type="MULTIPLE"
          displayDateFormat="minutes"
        />
      ) : null} */}

      <div style={{ display: "flex", flexDirection: "column" }}>
        {Object.keys(bankNiftyStrikePricesData).length > 0 &&
          Object.keys(bankNiftyStrikePricesData).map((num) => {
            return (
              <React.Fragment key={num}>
                <div style={{ textAlign: "center" }}>
                  <h3>BNF Strike Price {num}</h3>
                  {/* <GenericChart
                    data={niftyStrikePricesData[num]}
                    column={["timestamp", "CEOpenInterest", "PEOpenInterest"]}
                    title="CE AND PE OPEN INTEREST"
                    type="MULTIPLE"
                    displayDateFormat="minutes"
                  /> */}

                  <GenericChart
                    data={bankNiftyStrikePricesData[num]}
                    column={[
                      "timestamp",
                      "CEPrice",
                      // "underlyingValue",
                      "PEPrice",
                    ]}
                    title="CE AND PE Price"
                    type="MULTIPLE"
                    displayDateFormat="minutes"
                  />

                  {/* <GenericChart
                    data={bankNiftyStrikePricesData[num]}
                    column={[
                      "timestamp",
                      "CEPrice",
                      "underlyingValue",
                      "PEPrice",
                    ]}
                    title="CE AND PE Price"
                    type="MULTIPLE"
                    displayDateFormat="minutes"
                  /> */}
                </div>
              </React.Fragment>
            );
          })}
      </div>

      {Object.keys(bankNiftyStrikePricesData).length > 0 && (
        <GenericBarChart data={bankNiftyStrikePricesData} showSingleBarChart />
      )}

      {/* {bankNiftyOptionChainData.length > 0 ? (
          <TableComponent data={bankNiftyOptionChainData} />
        ) : null} */}
    </div>
  );
};

export default BankNiftyOptionChain;
