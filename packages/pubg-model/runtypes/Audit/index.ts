import * as rt from "runtypes";

export const RtAudit = rt.Record({
  request: rt.Record({
    ip: rt.String,
    method: rt.String,
    path: rt.String,
  }),
  createdAt: rt.InstanceOf(Date),
});
