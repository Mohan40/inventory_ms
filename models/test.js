//This file is not part of the project. Only to be used to run or test something individually.

const mongoose = require("mongoose")

const connectDb = async () => {
  try {
    await mongoose.connect("mongodb://mohan:azsxdc!23@localhost:27017/inventory_ms_db", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
  } catch (error) {
    console.log(error.message)
  }
}
 
connectDb()
//retrieve my model
const user = mongoose.model('Users', {"userID" : String, "email": String, "password": String});

//const user = mongoose.Schema(users)
//console.log(JSON.stringify(user))



 

// create a blog post
const userSchema = new user({"userID" : 1, "email": "sample12344444@gmail.com", "password" : "test!23"});

 

// create a comment
//userSchema.email.push("test@example.com");

 

userSchema.save(function (err) {
  if (!err) console.log('Success!');
});
