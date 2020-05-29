require("dotenv-safe").config();

import { createErr, createOk, Result } from "option-t/cjs/PlainResult";
import { Player } from "pubg-model/types/Player";
import { Database } from "../database";
import { PlayerDbController } from "../database/model/player";
import { PubgApiDriver } from "../services/PubgApiDriver";

const importPlayer = async (name: string): Promise<Result<Player, null>> => {
  console.log(`[Info]: start importing player ...`);

  const response = await PubgApiDriver.player.getByName(name);

  if (!response.ok || response.val.data.length !== 1) {
    console.log(`[Error]: pubg api request failed`);
    return createErr(null);
  }

  const player = await PlayerDbController.save(
    response.val.data[0].id,
    response.val.data[0].attributes.name
  );

  if (!player.ok) {
    console.log(`[Error]: import player to db failed`);
    return createErr(null);
  }

  console.log(`[Info]: player "${player.val.name}" successfully imported`);

  return createOk(player.val);
};

const importPlayerStats = async (
  player: Player
): Promise<Result<Player, null>> => {
  console.log(`[Info]: start importing player stats...`);

  const request = await PubgApiDriver.player.getLifetimeStats(player.pubgId);

  if (!request.ok) {
    console.log(`[Error]: pubg api request failed`);
    return createErr(null);
  }

  const newPlayer = await PlayerDbController.updateStats(
    player._id,
    request.val.data.attributes.gameModeStats
  );

  if (!newPlayer.ok) {
    console.log(`[Error]: update player to db failed`);
    return createErr(null);
  }

  console.log(
    `[Info]: stats for player "${newPlayer.val.name}" successfully imported`
  );

  return createOk(newPlayer.val);
};

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
  const player = await importPlayer(playerNameArg);
  if (!player.ok) return await exit(1);

  // import player stats to db
  const resultStats = await importPlayerStats(player.val);
  return await exit(resultStats.ok ? 0 : 1);
};

run();
