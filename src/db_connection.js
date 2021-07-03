const mongoose = require("mongoose");
const logger_error = require("./logger");

const connectDB = async () => {
  const mongoDB = "mongodb://mohan:azsxdc!23@localhost:27017/inventory_ms_db";
  await mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });

  const db = mongoose.connection;

  db.on("error", () => {
    logger_error.log({
      level: "error",
      message: "MongoDB Error: Connection failed.",
    });
  });
};

module.exports = connectDB;
