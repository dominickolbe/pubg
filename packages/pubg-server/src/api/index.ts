import Koa from "koa";
import Router from "koa-router";
import { IPlayer } from "pubg-model/types/Player";
import {
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_OK,
  HTTP_STATUS_TOO_MANY_REQUESTS,
} from "pubg-utils/src";
import { PlayerDbController, PlayerModel } from "../database/model/player";
import {
  cache,
  duplicatedPlayerCheck,
  importNewPlayer,
  importPlayerStats,
} from "../utils";

export const setUpApi = (params: { prefix: string }) => {
  const { prefix } = params;
  return {
    init: (app: Koa) => {
      const router = new Router();

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

        const player = await PlayerModel.findOne({
          name: ctx.params.id,
        }).select("-matches");

        // return player if found
        if (player) {
          ctx.body = player;
          return next();
        }

        // try to import player
        const newPlayer = await importNewPlayer(ctx.params.id);

        if (newPlayer.ok) {
          const result = await importPlayerStats(newPlayer.val);
          if (result.ok) {
            // return imported player with stats
            return returnPlayer(result.val);
          } else {
            // return imported player without stats
            return returnPlayer(newPlayer.val);
          }
        } else if (newPlayer.err !== HTTP_STATUS_TOO_MANY_REQUESTS) {
          // TODO check if cache is still working
          // add failed player request to cache
          cache.pubgPlayerNotFound.push(ctx.params.id);
        }

        ctx.response.status = HTTP_STATUS_NOT_FOUND;
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
