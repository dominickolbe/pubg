require("dotenv-safe").config();

import { Database } from "../database";
import { PlayerDbController } from "../database/model/player";
import { importMatch } from "../utils";
import { PubgApiDriver } from "../services/PubgApiDriver";

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

  if (!playerExist.ok) {
    console.log(`[Error]: player "${playerNameArg}" not found`);
    return await exit(1);
  }

  return await exit(0);
};

run();
