//Server file

const app = require("./app");
const { logger } = require("./src/logger");

//process.env.NODE_ENV = 'development';

//To execute file in production "PORT=9999 node app.js"
//Use port in process.env if available or use 443
const PORT = process.env.PORT || 443;

//Specifying a port that the server can listen to
app.listen(PORT, () => {
  logger.log({
    level: "info",
    message: "Server is running on port 443...",
  });
  console.log("Server is running on port 443...");
});
