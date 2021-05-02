import React from "react";
import Select from "react-select";
import { stockList } from "../../stockList";

const Nifty = (props) => {
  const {
    selectedValue,
    handleChange,
    investingStockUrl,
    investingIndicesUrl,
  } = props;
  return (
    <>
      <div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="select">
            <Select
              isClearable={true}
              isSearchable={true}
              name="color"
              options={stockList}
              value={selectedValue}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button>
              <a
                href={
                  selectedValue.indices
                    ? `${investingIndicesUrl}/${selectedValue.value}`
                    : `${investingStockUrl}/${selectedValue.value}`
                }
                // eslint-disable-next-line react/jsx-no-target-blank
                target="_blank"
              >
                open in new tab
              </a>
            </button>
          </div>
        </div>
      </div>

      {selectedValue && (
        <div className="iframe__main">
          <iframe
            src={
              selectedValue.indices
                ? `${investingIndicesUrl}/${selectedValue.value}`
                : `${investingStockUrl}/${selectedValue.value}`
            }
            frameBorder="0"
            allowFullScreen="false"
            className="video__iframe"
            title="test"
          />
        </div>
      )}
    </>
  );
};

export default Nifty;
