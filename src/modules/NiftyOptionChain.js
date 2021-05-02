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
import GenericBarChart from "../components/GenericBarChart";

const NiftyOptionChain = () => {
  let endpoint = "http://localhost:9000";
  // let endpoint = "ws://localhost:9000";

  const [data, setData] = useState({
    niftyOptionChainData: [],
    niftyFutureData: [],
    niftyStrikePricesData: {},
  });

  const [selectedDate, setSelectedDate] = useState(new Date());
  const { niftyOptionChainData, niftyFutureData, niftyStrikePricesData } = data;

  // useEffect(() => {
  //   const socket = io(endpoint, {
  //     query: `timestamp=${selectedDate}`,
  //   });

  //   socket.on("FromAPI", (data) => {
  //     console.log("niftyOptionChainData", data);
  //     if (
  //       data.niftyOptionChainData.length === niftyOptionChainData.length &&
  //       data.niftyFutureData.length === niftyFutureData.length
  //     ) {
  //       console.log("!!! same data !!!");
  //     } else {
  //       console.log("!!! state updated !!!");
  //       setData({
  //         ...data,
  //         niftyOptionChainData: data.niftyOptionChainData,
  //         niftyFutureData: data.niftyFutureData,
  //         // niftyStrikePricesData: data.niftyStrikePricesData,
  //       });
  //     }
  //   });

  //   // CLEAN UP THE EFFECT
  //   return () => socket.disconnect();
  //   //
  // }, [data, selectedDate]);

  useEffect(() => {
    const socket = io(`${endpoint}/niftyRoom`, {
      transports: ["websocket"],
      query: `timestamp=${selectedDate}`,
    });
    socket.on("FromAPI", (data) => {
      console.log("FROMAPI", data);
      if (
        data.niftyOptionChainData.length === niftyOptionChainData.length &&
        data.niftyFutureData.length === niftyFutureData.length
      ) {
        console.log("!!! same data !!!");
      } else {
        console.log("!!! state updated !!!");
        setData({
          ...data,
          niftyOptionChainData: data.niftyOptionChainData,
          niftyFutureData: data.niftyFutureData,
          // niftyStrikePricesData: data.niftyStrikePricesData,
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
      {niftyOptionChainData.length === 0 && <div> Fetching data </div>}

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

      {/* {niftyFutureData.length > 0 ? (
        <GenericChart
          data={niftyFutureData}
          column={["timestamp", "openInterest", "lastPrice"]}
          title="NIFTY FUTURE OPEN INTEREST"
          type="MULTIPLE"
          displayDateFormat="minutes"
        />
      ) : null} */}

      {niftyFutureData.length > 0 ? (
        <>
          <div style={{ textAlign: "center" }}>
            <h3>FUTURE OI ===> {formatDate(niftyFutureData[0].timestamp, "date")}</h3>
          </div>
          <GenericChart
            data={niftyFutureData}
            column={["timestamp", "openInterest", "lastPrice"]}
            title="NIFTY FUTURE OPEN INTEREST (FUTURE EXPIRY LAST PRICE)"
            type="MULTIPLE"
            displayDateFormat="minutes"
          />
        </>
      ) : null}

      {/* {niftyOptionChainData.length > 0 ? (
        <GenericChart
          data={niftyOptionChainData}
          column={[
            "timestamp",
            "CECumulativeChangeInOpenInterest",
            // "underlyingValue",
            "PECumulativeChangeInOpenInterest",
          ]}
          title="NIFTY OPTION CHAIN CHANGE IN OI (NIFTY SPOT LAST PRICE)"
          type="MULTIPLE"
          displayDateFormat="minutes"
        />
      ) : null} */}

      {/* {niftyOptionChainData.length > 0 ? (
        <GenericChart
          data={niftyOptionChainData}
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

      {niftyOptionChainData.length > 0 ? (
        <>
          <div style={{ textAlign: "center" }}>
            <h3>CHANGE IN OI ===> {formatDate(niftyOptionChainData[0].timestamp, "date")}</h3>
          </div>
          <GenericChart
            data={niftyOptionChainData}
            column={[
              "timestamp",
              "DiffCumulativeChangeInOpenInterest",
              "underlyingValue",
            ]}
            title="DIFF CHANGE IN OI (NIFTY SPOT LAST PRICE)"
            type="MULTIPLE"
            displayDateFormat="minutes"
          />
        </>
      ) : null}

      {niftyOptionChainData.length > 0 ? (
        <>
          <div style={{ textAlign: "center" }}>
            <h3>CUMULATIVE OI ===> {formatDate(niftyOptionChainData[0].timestamp, "date")}</h3>
          </div>
          <GenericChart
            data={niftyOptionChainData}
            column={[
              "timestamp",
              "DiffCumulativeOpenInterest",
              "underlyingValue",
            ]}
            title="DIFF Open Interest (NIFTY SPOT LAST PRICE)"
            type="MULTIPLE"
            displayDateFormat="minutes"
          />
        </>
      ) : null}

      <div style={{ display: "flex", flexDirection: "column" }}>
        {Object.keys(niftyStrikePricesData).length > 0 &&
          Object.keys(niftyStrikePricesData).map((num) => {
            return (
              <React.Fragment key={num}>
                <div style={{ textAlign: "center" }}>
                  <h3>Nifty Strike Price {num}</h3>
                  {/* <GenericChart
                    data={niftyStrikePricesData[num]}
                    column={["timestamp", "CEOpenInterest", "PEOpenInterest"]}
                    title="CE AND PE OPEN INTEREST"
                    type="MULTIPLE"
                    displayDateFormat="minutes"
                  /> */}

                  <GenericChart
                    data={niftyStrikePricesData[num]}
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
                    data={niftyStrikePricesData[num]}
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

      {Object.keys(niftyStrikePricesData).length > 0 && (
        <GenericBarChart data={niftyStrikePricesData} showSingleBarChart />
      )}
    </div>
  );
};

export default NiftyOptionChain;

// timestamp: '2021-04-01T10:00:00.000Z',
// strikePrice: 15050,
// CEPrice: 0.05,
// CEOpenInterest: 14071,
// CEChangeinOpenInterest: -4409,
// PEPrice: 181.9,
// PEOpenInterest: 389,
// PEChangeinOpenInterest: -4409
