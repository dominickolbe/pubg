import * as rt from "runtypes";
import { RtStats, RtStatsObject } from "../../runtypes/Stats";

export type StatsObject = rt.Static<typeof RtStatsObject>;
export type Stats = rt.Static<typeof RtStats>;
