import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TableComponent.css";

const TableComponent = (props) => {
  let { data } = props;
  // const [data, setData] = useState({});
  // const { twoDayBefore = [], oneDayBefore = [], today = [] } = data;

  data = data.map((item, index) => {
    const prevRecord = index > 0 && data[index - 1];
    return {
      ...item,
      priceDiff:
        index === 0 ? 0 : item?.underlyingValue - prevRecord?.underlyingValue,
    };
  });

  data = data.sort(function (a, b) {
    return new Date(b.timestamp) - new Date(a.timestamp);
  });

  // data = data.map((item, index) => {
  //   if (index === 0) {
  //     console.log(item);
  //     // const nextRecord = data[index + 1]
  //     // console.log(nextRecord);
  //   }
  //   const nextRecord = data[index + 1]
  //   return {
  //     ...item,
  //     priceDiff: item?.underlyingValue || 0 - nextRecord?.underlyingValue || 0,
  //   };
  // });

  const formatDate = (date) => {
    let formatDate = new Date(date);
    let hours = formatDate.getHours();
    let minutes = formatDate.getMinutes();
    let ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    // let strTime = hours + ":" + minutes + " " + ampm;
    let strTime = hours + ":" + minutes;

    return strTime;
    // if (displayDateFormat === "minutes") return strTime;

    // return `${formatDate.getDate()}/${
    //   formatDate.getMonth() + 1
    // }/${formatDate.getFullYear()}`;
  };

  //   useEffect(() => {
  //     const fetchData = async () => {
  //       const indexdata = await axios(
  //         `http://localhost:3001/api/derivatives/indexdata/`
  //       );

  //       setData(indexdata.data);
  //     };

  //     fetchData();
  //   }, [state]);

  const skipColumns = [
    "timestamp",
    "underlyingValue",
    "priceDiff",
    // "totCEOI",
    // "totPEOI",
    // "data",
    // "tolPCROI",
    // "tolVOLOI",
    // "CumulativePCROI",
    // "CECumulativePrice",
    // "CECumulativeOpenInterest",
    // "CECumulativeChangeInOpenInterest",
    // "CECumulativePChangeInOpenInterest",
    // "PECumulativePrice",
    // "PECumulativeOpenInterest",
    // "PECumulativeChangeInOpenInterest",
    // "PECumulativePChangeInOpenInterest",
    // "filterCallData",
    // "filterPutData"
  ];

  const bgColorArray = ["DIFF_PUT_CALL", "DAY_PRICE_CHG", "priceDiff"];

  // const returnSortedData = (stocks) => {
  //   const tempArray = [];
  //   const [BANKNIFTY, FINNIFTY, NIFTY] = stocks;
  //   tempArray.push(NIFTY);
  //   tempArray.push(BANKNIFTY);
  //   tempArray.push(FINNIFTY);

  //   return tempArray;
  // };

  const renderTableHeader = () => {
    return skipColumns.map((key, index) => {
      return <th key={index}>{key.toUpperCase()}</th>;
    });
  };

  const renderTableData = (data) => {
    return data.map((stock, index) => {
      return (
        <tr key={stock._id}>
          {skipColumns.map((val, index) => {
            return (
              <td
                key={index}
                className={`${
                  bgColorArray.includes(val)
                    ? stock[val] > 0
                      ? "buy"
                      : "sell"
                    : ""
                }`}
              >
                {val === "timestamp" ? formatDate(stock[val]) : stock[val]}
              </td>
            );
          })}
        </tr>
      );
    });
  };

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const transformDataToTable = (data) => {
    // let arrayOfData = Object.keys(obj).map(function (key) {
    // let d = new Date(obj[key][0].timestamp);
    // let dayName = days[d.getDay()];
    return (
      <div>
        <h2 className="center">
          {/* {formatDate(obj[key][0].timestamp)} */}
          {/* {"==>"}({dayName === "Thursday" ? `${dayName}==> Expiry` : dayName}) */}
        </h2>
        <table id="students">
          <tbody>
            <tr>{renderTableHeader()}</tr>
            {renderTableData(data)}
          </tbody>
        </table>
      </div>
    );
    // });

    // return arrayOfData;
  };

  return (
    <>
      {data.length > 0 ? transformDataToTable(data) : null}
      {/* {twoDayBefore.length > 0 && (
        <div>
          <h2 className="center">{twoDayBefore[0].TIMESTAMP}</h2>
          <table id="students">
            <tbody>
              <tr>{renderTableHeader()}</tr>
              {renderTableData(twoDayBefore)}
            </tbody>
          </table>
        </div>
      )}

      {oneDayBefore.length > 0 && (
        <div>
          <h2 className="center">{oneDayBefore[0].TIMESTAMP}</h2>
          <table id="students">
            <tbody>
              <tr>{renderTableHeader()}</tr>
              {renderTableData(oneDayBefore)}
            </tbody>
          </table>
        </div>
      )}

      {today.length > 0 && (
        <div>
          <h2 className="center">{today[0].TIMESTAMP}</h2>
          <table id="students">
            <tbody>
              <tr>{renderTableHeader()}</tr>
              {renderTableData(today)}
            </tbody>
          </table>
        </div>
      )} */}
    </>
  );
};

export default TableComponent;
