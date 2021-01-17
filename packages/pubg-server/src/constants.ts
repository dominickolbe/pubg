// APP

export const PORT = process.env.PORT;
export const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;

// DATABASE

export const MONGO_HOST = `${process.env.MONGO_HOST}`;
export const REDIS_HOST = `${process.env.REDIS_HOST}`;

// API
export const PUBG_API_BASE = "https://api.pubg.com/shards/steam";

// CACHE
export const CACHE_TTL_PLAYER = 60 * 10;
export const CACHE_TTL_MATCHES = 60 * 5;

export const ON_THE_FLY_UPDATE_INTERVAL = 30;
