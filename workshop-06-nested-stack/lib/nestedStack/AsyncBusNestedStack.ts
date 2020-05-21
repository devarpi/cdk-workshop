import * as cfn from '@aws-cdk/aws-cloudformation';
import { NestedStackProps } from '@aws-cdk/aws-cloudformation';
import { Construct, Duration } from '@aws-cdk/core';
import * as sqs from '@aws-cdk/aws-sqs';
import * as lambda from '@aws-cdk/aws-lambda';
import * as kms from '@aws-cdk/aws-kms';
import * as cdk from '@aws-cdk/core';

import * as sns from '@aws-cdk/aws-sns';
import * as snsSubscription from '@aws-cdk/aws-sns-subscriptions'

import { SqsEventSource } from '@aws-cdk/aws-lambda-event-sources';
import CommonNestedStack from './commonNestedStack';
import * as CBSqsConstruct from '../construct/sqs-construct';
import * as CBSnsConstruct from '../construct/sns-construct';
import * as CBLambdaConstruct from '../construct/lambda-construct';

export interface CommonStackObject {
    sqsQueue: sqs.Queue;
    handlers: Array<lambda.Function>;
}


export class AsyncBusStack extends CommonNestedStack {

    public readonly commonStackOutpu: CommonStackObject;
    public readonly handlers: Array<lambda.Function> = [];

    constructor(scope: Construct, id: string, props?: NestedStackProps) {
        super(scope, id);
        const ENV_NAME = this.node.tryGetContext("ENV_NAME");
        const SERVICE_NAME = this.node.tryGetContext("SERVICE_NAME");

        //Need SNS topic

        //kms key
        const key = new kms.Key(this, `${ENV_NAME}-${SERVICE_NAME}-key`, {
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            alias: `${ENV_NAME}-${SERVICE_NAME}-key`
        });

        this.cfnOutput(`${ENV_NAME}-${SERVICE_NAME}-key-output-arn`, key.keyArn,
            `${ENV_NAME}-${SERVICE_NAME}-key-arn`, `KMS key arn export ${ENV_NAME}-${SERVICE_NAME}-key`);

        // Exercise: 1 - use sns Construct instead of sns.Topic
        //use CBSnsConstruct here
        const topic = new sns.Topic(this, `${ENV_NAME}-${SERVICE_NAME}-sns`, {
            displayName: `demo topic`,
            topicName: `${ENV_NAME}-${SERVICE_NAME}-topic`,
            masterKey: key
        });
        this.cfnOutput(`${ENV_NAME}-${SERVICE_NAME}-workshop-topic-output-arn`, topic.topicArn,
            `${ENV_NAME}-${SERVICE_NAME}-workshop-topic-arn`, `sns topic arn export ${ENV_NAME}-${SERVICE_NAME}-topic`);

        this.cfnOutput(`${ENV_NAME}-${SERVICE_NAME}-workshop-topic-output-name`, topic.topicName,
            `${ENV_NAME}-${SERVICE_NAME}-workshop-topic-name`, `sns topic name export ${ENV_NAME}-${SERVICE_NAME}-topic`);

        //need a SQS Queue
        // Exercise: 2 - use sqs Construct instead of sqs.Queue 
        //use CBSqsConstruct here
        const queue = new sqs.Queue(this, `${ENV_NAME}-${SERVICE_NAME}-sqs`,
            {
                queueName: `${ENV_NAME}-${SERVICE_NAME}-workshop`,
                encryption: sqs.QueueEncryption.KMS
            });

        this.cfnOutput(`${ENV_NAME}-${SERVICE_NAME}-workshop-queue-output-name`, queue.queueName,
            `${ENV_NAME}-${SERVICE_NAME}-workshop-name`, `queue name export for ${ENV_NAME}-${SERVICE_NAME}-workshop`);

        this.cfnOutput(`${ENV_NAME}-${SERVICE_NAME}-workshop-queue-output-arn`, queue.queueArn,
            `${ENV_NAME}-${SERVICE_NAME}-workshop-arn`, `queue arn export for ${ENV_NAME}-${SERVICE_NAME}-workshop`);

        const topicSubs = new snsSubscription.SqsSubscription(queue, {
            rawMessageDelivery: true
        });
        topic.addSubscription(topicSubs)

        //Need one lambda
        let LAMBD_ENV_VARS = {} as any;
        LAMBD_ENV_VARS['envName'] = ENV_NAME;
        LAMBD_ENV_VARS['serviceName'] = SERVICE_NAME;
        let EVENT_EXPRESSION = `cron(* 0/1 * * ? *)`;

        // Exercise: 3 - use sqs Construct instead of lambda.Function
        //use CBLambdaConstruct here
        //step - 1 : create lambda function  
        const cdkLambdaFunction = new lambda.Function(this, `${ENV_NAME}-${SERVICE_NAME}-cdk-lambda-id`, {
            runtime: lambda.Runtime.NODEJS_12_X,
            functionName: `${ENV_NAME}-${SERVICE_NAME}-cdk-lambda`,
            description: `cdk workshop lambda for ${ENV_NAME} envrionment and the service name is ${SERVICE_NAME}`,
            handler: `cdkLambdaFunctionOne.handler`,
            code: lambda.Code.asset(`deployment/cdkLambdaFunctionOne`),
            memorySize: 128,
            environment: LAMBD_ENV_VARS,
            timeout: Duration.seconds(30)
        });



    }
}