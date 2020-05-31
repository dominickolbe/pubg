import axios from "axios";
import { createErr, createOk, Result } from "option-t/cjs/PlainResult";
import {
  RtPubgMatchRequest,
  RtPubgPlayerRequest,
  RtPubgPlayerStatsRequest,
} from "pubg-model/runtypes/PubgApi";
import {
  PubgMatchRequest,
  PubgPlayerRequest,
  PubgPlayerStatsRequest,
} from "pubg-model/types/PubgApi";
import {
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_TOO_MANY_REQUESTS,
} from "pubg-utils/src";
import { PUBG_API_BASE } from "../constants";

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
    ): Promise<Result<PubgPlayerRequest, number | null>> => {
      try {
        const response = await axios.get(
          `${PUBG_API_BASE}/players?filter[playerNames]=${playerName}`,
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
        if (error.response!.status === HTTP_STATUS_NOT_FOUND) {
          console.log(
            `[Error]: PubgApiDriver.player.getByName HTTP_STATUS_NOT_FOUND`
          );
          return createErr(HTTP_STATUS_NOT_FOUND);
        } else if (error.response!.status === HTTP_STATUS_TOO_MANY_REQUESTS) {
          console.log(
            `[Error]: PubgApiDriver.player.getByName HTTP_STATUS_TOO_MANY_REQUESTS`
          );
          return createErr(HTTP_STATUS_TOO_MANY_REQUESTS);
        } else {
          console.log(error);
        }
        return createErr(null);
      }
    },
    getLifetimeStats: async (
      id: string
    ): Promise<Result<PubgPlayerStatsRequest, number | null>> => {
      try {
        const response = await axios.get(
          `${PUBG_API_BASE}/players/${id}/seasons/lifetime`,
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
        if (error.response!.status === HTTP_STATUS_NOT_FOUND) {
          console.log(
            `[Error]: PubgApiDriver.player.getByName HTTP_STATUS_NOT_FOUND`
          );
          return createErr(HTTP_STATUS_NOT_FOUND);
        } else if (error.response!.status === HTTP_STATUS_TOO_MANY_REQUESTS) {
          console.log(
            `[Error]: PubgApiDriver.player.getByName HTTP_STATUS_TOO_MANY_REQUESTS`
          );
          return createErr(HTTP_STATUS_TOO_MANY_REQUESTS);
        } else {
          console.log(error);
        }
        return createErr(null);
      }
    },
  },
  matches: {
    getById: async (
      id: string
    ): Promise<Result<PubgMatchRequest, number | null>> => {
      try {
        const response = await axios.get(`${PUBG_API_BASE}/matches/${id}`, {
          headers: defaultHeader,
        });
        const request = RtPubgMatchRequest.validate(response.data);
        if (!request.success) {
          console.log(
            `[Error]: PubgApiDriver.matches.getById validation error`
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
};
