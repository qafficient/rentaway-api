const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();

const listItem = require("./api/route/listitem");
const uri =
  "mongodb+srv://" +
  process.env.RENT_AWAY_DB_UN +
  ":" +
  process.env.RENT_AWAY_DB +
  "@qafficient.leqm1.mongodb.net/rentaway-db?retryWrites=true&w=majority";
mongoose.connect(uri);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/listitem", listItem);

module.exports = app;
