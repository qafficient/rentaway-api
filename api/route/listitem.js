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

router.get("/", (req, res, next) => {

  Item.find({}).exec().then( (doc) => {
    res.status(200).json(doc);
  })
  .catch(error => {console.log(error)})
});

router.get("/:_id", (req, res, next) => {
  Item.findById(req.params._id).exec().then( (doc) => {
    res.status(200).json(doc);
  })
  .catch(error => {console.log(error)})
});

const s3 = new AWS.S3({
  accessKeyId: process.env.ID,
  secretAccessKey: process.env.SECRET,
});

router.post("/", upload, (req, res, next) => {
  console.log(req.body);

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
    rentprice: JSON.parse(req.body.rentprice),
    description: req.body.description,
    category: req.body.category,
    userId: req.body.userId,
    city: req.body.city,
    images: imageEntries,
    status: 'active'
  });

  item
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
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

function buildRentPricce(rentPriceText){
  console.log(rentPriceText);
   var rentJsonArray = JSON.parse(rentPriceText);
   console.log(rentJsonArray);
   return rentJsonArray;
}

module.exports = router;
