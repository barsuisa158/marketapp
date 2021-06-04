const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");
const multer = require("multer");
const csrf = require("csurf");
const mongoose = require("mongoose");
const session = require("express-session");
const { request, response } = require("express");
const MongoDBStore = require("connect-mongodb-session")(session);

const app = express();

//SET UP VIEWS
app.set("view engine", "ejs"); // צד שמאל באיזה מנוע אנחנו רוצים להשתמש ובצד ימין איזה תיקייה או ספריה
app.set("views", "views");

//USE BODY PARSER
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//MULTER - PATH - UPLOAD FILES
//1
const fileStorage = multer.diskStorage({
  destination: (request, file, callback) => {
    //פונקצית פרמס שעושה 2 פעולות
    callback(null, "public/images");
  },
  filename: (request, file, callback) => {
    callback(null, file.originalname);
  },
});
//2
app.use(
  multer({ storage: fileStorage, limits: { fieldSize: 25033697 } }).array(
    "image"
  )
); //קובע חוק באתר שכל השדות של התמונות יהיו אימג
app.use(express.static(path.join(__dirname, "public"))); //איזה תיקייה היא התיקייה הציבורית שפתוחה לתמונות ולמה שצריף
app.use("/images", express.static("images"));

const csurfProtection = csrf();

const mongo_uri =
  "mongodb+srv://bar:bar250697@bar.pqj9f.mongodb.net/marketNew?retryWrites=true&w=majority";
const store = new MongoDBStore({
  uri: mongo_uri,
  collection: "sessions",
});
//2
app.use(
  session({
    secret: 'pt]c=`"DII%7IYq0Ut1{',
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use((request, response, next) => {
  if (!request.session.account) {
    return next();
  }
  account
    .findById(request.session.account._id)
    .then((account) => {
      request.account = account;
      next();
    })
    .catch((error) => console.log(error));
});

app.use(csurfProtection);
//3
app.use((request, response, next) => {
  response.locals.csrfToken = request.csrfToken();
  next();
});

const indexController = require("./controllers/index");

app.use("/", indexController);

const port = 6060;
mongoose
  .connect(mongo_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((database_connect_results) => {
    console.log(database_connect_results);
    app.listen(port, function () {
      console.log(`Server is running via ${port}`);
    });
  })
  .catch((error) => console.log(error));
