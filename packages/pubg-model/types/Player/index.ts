import * as rt from "runtypes";
import {
  RtPlayer,
  RtPlayerRequest,
  RtPlayersSearch,
  RtPlayersSearchSingle,
} from "../../runtypes/Player";

export type Player = rt.Static<typeof RtPlayer>;
export type PlayersSearch = rt.Static<typeof RtPlayersSearch>;
export type PlayersSearchSingle = rt.Static<typeof RtPlayersSearchSingle>;
export type PlayerRequest = rt.Static<typeof RtPlayerRequest>;
