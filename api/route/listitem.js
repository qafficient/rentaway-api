require("dotenv").config();

const { v4: uuidv4 } = require("uuid");

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const AWS = require("aws-sdk");

const storage = require("./fileloader");
const upload = multer({ storage: storage }).array("itemImage");

const Item = require("../model/item");
const Media = require("../model/media");
const item = require("../model/item");

router.get("/", (req, res, next) => {

  Item.find({}).exec().then( (doc) => {
    console.log(doc);
    res.status(200).json(doc);
  })
  .catch(error => {console.log(error)})
});

const s3 = new AWS.S3({
  accessKeyId: process.env.ID,
  secretAccessKey: process.env.SECRET,
});

router.post("/", upload, (req, res, next) => {

  var promises = [];
  req.files.forEach(function (imgItem, index, array) {
      if(index == 0){
        promises.push(uploadToS3(imgItem, true));
      }else{
        promises.push(uploadToS3(imgItem, false));
      }
  });
  Promise.all(promises).then((imageEntries) => {
     newRentItemEntry(req, res, imageEntries);
  });   
});


function newRentItemEntry(req, res, imageEntries){
  const item = new Item({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    images: imageEntries
  });

  item
    .save()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: result,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Could not create item",
      });
    });
}

function uploadToS3(imgItem, isCoverImage) {
    return new Promise( function (resolve, reject) {
        imgItems = imgItem.originalname.split(".");
        const fileType = imgItems[imgItems.length - 1];
        const params = buildParam(imgItem, fileType);       
        var s3uploadResult = s3.upload(params).promise();
        s3uploadResult
            .then((uploadResult) => {
            console.log(uploadResult.Location);
            resolve( {
                location: uploadResult.Location,
                isCover: isCoverImage,
            });
            })
            .catch((error) => console.log(error));
            })
  
}

function buildParam(imgItem, fileType) {
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: `${uuidv4()}.${fileType}`,
    Body: imgItem.buffer,
  };
  return params;
}

module.exports = router;
