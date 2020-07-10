import * as rt from "runtypes";

export const RtTelemtryEvent_Any = rt.Record({
  _D: rt.String,
});

export const RtTelemtryEvent_PlayerKill = rt.Record({
  _T: rt.Literal("LogPlayerKill"),
  _D: rt.String,
  damageTypeCategory: rt.String,
  damageCauserName: rt.String,
  killer: rt.Record({
    name: rt.String,
    accountId: rt.String,
    health: rt.Number,
    teamId: rt.Number,
  }),
  victim: rt.Record({
    name: rt.String,
    accountId: rt.String,
    health: rt.Number,
    teamId: rt.Number,
  }),
});

export const RtTelemtryEvent_PlayerTakeDamage = rt.Record({
  _T: rt.Literal("LogPlayerTakeDamage"),
  _D: rt.String,
  attackType: rt.String,
  attacker: rt.Record({
    name: rt.String,
    accountId: rt.String,
    health: rt.Number,
    teamId: rt.Number,
  }),
  victim: rt.Record({
    name: rt.String,
    accountId: rt.String,
    health: rt.Number,
    teamId: rt.Number,
  }),
});

export const RtTelemtryEvent_PlayerPosition = rt.Record({
  _T: rt.Literal("LogPlayerPosition"),
  _D: rt.String,
  character: rt.Record({
    name: rt.String,
    accountId: rt.String,
    health: rt.Number,
    teamId: rt.Number,
  }),
});

export const RtTelemtryEvent_LogMatchEnd = rt.Record({
  _T: rt.Literal("LogMatchEnd"),
  _D: rt.String,
  characters: rt.Array(
    rt.Record({
      character: rt.Record({
        name: rt.String,
        accountId: rt.String,
      }),
    })
  ),
});

export const RtTelemtry = rt.Array(
  RtTelemtryEvent_Any.Or(RtTelemtryEvent_PlayerKill)
    .Or(RtTelemtryEvent_PlayerTakeDamage)
    .Or(RtTelemtryEvent_PlayerPosition)
    .Or(RtTelemtryEvent_LogMatchEnd)
);
