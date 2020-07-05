import * as Sentry from "@sentry/browser";
import axios from "axios";
import { createErr, createOk } from "option-t/cjs/PlainResult";
import { RtPlayerRequest } from "pubg-model/runtypes/Player";
import { RtMatchesRequest } from "pubg-model/runtypes/Match";
import { API_BASE } from "../../constants";

export const ApiController = {
  getPlayer: async (name: string) => {
    try {
      const response = await axios.get(`${API_BASE}/api/players/${name}`);
      try {
        const player = RtPlayerRequest.check(response.data);
        return createOk(player);
      } catch (error) {
        console.log(error);
        Sentry.captureException(error);
        return createErr(error);
      }
    } catch (error) {
      // TODO: check if not found or api error
      console.log(error);
      return createErr(error);
    }
  },
  getPlayerMatches: async (name: string, limit: number, offset: number) => {
    try {
      const response = await axios.get(
        `${API_BASE}/api/players/${name}/matches?limit=${limit}&offset=${offset}`
      );
      try {
        const matches = RtMatchesRequest.check(response.data);
        return createOk(matches);
      } catch (error) {
        console.log(error);
        Sentry.captureException(error);
        return createErr(error);
      }
    } catch (error) {
      // TODO: check if not found or api error
      console.log(error);
      return createErr(error);
    }
  },
  search: async (query: string) => {
    try {
      const response = await axios.get(
        `${API_BASE}/api/players/search?q=${query}`
      );
      return createOk(response.data);
    } catch (error) {
      console.log(error);
      return createErr(error);
    }
  },
  getTelemetry: async (url: string) => {
    try {
      const response = await axios.get(url);
      return createOk(response.data);
    } catch (error) {
      console.log(error);
      return createErr(error);
    }
  },
};
