import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import "./App.css";

import { stockList } from "./stockList";
import Nifty50 from "./modules/Nifty-50";
import BankNifty, { FutureOpenInterest } from "./modules/BankNifty";
import {
  // BankNiftyOptionChain,
  BankNiftyStrikePrices,
} from "./modules/BankNifty";

import Test from "../src/modules/Test";

import NiftyOptionChain from "./modules/NiftyOptionChain";
import BankNiftyOptionChain from "./modules/BankNiftyOptionChain";

import AppBar from "./modules/Appbar";

function App() {
  const [selectedValue, setSelectedValue] = useState(stockList[0]);

  console.log("selected", selectedValue);
  const handleChange = (e) => {
    setSelectedValue(e);
  };
  // s-p-cnx-nifty-chart
  let investingStockUrl = "https://in.investing.com/equities";
  let investingIndicesUrl = "https://in.investing.com/indices";

  // console.log(`${investingUrl}/${selectedValue.value}`);
  return (
    <div className="">
      <Router>
        <AppBar />

        <Switch>
          <Route
            exact
            path="/FutureOpenInterest"
            component={FutureOpenInterest}
          />
          <Route
            exact
            path="/BankNiftyOptionChain"
            component={BankNiftyOptionChain}
          />
          <Route exact path="/strikePrices" component={BankNiftyStrikePrices} />
          <Route exact path="/niftyoptionchain" component={NiftyOptionChain} />
          <Route exact path="/bankniftyoptionchain" component={BankNiftyOptionChain} />

          <Route path="/" component={NiftyOptionChain} />
        </Switch>
      </Router>
      {/* <Nifty50
        {...{
          selectedValue,
          setSelectedValue,
          handleChange,
          investingStockUrl,
          investingIndicesUrl,
        }}
      /> */}
      {/* <BankNifty /> */}
      {/* <Test /> */}
    </div>
  );
}

export default App;
