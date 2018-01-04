const AWSDeploy = require('api-gateway-lambda');

process.env.NODE_ENV = process.argv[2];


AWSDeploy.deployLambda().then(
  result => console.log(result),
  error => console.log(error)
);

AWSDeploy.deployAPIGateWay().then(
  result => console.log(result),
  error => console.log(error)
);