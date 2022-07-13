import { createLogger, format, transports } from "winston";
const { combine, label, colorize, timestamp, simple, splat } = format;

export default createLogger({
  format: combine(
    label({
      label: "[ILocal]",
    }),
    colorize(),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    splat(),
    simple(),
    format.printf(
      (info) =>
        `${info.label} ${info.timestamp} ${info.level}: ${info.message}` +
        (info.splat !== undefined ? `${info.splat}` : " ")
    )
  ),
  transports: [new transports.Console()],
});
