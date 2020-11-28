const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const listItem = require('./api/route/listitem');
const uri = "mongodb+srv://rootdb:cLZVrKDPz9rtRKeh@qafficient.leqm1.mongodb.net/rentaway-db?retryWrites=true&w=majority";
mongoose.connect(uri);

require('dotenv').config()

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/listitem',listItem);

module.exports = app;

