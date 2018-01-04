using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

using Amazon.Lambda.Core;
using Amazon.Lambda.APIGatewayEvents;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializerAttribute(typeof(Amazon.Lambda.Serialization.Json.JsonSerializer))]

namespace test_dotnetcore
{
  public class Function
  {
    /// <summary>
    /// Default constructor that Lambda will invoke.
    /// </summary>
    public Function()
    {
    }


    /// <summary>
    /// A Lambda function to respond to HTTP Get methods from API Gateway
    /// </summary>
    /// <param name="request"></param>
    /// <returns>The list of blogs</returns>
    public APIGatewayProxyResponse Get(APIGatewayProxyRequest request, ILambdaContext context)
    {
      context.Logger.Log(request.Path);
      context.Logger.LogLine("Get Request\n");

      var response = new APIGatewayProxyResponse
      {
        StatusCode = (int)HttpStatusCode.Unauthorized,
        Body = "Hello AWS Serverless",
        Headers = new Dictionary<string, string> { { "Content-Type", "text/plain" }, { "www", "bearer" } }
      };

      return response;
    }
  }
}
