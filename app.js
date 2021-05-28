const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");
const csrf = require("csurf");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const app = express();

//use  body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json);

//set up views
app.set("view engine", "ejs");
app.set("views", "views");

//multer - path - upload files
//1
//prems
const fileStorge = multer.diskStorage({
  destination: (request, file, callbake) => {
    callbake(null, "public/images");
  },
  filename: (request, file, callbake) => {
    callbake(null, file.originalname);
  },
});
//2
app.use(
  multer({ storage: fileStorge, limits: { fileSize: 25033697 } }).array("image")
);

app.use(express.static(path.join(__dirname, "public")));

app.use("/images", express.static("images"));

const indexController = require("./controllers/controller");
app.use("/", indexController);

const port = 3010;
app.listen(port, function () {
  console.log(`server is runing vie ${port}`);
});
