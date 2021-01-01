const mongoose = require('mongoose');


const itemSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    description: String,
    category: String,
    rentprice: [{ price: Number, unit:String, tenure: String }],
    userId: String,
    city: String,
    status: {type: String, default: 'active'},
    createdDate: { type: Date, default: Date.now },
    images: [{ location: String, isCover: Boolean }]
});

module.exports = mongoose.model('Item', itemSchema);

