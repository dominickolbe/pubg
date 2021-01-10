require("dotenv-safe").config();

import { Database } from "../database/mongo";
import { redisDatabase } from "../database/redis";

const run = async () => {
  const db = await Database.connect();
  if (db.err) process.exit(1);

  console.log("[Info]: run-update-players");

  redisDatabase.flushdb();

  await Database.disconnect();
  process.exit(0);
};

run();
