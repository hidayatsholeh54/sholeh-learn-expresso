import pino from "pino";

const logger = pino({
  level: "info",
  base: null, // kalo mau ngilangin pid & hostname
});

export default logger;