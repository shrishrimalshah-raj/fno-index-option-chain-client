import React from "react";
import Chart from "react-google-charts";

const GenericChart = (props) => {
  const { type, title, data, column, displayDateFormat } = props;

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


    if (displayDateFormat === "minutes") return strTime;

    return `${formatDate.getDate()}/${
      formatDate.getMonth() + 1
    }/${formatDate.getFullYear()}`;
  };

  // 0: { axis: column[1] },
  // 1: { axis: column[2] },
  const multipleColumnNames = () => {
    const temp = {};
    column.forEach((row, index) => {
      if (index !== 0) {
        temp[index - 1] = {
          axis: row,
        };
      }
    });
    return temp;
  };

  // y: {
  //   openInterest: { label: column[1] },
  //   spotPrice: { label: column[2] },
  // }
  const multipleColumnAxes = () => {
    const temp = { y: {} };
    column.forEach((row, index) => {
      temp["y"][row] = {
        label: row,
      };
    });
    return temp;
  };

  const returnFormattedData = (data, totalColumn) => {
    if (data.length === 0) {
      return [];
    }

    const filterColumn = totalColumn;

    let newArray = [];
    newArray.push(filterColumn);

    data.forEach((stock) => {
      let temp = [];

      filterColumn.forEach((key) => {
        temp.push(key === "timestamp" ? formatDate(stock[key]) : stock[key]);
      });

      newArray.push(temp);
    });

    return newArray;
  };

  const returnSingleLinedData = (data, totalColumn) => {
    if (data.length === 0) {
      return [];
    }

    const filterColumn = totalColumn;

    let newArray = [];
    newArray.push(filterColumn);

    data.forEach((stock) => {
      console.log(stock);
      let temp = [];
      filterColumn.forEach((key, index) => {
        temp.push(key === "timestamp" ? formatDate(stock[key]) : stock[key]);
      });

      newArray.push(temp);
    });

    return newArray;
  };

  const renderSwitch = (param) => {
    switch (param) {
      case "SINGLE":
        return (
          <>
            {data.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  // marginLeft: "300px",
                }}
              >
                <div>
                  <Chart
                    width={"100%"}
                    height={"500"}
                    chartType="Line"
                    loader={<div>Loading Chart</div>}
                    data={returnSingleLinedData(data, column)}
                    options={{
                      chart: {
                        title: title,
                      },
                      width: 1200,
                      height: 500,
                      series: {
                        0: { axis: column[1] },
                      },
                      axes: {
                        y: {
                          openInterest: { label: column[1] },
                        },
                      },
                      colors: ["#262E57", "#F62E31"],
                    }}
                    rootProps={{ "data-testid": "4" }}
                  />
                </div>
              </div>
            ) : null}
          </>
        );
      case "DOUBLE":
        return (
          <>
            {data.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div>
                  <Chart
                    width={"100%"}
                    height={"500"}
                    chartType="Line"
                    loader={<div>Loading Chart</div>}
                    data={returnFormattedData(data, column)}
                    options={{
                      chart: {
                        title: title,
                      },
                      width: 1200,
                      height: 500,
                      series: {
                        // Gives each series an axis name that matches the Y-axis below.
                        0: { axis: column[1] },
                        1: { axis: column[2] },
                      },
                      axes: {
                        // Adds labels to each axis; they don't have to match the axis names.
                        y: {
                          openInterest: { label: column[1] },
                          spotPrice: { label: column[2] },
                        },
                      },
                      colors: ["#262E57", "#F62E31"],
                    }}
                    rootProps={{ "data-testid": "4" }}
                  />
                </div>
              </div>
            ) : null}
          </>
        );
      case "MULTIPLE":
        return (
          <>
            {data.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div>
                  <Chart
                    width={"100%"}
                    height={"500"}
                    chartType="Line"
                    loader={<div>Loading Chart</div>}
                    data={returnFormattedData(data, column)}
                    options={{
                      chart: {
                        title: title,
                      },
                      width: 1200,
                      height: 500,
                      series: {
                        // Gives each series an axis name that matches the Y-axis below.
                        ...multipleColumnNames(),
                      },
                      axes: {
                        // Adds labels to each axis; they don't have to match the axis names.
                        ...multipleColumnAxes(),
                      },
                      // colors: ["#262E57", "#F62E31"],
                    }}
                    rootProps={{ "data-testid": "4" }}
                  />
                  <br />
                  <br />
                </div>
              </div>
            ) : null}
          </>
        );
      default:
        return null;
    }
  };

  return <div>{renderSwitch(type)}</div>;
};

export default GenericChart;
