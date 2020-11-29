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

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "Getting list item data",
  });
});

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
});

router.post("/", upload, (req, res, next) => {
  const item = new Item({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
  });

  item
    .save()
    .then((result) => {
      let itemId = result.id;
      multipleUploads(req.files, itemId);
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
});

function addMediaEntry(imageEntries, itemId){
    const media = new Media({
        _id: new mongoose.Types.ObjectId(),
         item_id: itemId,
        images: imageEntries,
      });
      media
        .save()
        .then((mediaResult) => {
          console.log(mediaResult);
        })
        .catch((error) => {
          console.log(error);
        });
}

function multipleUploads(files, itemId) { 
    
  var promises = [];
  files.forEach(function (imgItem, index, array) {
      if(index == 0){
        promises.push(uploadToS3(imgItem, true));
      }else{
        promises.push(uploadToS3(imgItem, false));
      }
  });
  Promise.all(promises).then((imageEntries) => {
      addMediaEntry(imageEntries, itemId);
  })
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
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${uuidv4()}.${fileType}`,
    Body: imgItem.buffer,
  };
  return params;
}

module.exports = router;
