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
        console.log(itemId);

      // upload image to s3
      let imgFiles = req.files;
      imgFiles.forEach(function (imgItem, index, array) {
        
        
        console.log("**************** for each called ******************");
        imgItems = imgItem.originalname.split(".");
        const fileType = imgItems[imgItems.length - 1];

        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: `${uuidv4()}.${fileType}`,
          Body: imgItem.buffer,
        };

        var s3uploadResult =  s3.upload(params).promise();
        s3uploadResult.then((uploadResult) => {

          console.log(uploadResult.Location);

          //call to create media entry;
          const media = new Media({
            _id: new mongoose.Types.ObjectId(),
            item_id: itemId,
            location: uploadResult.Location,
            isCover: true,
          });
          media
            .save()
            .then((mediaResult) => {
              console.log(mediaResult);
            })
            .catch((error) => {
              console.log(error);
            });
        }).catch(error => console.log(error));
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

function uploadImageAndMediaEntry(item, index, files, itemId) {}

module.exports = router;
