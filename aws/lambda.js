const AWS = require('aws-sdk'),
    Promise = require('promise');

const lambda = new AWS.Lambda({ lambda: '2015-03-31' });

module.exports = {
    getFunction: (FunctionName) => {
        return new Promise((resolve, reject) => {
            const params = {
                FunctionName: FunctionName
            };
            lambda.getFunction(params, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });
    },
    createLambda: (functionParams) => {
        return new Promise((resolve, reject) => {
            const params = {
                Code: {
                    S3Bucket: functionParams.bucketName,
                    S3Key: functionParams.S3Key,
                    S3ObjectVersion: functionParams.S3ObjectVersion
                },
                FunctionName: functionParams.LambdaName,
                Handler: functionParams.Handler,
                Publish: true,
                Role: functionParams.Role,
                MemorySize: functionParams.MemorySize,
                Runtime: functionParams.Runtime,
                Timeout: functionParams.Timeout,
                VpcConfig: {
                    SubnetIds: functionParams.SubnetIds,
                    SecurityGroupIds: functionParams.SecurityGroupIds
                }
            };
            lambda.createFunction(params, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });
    },
    createAlias: (aliasParams) => {
        return new Promise((resolve, reject) => {
            const params = {
                FunctionName: aliasParams.LambdaName,
                FunctionVersion: aliasParams.version,
                Name: aliasParams.aliasName
            };
            lambda.createAlias(params, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });
    },
    updateLambda: (functionParams) => {
        return new Promise((resolve, reject) => {
            const params = {
                S3Bucket: functionParams.S3Bucket,
                S3Key: functionParams.S3Key,
                S3ObjectVersion: functionParams.S3ObjectVersion,
                FunctionName: functionParams.LambdaName,
                Publish: true
            };
            lambda.updateFunctionCode(params, (err, data) => {
                if (err) reject(err);
                else {
                    resolve(data);
                }
            });
        });
    },
    updateAlias: (aliasParams) => {
        return new Promise((resolve, reject) => {
            const params = {
                FunctionName: aliasParams.LambdaName,
                FunctionVersion: aliasParams.version,
                Name: aliasParams.aliasName
            };
            lambda.updateAlias(params, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });
    }
}