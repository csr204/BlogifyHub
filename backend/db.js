const mongoose = require("mongoose");
const dbname = "blogs";
const connectDB = () => {
  try {
    mongoose.connect(process.env.MONGO_URI + dbname);
    mongoose.connection.once("open", () => {
      console.log("connected to db");
    });
  } catch (err) {
    console.log(err);
  }
};
module.exports = connectDB;
