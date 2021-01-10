require("dotenv-safe").config();

import { Database } from "../database/mongo";
import { PlayerModel } from "../database/mongo/model/player";
import { importNewPlayer, importPlayerStats } from "../utils";

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

  const player = await PlayerModel.findOne({ name: playerNameArg });

  if (player) {
    console.log(`[Info]: skip import, player already exist`);

    // import player stats to db
    const resultStats = await importPlayerStats(player);
    return await exit(resultStats.ok ? 0 : 1);
  }

  // import player to db
  const newPlayer = await importNewPlayer(playerNameArg);
  if (!newPlayer.ok) return await exit(1);

  // import player stats to db
  const resultStats = await importPlayerStats(newPlayer.val);
  return await exit(resultStats.ok ? 0 : 1);
};

run();
