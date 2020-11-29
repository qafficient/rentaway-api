
const AWS = require('aws-sdk');

const s3data = new AWS.S3({
    accessKeyId: process.env.ID,
    secretAccessKey: process.env.SECRET
});

exports.model = s3data;
