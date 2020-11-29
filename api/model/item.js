const mongoose = require('mongoose');
const Media = require('../model/media')

const itemSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    description: String,
    category: String,
    price: Number,
    createdDate: { type: Date, default: Date.now },
    images: [{ location: String, isCover: Boolean }]
});

module.exports = mongoose.model('Item', itemSchema);

