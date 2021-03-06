# Lambda and Api Gateway deployment

'api-gateway-lambda' is a library that eases the process of deployment of AWS Lambda and API Gateway. 

It takes the necessary parameters from a config.json file and swagger.json(For API-Gateway).

## Getting Started.

### Prerequisites.
- Node.js (> v6.9.2)
- AWS credentials should be stored in the environment variables.

### Installation.

```bash
npm install api-gateway-lambda --save
```
### Using it in your code.

- If you have your config.json and swagger.json in a config folder at the root of your project:

```typescript
const deploymentLibrary = require('api-gateway-lambda')();

deploymentLibrary.deployLambda();
deploymentLibrary.deployAPIGateWay();
```
- You can specify the relative path of the config folder:

```typescript
const deploymentLibrary = require('api-gateway-lambda')('/dist/config'); 
//if config folder is in a folder dist sitting at the root of your project.

deploymentLibrary.deployLambda();
deploymentLibrary.deployAPIGateWay();
```

- These functions return promises in case you want to synchronize their execution.

```typescript

deploymentLibrary.deployLambda()
  .then(result => console.log(result),
        error => console.log(error));

```


### Important Files and Definition

The library takes the configuration for deployment from the config.json file.

#### config.json


 ```typescript
{
  "LambdaName": "test-node",
  "APIGatewayName": "test-node",
  "s3BucketName": "test-node.15-6-17",
  "Role": "<IAM Role of ApiGateway Allowing access to Lambda>",
  "MemorySize": 128,
  "Runtime": "nodejs6.10",
  "Timeout": 10,
  "Handler": "index.handler",
  "SubnetIds": [
    "subnet-********"
  ],
  "SecurityGroupIds": [
    "sg-********"
  ],
  "filePath": "./src/FunctionName", 
  "env": {
    "PROD": {
      "envName": "PROD",
      "s3Path": "lambdaDeploymentPackage/PROD/test-node.zip",
      "stageName": "PROD",
      "aliasName": "PROD",
      "StageVariables": {
      }
    }
  }
}
 ```

 - Configuration parameters for Lambda:

```typescript
{
  "LambdaName": "test-node",
  "s3BucketName": "test-node.15-6-17",
  "Role": "<IAM Role of ApiGateway Allowing access to Lambda>",
  "MemorySize": 128,
  "Runtime": "nodejs6.10",
  "Timeout": 10,
  "Handler": "index.handler",
  "SubnetIds": [
    "subnet-********"
  ],
  "SecurityGroupIds": [
    "sg-********"
  ],
  "filePath": "./src/FunctionName", 
  "env": {
    "PROD": {
      "envName": "PROD",
      "s3Path": "lambdaDeploymentPackage/PROD/test-node.zip",
      "aliasName": "PROD"
    }
  }
}
```

- Configurations for API Gateway:

```typescript
{
  "APIGatewayName": "test-node",
  "env": {
    "PROD": {
      "envName": "PROD",
      "stageName": "PROD",
      "aliasName": "PROD",
      "StageVariables": {
      }
    }
  }
}
```
- For Deployment of API Gateway a swagger documentation is required.

#### swagger.json - x-amazon-apigateway-integration

```typescript
{
"x-amazon-apigateway-integration": {
          "credentials": "<IAM Role of ApiGateway Allowing access to Lambda>",
          "httpMethod": "post",
          "type": "aws",
          "uri": "arn:aws:apigateway:<aws-region>:lambda:path/2015-03-31/functions/arn:aws:lambda:<aws-region>:<aws-account-number>:function:<function-name>:<alias-name>/invocations",
          "requestTemplates": {
            "application/json": "{\n \"end\": \"$input.params('end')\"\n}"
          },
          "responses": {
            "default": {
              "statusCode": 200
            },
            ".*BadRequest.*": {
              "statusCode": 400
            },
            ".*InternalServerError.*": {
              "statusCode": 500
            }
          }
        }
}
```