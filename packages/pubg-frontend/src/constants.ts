export const APP_TITLE =
  process.env.NODE_ENV === "production" ? "pubg.lol" : "pubg.lol (dev)";

export const API_BASE = process.env.REACT_APP_API_URL;
export const SENTRY_URL = process.env.REACT_APP_SENTRY_URL;

export const matchRequestDefaults = {
  limit: 50,
  offset: 0,
};

export const PLAYER_VIEW_UPDATE_INTERVAL = 1000 * 60 * 5; // last number is in "minutes"
