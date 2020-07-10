import { isBefore, parseISO, sub } from "date-fns";
import Koa from "koa";
import Router from "koa-router";
import { IPlayer } from "pubg-model/types/Player";
import {
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_OK,
  HTTP_STATUS_TOO_MANY_REQUESTS,
} from "pubg-utils/src";
import { ON_THE_FLY_UPDATE_INTERVAL } from "../constants";
import { PlayerDbController, PlayerModel } from "../database/model/player";
import { auditLog } from "../middlewares/audit";
import {
  cache,
  duplicatedPlayerCheck,
  importNewPlayer,
  updatePlayerStatsAndMatches,
} from "../utils";

export const setUpApi = (params: { prefix: string }) => {
  const { prefix } = params;
  return {
    init: (app: Koa) => {
      const router = new Router();

      app.use(auditLog);

      router.get("/status", async (ctx) => {
        ctx.response.status = HTTP_STATUS_OK;
      });

      // PLAYERS

      router.get("/players/search", async (ctx) => {
        const players = await PlayerDbController.search(ctx.query.q);
        if (players.ok) {
          ctx.body = players.val;
        }
      });

      router.get("/players/:id", duplicatedPlayerCheck, async (ctx, next) => {
        const returnPlayer = (player: IPlayer) => {
          const resp = player.toObject();
          delete resp.matches;
          ctx.body = resp;
          return next();
        };

        const updatePlayer = async (player: IPlayer) => {
          if (
            player.statsUpdatedAt === null ||
            player.matchesUpdatedAt === null ||
            isBefore(
              parseISO(player.statsUpdatedAt),
              sub(new Date(), { minutes: ON_THE_FLY_UPDATE_INTERVAL })
            ) ||
            isBefore(
              parseISO(player.matchesUpdatedAt),
              sub(new Date(), { minutes: ON_THE_FLY_UPDATE_INTERVAL })
            )
          ) {
            const result = await updatePlayerStatsAndMatches(player);
            if (result.ok) return result.val;
          }
          return player;
        };

        const player = await PlayerModel.findOne({
          name: ctx.params.id,
        });

        // return player if found
        if (player) {
          const updatedPlayer = await updatePlayer(player);
          return returnPlayer(updatedPlayer);
        }

        // try to import player
        const importedPlayer = await importNewPlayer(ctx.params.id);

        if (importedPlayer.ok) {
          const updatedPlayer = await updatePlayer(importedPlayer.val);
          return returnPlayer(updatedPlayer);
        } else if (importedPlayer.err !== HTTP_STATUS_TOO_MANY_REQUESTS) {
          // TODO check if cache is still working
          // add failed player request to cache
          cache.pubgPlayerNotFound.push(ctx.params.id);
          ctx.response.status = HTTP_STATUS_NOT_FOUND;
          return next();
        } else if (importedPlayer.err === HTTP_STATUS_TOO_MANY_REQUESTS) {
          ctx.response.status = HTTP_STATUS_TOO_MANY_REQUESTS;
          return next();
        }
      });

      // MATCHES

      router.get("/matches/:id", async (ctx, next) => {
        const limit = parseInt(ctx.query.limit) ?? 10;
        const offset = parseInt(ctx.query.offset) ?? 0;

        const matches = await PlayerDbController.findMatches(
          { name: ctx.params.id },
          limit,
          offset
        );

        if (matches.ok) {
          ctx.body = matches.val;
          return next();
        }

        ctx.response.status = HTTP_STATUS_NOT_FOUND;
      });

      router.allowedMethods();
      router.prefix(prefix);

      app.use(router.routes());
    },
  };
};
