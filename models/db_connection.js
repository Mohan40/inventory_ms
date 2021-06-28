const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoDB = "mongodb://mohan:azsxdc!23@localhost:27017/inventory_ms_db";
  await mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  });

  const db = mongoose.connection;

  db.on("error", () => {
    console.log("MongoDB Error: Connection failed.");
  });

  //module.exports = db;
};

module.exports = connectDB
