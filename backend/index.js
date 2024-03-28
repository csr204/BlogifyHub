const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./db");
// import { nanoid } from "nanoid";
const aws = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const admin = require("firebase-admin");
const googleAccountKey = require("./googleAuth.json");

require("dotenv").config();
connectDB();
const s3 = new aws.S3({
  region: "ap-south-1",
  accessKeyId: process.env.AWS_ACCESSKEY,
  secretAccessKey: process.env.AWS_SECRETACCESS,
});
const generateAWSUrl = async () => {
  let date = new Date();
  const imgName = `${uuidv4()}-${date.getTime()}.jpeg`;
  return await s3.getSignedUrlPromise("putObject", {
    Bucket: "blogs-yt",
    Expires: 3000,
    Key: imgName,
    ContentType: "image/jpeg",
  });
};
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "Content-Type",
    "Authorization"
  );
  next();
});

admin.initializeApp({
  credential: admin.credential.cert(googleAccountKey),
});

app.get("/", (req, res) => {
  res.send("home");
});

app.use("/auth", require("./routes/auth"));
app.use("/blogs", require("./routes/Blog"));
app.use("/users", require("./routes/user"));

app.get("/getawsurl", async (req, res) => {
  try {
    const url = await generateAWSUrl();
    return res.json({ message: url }).status(200);
  } catch (err) {
    return res.json({ message: err.message }).status(500);
  }
});

app.listen(3000, () => {
  console.log("listening");
});
