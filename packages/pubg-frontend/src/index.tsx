import "core-js/es/map";
import "core-js/es/set";

import * as Sentry from "@sentry/browser";
import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import { SENTRY_URL } from "./constants";
import "./index.css";

if (process.env.NODE_ENV === "production") {
  if (SENTRY_URL) {
    Sentry.init({
      dsn: SENTRY_URL,
    });
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
