import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const transformDataForSingleBarChart = (data) => {
  let tempArray = [];
  for (let each in data) {
    let strikeArray = data[each];
    let lastRecord = strikeArray[strikeArray.length - 1];
    tempArray.push(lastRecord);
  }
  return tempArray;
};

const transformDataForMultipleBarChart = (data) => {
  let key = Object.keys(data)[0];
  let count = data[key].length;
  let returnArray = [];

  for (let index = 0; index < count; index++) {
    let tempArray = [];

    for (let each in data) {
      let strikeArray = data[each];
      let lastRecord = strikeArray[index || strikeArray.length - 1];
      tempArray.push(lastRecord);
    }

    returnArray[index] = tempArray;
  }

  return returnArray;
};

const formatDate = (date, displayDateFormat) => {
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
  }/${formatDate.getFullYear()}`;
};

export default function GenericBarChart(props) {
  const { data, showSingleBarChart, showMultipleBarChart } = props;
  return (
    <>
      {Object.keys(data).length > 0 && showSingleBarChart && (
        <>
          <div style={{ textAlign: "center" }}>
            <h3>
              {formatDate(
                transformDataForSingleBarChart(data)[0].timestamp,
                "minutes"
              )}
            </h3>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <BarChart
              width={500}
              height={300}
              data={transformDataForSingleBarChart(data)}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="strikePrice" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="CEOpenInterest" fill="#68C559" />
              <Bar dataKey="PEOpenInterest" fill="#ff4d4d" />
            </BarChart>
            <br />
            <BarChart
              width={500}
              height={300}
              data={transformDataForSingleBarChart(data)}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="strikePrice" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="CEChangeinOpenInterest" fill="#68C559" />
              <Bar dataKey="PEChangeinOpenInterest" fill="#ff4d4d" />
            </BarChart>
          </div>
        </>
      )}

      {Object.keys(data).length > 0 && showMultipleBarChart && (
        <>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {transformDataForMultipleBarChart(data).map((each, index) => {
              return (
                <div
                  style={{ textAlign: "center" }}
                  key={`${each[0].timestamp}-${index}`}
                >
                  <h3>{formatDate(each[0].timestamp, "minutes")}</h3>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <BarChart
                      width={500}
                      height={300}
                      data={each}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="strikePrice" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="CEChangeinOpenInterest" fill="#68C559" />
                      <Bar dataKey="PEChangeinOpenInterest" fill="#ff4d4d" />
                    </BarChart>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
