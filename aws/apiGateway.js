const AWS = require('aws-sdk'),
    Promise = require('promise');

const apigateway = new AWS.APIGateway({ apiVersion: '2015-07-09' });

module.exports = {
    createRestAPI: (swagger) => {
        return new Promise((resolve, reject) => {
            const params = {
                body: JSON.stringify(swagger)
            };
            apigateway.importRestApi(params, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });
    },
    updateRestAPI: (restApiId, swagger) => {
        return new Promise((resolve, reject) => {
            const params = {
                restApiId: restApiId,
                body: JSON.stringify(swagger),
                mode: 'overwrite'
            };
            apigateway.putRestApi(params, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });
    },
    getRestAPI: (restApiName) => {
        return new Promise((resolve, reject) => {
            apigateway.getRestApis({}, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    const restApi = data.items.find(api => api.name == restApiName);
                    if (restApi) {
                        resolve(restApi);
                    } else {
                        reject({
                            message: 'Not Found',
                            statusCode: 404
                        });
                    }
                }
            });
        });
    },
    createDeployment: (deployParams) => {
        return new Promise((resolve, reject) => {
            const params = {
                restApiId: deployParams.restApiId,
                stageName: deployParams.stageName,
                variables: deployParams.variables
            };
            apigateway.createDeployment(params, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });
    }
}