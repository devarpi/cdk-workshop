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

export interface CommonStackObject {
    sqsQueue: sqs.Queue;
    handlers: Array<lambda.Function>;
}


export class FifoQueueLambdaStack extends CommonNestedStack {

    public readonly commonStackOutpu: CommonStackObject;
    public readonly handlers: Array<lambda.Function> = [];

    constructor(scope: Construct, id: string, props?: NestedStackProps) {
        super(scope, id);
        const ENV_NAME = this.node.tryGetContext("ENV_NAME");
        const SERVICE_NAME = this.node.tryGetContext("SERVICE_NAME");

        //Need Fifo queue

        const queue = new sqs.Queue(this, `${ENV_NAME}-${SERVICE_NAME}-fifo-sqs`,
            {
                queueName: `${ENV_NAME}-${SERVICE_NAME}-workshop.fifo`,
                fifo: true,
                encryption: sqs.QueueEncryption.KMS
            });

        this.cfnOutput(`${ENV_NAME}-${SERVICE_NAME}-workshop-06-queue-output-name`, queue.queueName,
            `${ENV_NAME}-${SERVICE_NAME}-workshop-06-name`, `queue name export for ${ENV_NAME}-${SERVICE_NAME}-workshop`);

        this.cfnOutput(`${ENV_NAME}-${SERVICE_NAME}-workshop-queue-06-output-arn`, queue.queueArn,
            `${ENV_NAME}-${SERVICE_NAME}-workshop-06-arn`, `queue arn export for ${ENV_NAME}-${SERVICE_NAME}-workshop`);



        //Need one lambda
        let LAMBD_ENV_VARS = {} as any;
        LAMBD_ENV_VARS['envName'] = ENV_NAME;
        LAMBD_ENV_VARS['serviceName'] = SERVICE_NAME;

        //step - 1 : create lambda function  
        const cdkLambdaFunction = new lambda.Function(this, `${ENV_NAME}-${SERVICE_NAME}-cdk-fifo-lambda-id`, {
            runtime: lambda.Runtime.NODEJS_12_X,
            functionName: `${ENV_NAME}-${SERVICE_NAME}-cdk-fifo-lambda`,
            description: `cdk workshop lambda for ${ENV_NAME} envrionment and the service name is ${SERVICE_NAME}`,
            handler: `cdkLambdaFunctionThree.handler`,
            code: lambda.Code.asset(`deployment/cdkLambdaFunctionThree`),
            memorySize: 128,
            environment: LAMBD_ENV_VARS,
            timeout: Duration.seconds(30)
        });

        cdkLambdaFunction.addEventSource(new SqsEventSource(queue, {
            batchSize: 10 // default
        }));

    }
}