const mongoose = require('mongoose');

const mediaSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    item_id: String,
    location: String,
    isCover: Boolean

});

module.exports = mongoose.model('Media', mediaSchema);

