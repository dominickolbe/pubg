require("dotenv-safe").config();

import { isBefore, parseISO, sub } from "date-fns";
import { HTTP_STATUS_TOO_MANY_REQUESTS } from "pubg-utils/src";
import { Database } from "../database";
import { PlayerModel } from "../database/model/player";
import { updatePlayerStatsAndMatches } from "../utils";

// min update interval in minutes
const MIN_UPDATE_INTERVAL = parseInt(process.argv[2] ?? 60);

const run = async () => {
  const exit = async (exitCode: number) => {
    await Database.disconnect();
    process.exit(exitCode);
  };

  console.log(`[Info]: start update players task ...`);

  const db = await Database.connect();
  if (db.err) exit(1);

  const players = await PlayerModel.find();

  if (!players || players.length === 0) {
    console.log(`[Info]: no players found`);
    return await exit(0);
  }

  // TODO check dates still working
  // only update specfic player
  const playersToUpdate = players.filter(
    (i) =>
      i.statsUpdatedAt === null ||
      isBefore(
        parseISO(i.statsUpdatedAt),
        sub(new Date(), { minutes: MIN_UPDATE_INTERVAL })
      ) ||
      i.matchesUpdatedAt === null ||
      isBefore(
        parseISO(i.matchesUpdatedAt),
        sub(new Date(), { minutes: MIN_UPDATE_INTERVAL })
      )
  );

  console.log(`[Info]: ${playersToUpdate.length} players found`);

  for (const player of playersToUpdate) {
    console.log(`[Info]: start to import stats for "${player.name}" ...`);
    const result = await updatePlayerStatsAndMatches(player);

    // TODO: ???
    if (result.err === HTTP_STATUS_TOO_MANY_REQUESTS) {
      console.log(`[Info]: STOP importer. PUBG API LIMIT REACHED.`);
      await exit(0);
    }
  }

  console.log(`[Info]: finished update players task.`);
  await exit(0);
};

run();
