
const multer = require('multer')

const fileLoader = multer.memoryStorage({
    destination: function(req, file, cb){
        cb(null, '');
    }
});

module.exports = fileLoader;


