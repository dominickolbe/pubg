import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import "./index.css";
import { SentryClient } from "./services/Sentry";
import { TrackingClient } from "./services/Tracking";

SentryClient.initialize();
TrackingClient.initialize();

ReactDOM.render(<App />, document.getElementById("root"));
