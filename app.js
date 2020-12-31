const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();

const listItem = require("./api/route/listitem");
const userservice = require("./api/route/userservice");
const ErrorService = require('./api/error/errorservice');

const uri =
  "mongodb+srv://" +
  process.env.RENT_AWAY_DB_UN +
  ":" +
  process.env.RENT_AWAY_DB +
  "@qafficient.leqm1.mongodb.net/rentaway-db?retryWrites=true&w=majority";
mongoose.connect(uri,{useNewUrlParser: true});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,boundary');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.use("/listitem", listItem);
app.use("/user", userservice);
app.use("/", ErrorService);


module.exports = app;
