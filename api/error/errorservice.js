require("dotenv").config();

const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {

    res.status(500).json({
        message: "Not an valid api endpoing"
    });
    
});

module.exports = router;

