const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  email: String,
  password: String,
  city: String,
  mobile: Number,
  countrycode: {type: String, default: "=+91"}
});

module.exports = mongoose.model("User", userSchema);
