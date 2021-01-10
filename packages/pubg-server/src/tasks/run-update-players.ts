require("dotenv-safe").config();

import { HTTP_STATUS_TOO_MANY_REQUESTS } from "pubg-utils/src";
import { Database } from "../database/mongo";
import { PlayerModel } from "../database/mongo/model/player";
import { redisDatabase } from "../database/redis";
import { updatePlayerStatsAndMatches } from "../utils";

const run = async () => {
  console.log("[Info]: run-update-players");

  const exit = async (exitCode: number) => {
    await Database.disconnect();
    process.exit(exitCode);
  };

  const db = await Database.connect();
  if (db.err) exit(1);

  const players = await PlayerModel.find({ autoUpdate: true });

  if (!players || players.length === 0) {
    console.log(`[Info]: no players found`);
    return await exit(0);
  }

  console.log(`[Info]: ${players.length} players found`);

  for (const player of players) {
    console.log(`[Info]: start to import stats for "${player.name}" ...`);
    const result = await updatePlayerStatsAndMatches(player);

    if (result.err === HTTP_STATUS_TOO_MANY_REQUESTS) {
      console.log(`[Error]: STOP importer. PUBG API LIMIT REACHED.`);
      await exit(0);
    }
  }

  redisDatabase.flushdb();

  await exit(0);
};

run();
