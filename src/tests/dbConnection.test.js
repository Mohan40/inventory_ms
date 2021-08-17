const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const mongod = new MongoMemoryServer();

//Connect to DB
module.exports.connect = async () => {
    const uri = await mongod.getUri();
    const moongooseOpts = {
        useNewUrlParser: true,
        useUnfiedTopology: true,
        poolSize: 10
    };
    await moongoose.connect(uri, moongooseOpts);
}

//Disconnect and lose the connection
module.exports.closeDatabase = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
}

//Clear the DB and remove all the data
module.exports.clearDatabase = async () => {
    const collections = mongoose.connection.collections;
    for (let key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
}
