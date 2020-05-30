import * as rt from "runtypes";
import { RtPlayer, RtPlayerRequest } from "../../runtypes/Player";

export type Player = rt.Static<typeof RtPlayer>;
export type PlayerRequest = rt.Static<typeof RtPlayerRequest>;
