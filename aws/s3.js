const AWS = require('aws-sdk'),
    Promise = require('promise');

const s3 = new AWS.S3({ apiVersion: '2015-07-09' });

module.exports = {
    createBucket: (bucketName) => {
        return new Promise((resolve, reject) => {
            const params = {
                Bucket: bucketName,
                CreateBucketConfiguration: {
                    LocationConstraint: 'eu-west-1'
                }
            };
            s3.createBucket(params, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });
    },
    uploadToS3: (uploadParams) => {
        return new Promise((resolve, reject) => {
            const params = {
                Bucket: uploadParams.bucketName,
                Key: uploadParams.filePath,
                Body: uploadParams.fstream
            };
            s3.upload(params, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });
    }
}