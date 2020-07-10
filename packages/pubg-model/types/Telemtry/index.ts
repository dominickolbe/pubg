import * as rt from "runtypes";
import { RtTelemtry } from "../../runtypes/Telemtry";

export type Telemtry = rt.Static<typeof RtTelemtry>;

export interface ITelemtryKill {
  victim: {
    name: string;
    isBot: boolean;
  };
  damageTypeCategory: string;
  damageCauserName: string;
  timestamp: string;
}

export interface ITelemtryPlayer {
  kills: ITelemtryKill[];
  totalBots: number;
}
