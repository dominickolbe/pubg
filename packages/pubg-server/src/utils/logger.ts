import { createLogger, format, transports } from "winston";

const { combine, timestamp, label, printf } = format;
const customFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] [${level}] ${message}`;
});

export const Logger = (params: { namespace: string }) => {
  const { namespace } = params;
  const logger = createLogger({
    format: combine(label({ label: namespace }), timestamp(), customFormat),
    transports: [new transports.Console({})],
  });

  if (process.env.NODE_ENV === "production") {
    logger.add(new transports.File({ filename: namespace + ".log" }));
  }

  return logger;
};
