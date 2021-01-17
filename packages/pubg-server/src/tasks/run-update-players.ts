import { HTTP_STATUS_TOO_MANY_REQUESTS } from "pubg-utils/src";
import { Database } from "../database/mongo";
import { PlayerModel } from "../database/mongo/model/player";
import { redisDatabase } from "../database/redis";
import { updatePlayerStatsAndMatches } from "../utils";
import { Logger } from "../utils/logger";

const run = async () => {
  const logger = Logger({ namespace: "run-update-players" });

  logger.info("start job");

  const exit = async (exitCode: number) => {
    redisDatabase.end();
    await Database.disconnect();
    logger.info("end job");
    process.exit(exitCode);
  };

  const db = await Database.connect();
  if (db.err) exit(1);

  const players = await PlayerModel.find({ autoUpdate: true });

  logger.info(`${players.length} players found`);

  if (!players || players.length === 0) {
    return await exit(0);
  }

  for (const player of players) {
    logger.info(`import stats for "${player.name}"`);

    const result = await updatePlayerStatsAndMatches(player);

    if (result.err === HTTP_STATUS_TOO_MANY_REQUESTS) {
      console.log(`[Error]: STOP importer. PUBG API LIMIT REACHED.`);
      logger.error("PUBG API LIMIT REACHED");
      await exit(0);
    }
  }

  redisDatabase.flushdb();

  await exit(0);
};

run();
