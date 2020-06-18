import * as rt from "runtypes";
import {
  RtMatch,
  RtMatchCreate,
  RtMatchesRequest,
  RtMatchRequest,
} from "../../runtypes/Match";

export type Match = rt.Static<typeof RtMatch>;
export type MatchCreate = rt.Static<typeof RtMatchCreate>;
export type MatchesRequest = rt.Static<typeof RtMatchesRequest>;
export type MatchRequest = rt.Static<typeof RtMatchRequest>;
