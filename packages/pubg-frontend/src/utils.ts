import * as Sentry from "@sentry/browser";
import axios from "axios";
import { createErr, createOk } from "option-t/cjs/PlainResult";
import { RtPlayerRequest } from "pubg-model/runtypes/Player";
import { API_BASE } from "./constants";

export const ApiController = {
  getPlayer: async (name: string) => {
    try {
      const response = await axios.get(`${API_BASE}/api/v1/players/${name}`);
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
};
