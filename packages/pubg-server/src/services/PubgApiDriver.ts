import axios from "axios";
import { createErr, createOk, Result } from "option-t/cjs/PlainResult";
import {
  RtPubgPlayerRequest,
  RtPubgPlayerStatsRequest,
} from "pubg-model/runtypes/PubgApi";
import {
  PubgPlayerRequest,
  PubgPlayerStatsRequest,
} from "pubg-model/types/PubgApi";

const URL_API_BASE = "https://api.pubg.com/shards/steam";

const defaultHeader = {
  accept: "application/vnd.api+json",
};
const authHeader = {
  accept: "application/vnd.api+json",
  Authorization: `Bearer ${process.env.PUBG_API_TOKEN}`,
};

export const PubgApiDriver = {
  player: {
    getByName: async (
      playerName: string
    ): Promise<Result<PubgPlayerRequest, null>> => {
      try {
        const response = await axios.get(
          `${URL_API_BASE}/players?filter[playerNames]=${playerName}`,
          { headers: authHeader }
        );

        const request = RtPubgPlayerRequest.validate(response.data);
        if (!request.success) {
          console.log(
            `[Error]: PubgApiDriver.player.getByName validation error`
          );
          return createErr(null);
        }
        return createOk(response.data);
      } catch (error) {
        // player not found or request failed for other reasons
        console.log(error);
        return createErr(null);
      }
    },
    getLifetimeStats: async (
      id: string
    ): Promise<Result<PubgPlayerStatsRequest, null>> => {
      try {
        const response = await axios.get(
          `${URL_API_BASE}/players/${id}/seasons/lifetime`,
          { headers: authHeader }
        );
        const request = RtPubgPlayerStatsRequest.validate(response.data);
        if (!request.success) {
          console.log(
            `[Error]: PubgApiDriver.player.getLifetimeStats validation error`
          );
          return createErr(null);
        }
        return createOk(response.data);
      } catch (error) {
        console.log(error);
        return createErr(null);
      }
    },
  },
  matches: {
    getById: async (id: string) => {
      try {
        const response = await axios.get(`${URL_API_BASE}/matches/${id}`, {
          headers: defaultHeader,
        });
      } catch (error) {
        console.log(error);
        return createErr(null);
      }
    },
  },
};
