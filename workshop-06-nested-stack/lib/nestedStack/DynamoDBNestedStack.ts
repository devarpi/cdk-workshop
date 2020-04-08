import * as cfn from '@aws-cdk/aws-cloudformation';
import { NestedStackProps } from '@aws-cdk/aws-cloudformation';
import { Construct, RemovalPolicy, Duration } from '@aws-cdk/core';
import * as sqs from '@aws-cdk/aws-sqs';
import * as lambda from '@aws-cdk/aws-lambda';
import * as dynamodb from '@aws-cdk/aws-dynamodb';

import { SqsEventSource, DynamoEventSource } from '@aws-cdk/aws-lambda-event-sources';


export interface CommonStackObject {
    sqsQueue: sqs.Queue;
    handlers: Array<lambda.Function>;
}


export class DynamoDBNestedStack extends cfn.NestedStack {

    public readonly commonStackOutpu: CommonStackObject;
    public readonly handlers: Array<lambda.Function> = [];

    constructor(scope: Construct, id: string, props?: NestedStackProps) {
        super(scope, id);
        const ENV_NAME = this.node.tryGetContext("ENV_NAME");
        const SERVICE_NAME = this.node.tryGetContext("SERVICE_NAME");

        const dynamoDbTable = new dynamodb.Table(this, `${ENV_NAME}-${SERVICE_NAME}-workshop-domain-id`, {
            tableName: `${ENV_NAME}-${SERVICE_NAME}-workshop-solution-domain`,
            partitionKey: { name: `tenantBid`, type: dynamodb.AttributeType.STRING },
            sortKey: { name: `studentid`, type: dynamodb.AttributeType.STRING },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            serverSideEncryption: true, //enforcing encryption by default
            removalPolicy: RemovalPolicy.DESTROY,
            stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES
        });

        //lambda and attach as trigger targer on dynamodb table
        //Need one lambda
        let LAMBD_ENV_VARS = {} as any;
        LAMBD_ENV_VARS['envName'] = ENV_NAME;
        LAMBD_ENV_VARS['serviceName'] = SERVICE_NAME;

        //step - 1 : create lambda function  
        const cdkLambdaFunction = new lambda.Function(this, `${ENV_NAME}-${SERVICE_NAME}-cdk-dynamodb-lambda-id`, {
            runtime: lambda.Runtime.NODEJS_12_X,
            functionName: `${ENV_NAME}-${SERVICE_NAME}-cdk-dynamodb-lambda`,
            description: `cdk workshop lambda attached as trigger on dynamodb table : ${ENV_NAME}-${SERVICE_NAME}-workshop-solution-domain : for ${ENV_NAME} envrionment and the service name is ${SERVICE_NAME}`,
            handler: `cdkLambdaFunction.handler`,
            code: lambda.Code.asset(`deployment/dynamodb-lambda`),
            memorySize: 128,
            environment: LAMBD_ENV_VARS,
            timeout: Duration.seconds(30)
        });

        cdkLambdaFunction.addEventSource(new DynamoEventSource(dynamoDbTable, {
            startingPosition: lambda.StartingPosition.TRIM_HORIZON
        }));

    }
}