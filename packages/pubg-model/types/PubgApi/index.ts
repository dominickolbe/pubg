import * as rt from "runtypes";
import {
  RtPubgMatchRequest,
  RtPubgPlayerRequest,
  RtPubgPlayerStatsRequest,
} from "../../runtypes/PubgApi";

export type PubgPlayerRequest = rt.Static<typeof RtPubgPlayerRequest>;
export type PubgPlayerStatsRequest = rt.Static<typeof RtPubgPlayerStatsRequest>;
export type PubgMatchRequest = rt.Static<typeof RtPubgMatchRequest>;
