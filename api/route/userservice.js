require("dotenv").config();

const UserModel = require("../model/user");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const Bcrypt = require("bcryptjs");

router.get("/user", (req, res, next) =>{
});

router.post("/register", async (req, res, next) => {

  UserModel.find({email:req.body.email}).then((doc) => {
      if(doc.length < 1){
        newUserRegistration(req, res);
      } else{
        res.status(409).json({
          message: 'A user with email id already exists.'
        })
      }
  });
});

function newUserRegistration(req, res){
    const user = new UserModel({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      email: req.body.email,
      password: Bcrypt.hashSync(req.body.password, 10),
      city: req.body.city,
      mobile: req.body.mobile,
      countrycode: req.body.mobile

    });
  
    user
      .save()
      .then((result) => {
        console.log(result);
        res.status(201).json({
          message: result,
        });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({
          message: "Could not create user"+error,
        });
      });
  }

module.exports = router;
