const { createLogger, format, transports } = require("winston");
const path = require("path")

const myFormat = format.printf(({ level, email, message, timestamp }) => {
  return `[${timestamp}] ${email} - ${level}: ${message}`;
});

const logger_error = createLogger({
  format: format.combine(format.json(), format.timestamp(), myFormat),
  transports: [
    new transports.File({ filename: path.join(__dirname, '../logs/error.log'), level: "error" })
  ]
});

const logger_info = createLogger({
  format: format.combine(format.json(), format.timestamp(), myFormat),
  transports: [
    new transports.File({ filename: path.join(__dirname, '../logs/info.log'), level: "info" })
  ]
});

module.exports = { logger_error, logger_info }