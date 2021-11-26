require("dotenv-safe").config();

import { HTTP_STATUS_TOO_MANY_REQUESTS } from "pubg-utils/src";
import { Database } from "../database/mongo";
import { PlayerModel } from "../database/mongo/model/player";
import { RedisCtrl } from "../database/redis";
import { updatePlayerStatsAndMatches } from "../utils";

const run = async () => {
  console.log("start job");

  const exit = async (exitCode: number) => {
    await RedisCtrl.end();
    await Database.disconnect();
    console.log("end job");
    process.exit(exitCode);
  };

  const db = await Database.connect();
  if (db.err) exit(1);

  const players = await PlayerModel.find({ autoUpdate: true });

  console.log(`${players.length} players found`);

  if (!players || players.length === 0) {
    return await exit(0);
  }

  for (const player of players) {
    console.log(`import stats for "${player.name}"`);

    const result = await updatePlayerStatsAndMatches(player);

    if (result.err === HTTP_STATUS_TOO_MANY_REQUESTS) {
      console.log(`[Error]: STOP importer. PUBG API LIMIT REACHED.`);
      await exit(0);
    }
  }

  await exit(0);
};

run();
