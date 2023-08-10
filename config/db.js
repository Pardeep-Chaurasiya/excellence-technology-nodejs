// const mongoose = require("mongoose");

// const connectDB = async () => {
//   try {
//     await mongoose.connect("mongodb://127.0.0.1:27017/UsersDB");
//     console.log("DB has been connected");
//   } catch (error) {
//     console.log("DB  connection failed", error);
//   }
// };

const md5 = require("md5");
const { MongoClient, ObjectId } = require("mongodb");
const dotenv = require("dotenv").config();
const data = require("../data.json");
console.log(data);

const url = process.env.Mongo_URL;
const client = new MongoClient(url);
const dbName = "UsersDB";

const connectDB = async () => {
  await client.connect();
  console.log("Connected successfully to server");
  const db = client.db(dbName);

  const collectionUser = db.collection("Users");
  const collectionUsersProfile = db.collection("UsersProfile");

  for (let i = 0; i < data.length; i++) {
    const insertUser = await collectionUser.insertOne({
      first_name: data[i].first_name,
      last_name: data[i].last_name,
      email: data[i].email,
      password: md5(data[i].password),
    });
    await collectionUsersProfile.insertOne({
      user_id: insertUser.insertedId.toString(),
      dob: data[i].dob,
      Mobile_no: data[i].mobile_no,
    });
  }
};

module.exports = connectDB;
