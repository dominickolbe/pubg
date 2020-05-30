require("dotenv-safe").config();

import { Database } from "../database";
import { PlayerDbController } from "../database/model/player";
import { importPlayerByName, importPlayerStats } from "../utils";

const run = async () => {
  const exit = async (exitCode: number) => {
    await Database.disconnect();
    process.exit(exitCode);
  };

  const playerNameArg = process.argv[2] ?? null;

  if (!playerNameArg) {
    console.log(`[Error]: player arg missing`);
    return await exit(1);
  }

  const db = await Database.connect();
  if (db.err) exit(1);

  const playerExist = await PlayerDbController.findByName(playerNameArg);

  if (playerExist.ok) {
    console.log(`[Info]: skip import, player already exist`);

    // import player stats to db
    const resultStats = await importPlayerStats(playerExist.val);
    return await exit(resultStats.ok ? 0 : 1);
  }

  // import player to db
  const player = await importPlayerByName(playerNameArg);
  if (!player.ok) return await exit(1);

  // import player stats to db
  const resultStats = await importPlayerStats(player.val);
  return await exit(resultStats.ok ? 0 : 1);
};

run();
