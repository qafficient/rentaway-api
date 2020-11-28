
const AWS = require('aws-sdk');

const s3data = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET
});

exports.model = s3data;
