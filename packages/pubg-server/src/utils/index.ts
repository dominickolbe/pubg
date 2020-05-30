import Koa from "koa";
import { createErr, createOk, Result } from "option-t/cjs/PlainResult";
import { Player } from "pubg-model/types/Player";
import { HTTP_STATUS_NOT_FOUND } from "pubg-utils/src";
import { PlayerDbController } from "../database/model/player";
import { PubgApiDriver } from "../services/PubgApiDriver";

export const importPlayerByName = async (name: string) => {
  console.log(`[Info]: start importing player "${name}" ...`);

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

export const importPlayerStats = async (
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

export const cache: {
  pubgPlayerNotFound: string[];
} = {
  pubgPlayerNotFound: [],
};

export const duplicatedPlayerCheck = (ctx: Koa.Context, next: Koa.Next) => {
  if (cache.pubgPlayerNotFound.includes(ctx.params.id)) {
    ctx.response.status = HTTP_STATUS_NOT_FOUND;
    ctx.throw(HTTP_STATUS_NOT_FOUND);
  }
  return next();
};
