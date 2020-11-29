const mongoose = require("mongoose");

const mediaSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  item_id: String,
  images: [{ location: String, isCover: Boolean }],
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Media", mediaSchema);
