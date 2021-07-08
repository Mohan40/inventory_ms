//File is used to define logging formats and functions

const { createLogger, format, transports } = require("winston");
const path = require("path");

//Format for log file
const myFormat = format.printf(({ level, email, message, timestamp }) => {
  return `[${timestamp}] ${email} - ${level}: ${message}`;
});

//Error file function
const loggerError = createLogger({
  format: format.combine(format.json(), format.timestamp(), myFormat),
  transports: [
    new transports.File({
      filename: path.join(__dirname, "../logs/error.log"),
      level: "error",
    }),
  ],
});

//Info file function
const loggerInfo = createLogger({
  format: format.combine(format.json(), format.timestamp(), myFormat),
  transports: [
    new transports.File({
      filename: path.join(__dirname, "../logs/info.log"),
      level: "info",
    }),
  ],
});

module.exports = { loggerError, loggerInfo };
