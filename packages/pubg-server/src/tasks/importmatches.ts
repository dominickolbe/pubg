require("dotenv-safe").config();

import { isBefore, parseISO, sub } from "date-fns";
import { Database } from "../database";
import { PlayerDbController } from "../database/model/player";
import { importMatches } from "../utils";

// min update interval in minutes
const MIN_UPDATE_INTERVAL = parseInt(process.argv[2] ?? 60);

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

  // only update player matches older than MIN_UPDATE_INTERVAL
  const playersToUpdate = players.val.filter(
    (i) =>
      i.matchesUpdatedAt === null ||
      isBefore(
        parseISO(i.matchesUpdatedAt),
        sub(new Date(), { minutes: MIN_UPDATE_INTERVAL })
      )
  );

  console.log(`[Info]: ${playersToUpdate.length} players found`);

  for (const player of playersToUpdate) {
    await importMatches(player);
  }

  return await exit(0);
};

run();
