import * as rt from "runtypes";
import { RtMatch, RtMatchCreate } from "../../runtypes/Match";

export type Match = rt.Static<typeof RtMatch>;
export type MatchCreate = rt.Static<typeof RtMatchCreate>;
