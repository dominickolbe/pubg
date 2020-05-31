require("dotenv-safe").config();

import { Database } from "../database";
import { PlayerDbController } from "../database/model/player";
import { importMatches } from "../utils";

const run = async () => {
  const exit = async (exitCode: number) => {
    await Database.disconnect();
    process.exit(exitCode);
  };

  console.log(`[Info]: start importing players matches task ...`);

  const db = await Database.connect();
  if (db.err) exit(1);

  const players = await PlayerDbController.find({});

  if (!players.ok || players.val.length === 0) {
    console.log(`[Info]: no players found`);
    return await exit(0);
  }

  console.log(`[Info]: ${players.val.length} players found`);

  for (const player of players.val) {
    await importMatches(player.pubgId);
  }

  return await exit(0);
};

run();
