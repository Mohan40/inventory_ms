//Database connection file

const mongoose = require("mongoose");
const { loggerError } = require("../logger");

//Connect to mongoDB
const connectDB = async () => {
  const mongoDB = "mongodb://mohan:azsxdc!23@localhost:27017/inventoryMS";
  await mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });

  const db = mongoose.connection;

  db.on("error", () => {
    loggerError.log({
      level: "error",
      message: "MongoDB Error: Connection failed.",
    });
  });
};

module.exports = connectDB;
