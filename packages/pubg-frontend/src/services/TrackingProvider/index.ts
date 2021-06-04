import ReactGA from "react-ga";
import { GA_TRACKING_ID } from "./config";

export const initializeTracking = () => {
  if (process.env.NODE_ENV === "production") {
    if (GA_TRACKING_ID === null) return;
    ReactGA.initialize(GA_TRACKING_ID);
    ReactGA.pageview("/");
  }
};
