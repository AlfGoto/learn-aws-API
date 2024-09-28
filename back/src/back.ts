import { AppStage } from "@joinsezame/constructs"
// import { AppStage, Monitoring, Api, DynamoTable } from "@joinsezame/constructs"
import * as cdk from "aws-cdk-lib"
import { IResource, LambdaIntegration, MockIntegration, PassthroughBehavior, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { App, Stack, RemovalPolicy } from 'aws-cdk-lib';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path'

export interface BrowsingBffProps extends cdk.StackProps {
  stage: AppStage
  serviceName: string
}

export class Back extends Stack {
  constructor(app: App, id: string, props: BrowsingBffProps) {
    super(app, id, props);

    const dynamoTable = new Table(this, 'todolist', {
      partitionKey: {
        name: 'date',
        type: AttributeType.NUMBER
      },
      sortKey: {
        name: 'state',
        type: AttributeType.STRING
      },
      tableName: 'todolist',
      removalPolicy: RemovalPolicy.DESTROY,
    });


    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: { externalModules: ['aws-sdk',], },
      depsLockFilePath: join(__dirname, 'lambdas', 'package-lock.json'),
      environment: {
        PRIMARY_KEY: 'date',
        TABLE_NAME: dynamoTable.tableName,
      },
      runtime: Runtime.NODEJS_20_X,
    }


    const getAllLambda = new NodejsFunction(this, 'getAllItemsFunction', { entry: join(__dirname, 'lambdas', 'get-all.ts'), ...nodeJsFunctionProps, });
    const createOneLambda = new NodejsFunction(this, 'createOneFunction', { entry: join(__dirname, 'lambdas', 'create-one.ts'), ...nodeJsFunctionProps, });

    dynamoTable.grantReadWriteData(getAllLambda);
    dynamoTable.grantReadWriteData(createOneLambda);

    const getAllIntegration = new LambdaIntegration(getAllLambda);
    const createOneIntegration = new LambdaIntegration(createOneLambda);

    const api = new RestApi(this, 'itemsApi', { restApiName: 'Items Service' });
    const items = api.root.addResource('todo');
    items.addMethod('GET', getAllIntegration);
    items.addMethod('POST', createOneIntegration);
    addCorsOptions(items);

    // const singleItem = items.addResource('{id}');
    // addCorsOptions(singleItem);
  }
}

export function addCorsOptions(apiResource: IResource) {
  apiResource.addMethod('OPTIONS', new MockIntegration({
    integrationResponses: [{
      statusCode: '200',
      responseParameters: {
        'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
        'method.response.header.Access-Control-Allow-Origin': "'*'",
        'method.response.header.Access-Control-Allow-Credentials': "'false'",
        'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE'",
      },
    }],
    // In case you want to use binary media types, comment out the following line
    passthroughBehavior: PassthroughBehavior.NEVER,
    requestTemplates: {
      "application/json": "{\"statusCode\": 200}"
    },
  }), {
    methodResponses: [{
      statusCode: '200',
      responseParameters: {
        'method.response.header.Access-Control-Allow-Headers': true,
        'method.response.header.Access-Control-Allow-Methods': true,
        'method.response.header.Access-Control-Allow-Credentials': true,
        'method.response.header.Access-Control-Allow-Origin': true,
      },
    }]
  })
}

const app = new App();
// new Back(app, 'Back');
app.synth();