import * as rt from "runtypes";
import {
  RtPubgPlayerRequest,
  RtPubgPlayerStatsKeysRequest,
  RtPubgPlayerStatsRequest,
} from "../../runtypes/PubgApi";

export type PubgPlayerRequest = rt.Static<typeof RtPubgPlayerRequest>;
export type PubgPlayerStatsKeysRequest = rt.Static<
  typeof RtPubgPlayerStatsKeysRequest
>;
export type PubgPlayerStatsRequest = rt.Static<typeof RtPubgPlayerStatsRequest>;
