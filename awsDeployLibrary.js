const AWS = require('aws-sdk'),
  fs = require('fs'),
  s3 = require('./aws/s3'),
  apigateway = require('./aws/apiGateway'),
  lambda = require('./aws/lambda');



module.exports = (configFolderPath = '/config', dirname = '../..') => {

  const config = require(dirname + configFolderPath + '/config.json');

  const deploymentLibrary = {

    deployLambda: () => {
      return getFile(config.filePath).then(
        zipFile => {
          return deploymentLibrary.uploadToS3(config.s3BucketName, config.env[process.env.NODE_ENV].s3Path, zipFile).then(
            s3result => {
              return lambda.getFunction(config.LambdaName).then(
                lambdaResult => updateLambda(s3result),
                lambdaError => {
                  if (lambdaError.statusCode == 404) {
                    return lambdaCreate(s3result);
                  }
                });
            });
        });
    },

    deployAPIGateWay: () => {
      const swaggerJson = require(dirname + configFolderPath + '/swagger.json');
      swaggerJson.info.title = config.APIGatewayName;
      return apigateway.getRestAPI(config.APIGatewayName).then(
        restApi => {
          return apigateway.updateRestAPI(restApi.id, swaggerJson).then(
            updateResult => deployApi(updateResult.id));
        },
        restApiError => {
          if (restApiError.statusCode == 404) {
            return apigateway.createRestAPI(swaggerJson).then(
              createResult => deployApi(createResult.id));
          }
        });
    },

    uploadToS3: (bucketName, key, fstream) => {
      return s3.createBucket(bucketName).then(
        result => {
          return s3.uploadToS3({
            filePath: key,
            bucketName: bucketName,
            fstream: fstream
          });
        },
        error => {
          if (error.statusCode == 409) {
            return s3.uploadToS3({
              filePath: key,
              bucketName: bucketName,
              fstream: fstream
            });
          }
        });
    }

  };

  function getFile(filePath) {
    return new Promise((resolve, reject) => {
      fs.readFile(`./${filePath}.zip`, (error, data) => {
        if (error) reject(error);
        else resolve(data);
      });
    });
  }


  function lambdaCreate(data) {
    return lambda.createLambda({
      bucketName: data.Bucket,
      S3Key: data.Key,
      S3ObjectVersion: data.VersionId,
      LambdaName: config.LambdaName,
      Handler: config.Handler,
      Role: config.Role,
      MemorySize: config.MemorySize,
      Runtime: config.Runtime,
      Timeout: config.Timeout,
      SubnetIds: config.SubnetIds,
      SecurityGroupIds: config.SecurityGroupIds
    }).then(result => createAlias(result));
  }

  function createAlias(data, callback) {
    return lambda.createAlias({
      LambdaName: data.FunctionName,
      version: data.Version,
      aliasName: config.env[process.env.NODE_ENV].aliasName
    });
  }

  function updateLambda(data, callback) {
    return lambda.updateLambda({
      S3Bucket: data.Bucket,
      S3Key: data.Key,
      S3ObjectVersion: data.VersionId,
      LambdaName: config.LambdaName
    }).then(result => updateAlias(result));
  }

  function updateAlias(data, callback) {
    return lambda.updateAlias({
      LambdaName: config.LambdaName,
      version: data.Version,
      aliasName: config.env[process.env.NODE_ENV].aliasName
    }).catch(
      error => {
        if (error.statusCode == 404) {
          return createAlias(data);
        } else {
          return new Promise((resolve, reject) => reject(error));
        }
      });
  }

  function deployApi(restApiId, callback) {
    const variables = config.env[process.env.NODE_ENV].stageVariables;
    variables.restApiId = restApiId;
    const params = {
      restApiId: restApiId,
      stageName: config.env[process.env.NODE_ENV].stageName,
      variables: variables
    };
    return apigateway.createDeployment(params);
  }

  return deploymentLibrary;
}