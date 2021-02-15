// APP

export const PORT = process.env.PORT;
export const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;

export const CUSTOM_HEADER = {
  API_KEY: "x-api-key",
  CACHE_CONTROL: "x-cache-control",
};

// AUTH

export const AUTH_API_KEY = `${process.env.AUTH_API_KEY}`;

// DATABASE

export const MONGO_HOST = `${process.env.MONGO_HOST}`;
export const REDIS_HOST = `${process.env.REDIS_HOST}`;

// API

export const PUBG_API_BASE = "https://api.pubg.com/shards/steam";

// CACHE

export const CACHE_TTL_DEFAULT = 60 * 5;

export const ON_THE_FLY_UPDATE_INTERVAL = 30;
