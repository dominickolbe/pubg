import ReactGA from "react-ga";
import { GA_TRACKING_ID } from "./config";

const init = () => {
  return {
    initialize: () => {
      if (process.env.NODE_ENV === "production") {
        if (GA_TRACKING_ID === null) return;
        ReactGA.initialize(GA_TRACKING_ID);
      }
    },
    pageview: (page: string) => {
      if (process.env.NODE_ENV === "production") {
        if (GA_TRACKING_ID === null) return;
        ReactGA.pageview(page);
      }
    },
  };
};

export const TrackingClient = init();
