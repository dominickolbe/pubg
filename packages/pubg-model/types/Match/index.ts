import * as rt from "runtypes";
import { RtMatch, RtMatchImport } from "../../runtypes/Match";

export type Match = rt.Static<typeof RtMatch>;
export type MatchImport = rt.Static<typeof RtMatchImport>;
