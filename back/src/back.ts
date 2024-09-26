import * as cdk from "aws-cdk-lib"
import { Construct } from "constructs"

import * as apigw from "aws-cdk-lib/aws-apigatewayv2"
import * as integrations from "aws-cdk-lib/aws-apigatewayv2-integrations"

import * as ddb from "aws-cdk-lib/aws-dynamodb"

import * as lambda from "aws-cdk-lib/aws-lambda"
import * as destinations from "aws-cdk-lib/aws-lambda-destinations"
import * as levs from "aws-cdk-lib/aws-lambda-event-sources"
import * as ln from "aws-cdk-lib/aws-lambda-nodejs"

export interface BackProps extends cdk.StackProps {
  stage: string
  serviceName: string
}

export class Back extends cdk.Stack {
  constructor(scope: Construct, id: string, props: BackProps) {
    super(scope, id, props)



    const table = new ddb.TableV2(this, "Table", {
      partitionKey: { name: "time", type: ddb.AttributeType.NUMBER },
      sortKey: { name: "state", type: ddb.AttributeType.STRING },
    })



    const api = new apigw.HttpApi(this, "Api", {
      corsPreflight: {
        allowHeaders: ["Content-Type", "Authorization", "Content-Length", "X-Requested-With"],
        allowMethods: [apigw.CorsHttpMethod.ANY],
        allowCredentials: false,
        allowOrigins: ["*"],
      },
    })

    const apiFunction = new ln.NodejsFunction(this, "ApiFunction", {
      entry: `lambda/getAllTodos`,
      environment: {
        STAGE: props.stage,
        SERVICE: props.serviceName,
        TABLE_NAME: table.tableName,
        NODE_OPTIONS: "--enable-source-maps",
      }
    })
    table.grantReadWriteData(apiFunction)

    const apiIntegration = new integrations.HttpLambdaIntegration("ApiIntegration", apiFunction)
    api.addRoutes({
      path: "/",
      methods: [
        apigw.HttpMethod.GET,
        apigw.HttpMethod.PUT,
        apigw.HttpMethod.POST,
        apigw.HttpMethod.PATCH,
        apigw.HttpMethod.DELETE,
      ],
      integration: apiIntegration,
    })


  }
}
