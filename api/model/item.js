const mongoose = require('mongoose');
const Media = require('../model/media')

const itemSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    description: String,
    price: Number,
    createdDate: { type: Date, default: Date.now }
    
});

module.exports = mongoose.model('Item', itemSchema);

