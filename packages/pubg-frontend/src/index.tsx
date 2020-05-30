import * as Sentry from "@sentry/browser";
import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import { SENTRY_URL } from "./constants";
import "./index.css";

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: SENTRY_URL,
  });
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
