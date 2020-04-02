import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as events from '@aws-cdk/aws-events';
import { Schedule } from '@aws-cdk/aws-events';
import { Duration } from '@aws-cdk/core';
import * as targets from '@aws-cdk/aws-events-targets';
import * as sqs from '@aws-cdk/aws-sqs';
import { SqsEventSource } from '@aws-cdk/aws-lambda-event-sources';

import * as _ from 'lodash';
import CommonStack from '../lib/commonStack';

export class Workshop04LambdaEventSolutionStack extends CommonStack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props); const ENV_NAME = this.node.tryGetContext("ENV_NAME");
    const SERVICE_NAME = this.node.tryGetContext("SERVICE_NAME");

    if (_.isEmpty(ENV_NAME) || _.isEmpty(SERVICE_NAME)) {
      throw new Error('ENV_NAME or SERVICE_NAME context is missing...')
    }

    let LAMBD_ENV_VARS = {} as any;
    LAMBD_ENV_VARS['envName'] = ENV_NAME;
    LAMBD_ENV_VARS['serviceName'] = SERVICE_NAME;
    let EVENT_EXPRESSION = `cron(* 0/1 * * ? *)`;

    //step - 1 : create lambda function  
    const cdkLambdaFunction = new lambda.Function(this, `${ENV_NAME}-${SERVICE_NAME}-cdk-lambda-id`, {
      runtime: lambda.Runtime.NODEJS_12_X,
      functionName: `${ENV_NAME}-${SERVICE_NAME}-cdk-lambda`,
      description: `cdk workshop lambda for ${ENV_NAME} envrionment and the service name is ${SERVICE_NAME}`,
      handler: `cdkLambdaFunction.handler`,
      code: lambda.Code.asset(`deployment`),
      memorySize: 128,
      environment: LAMBD_ENV_VARS,
      timeout: Duration.seconds(30)
    });

    //create schedule event and attach lambda as target
    let eventRule = new events.Rule(this, 'Schedule', {
      schedule: Schedule.expression(EVENT_EXPRESSION)
    });

    eventRule.addTarget(new targets.LambdaFunction(cdkLambdaFunction));

    const queue = new sqs.Queue(this, `${ENV_NAME}-${SERVICE_NAME}-sqs`,
      {
        queueName: `${ENV_NAME}-${SERVICE_NAME}-workshop`,
        encryption: sqs.QueueEncryption.KMS
      });
    cdkLambdaFunction.addEventSource(new SqsEventSource(queue, {
      batchSize: 10 // default
    }));

  }
}


 //above code is copy from workshop-03 

    // 10 mins - self study - 5 mins demo
    ////////////////////////////////////////////////////////////////////////////////
    // ALL RESOURCES HERE SHOULD HAVE namespace - both for object name and id.
    // EXAMPLE - From workshop -01 when dynamoDB table was created
    //
    // const workshopTable = new dynamodb.Table(this, `${ENV_NAME}-${SERVICE_NAME}-workshop-domain-id`, {
    //   tableName: `${ENV_NAME}-${SERVICE_NAME}-workshop-solution-domain`....
    // ${ENV_NAME}-${SERVICE_NAME} is namespace inside id and tableName 
    //
    //
    // Exercise: 1 - create SQS the way we created in workshop-02
    //  - create sqs queue simple
    //    - api docs for sqs: https://docs.aws.amazon.com/cdk/api/latest/docs/aws-sqs-readme.html
    // Exercise: 2 attach created lambda as trigger on sqs queue 
    //    - api docs for lambda: https://docs.aws.amazon.com/cdk/api/latest/docs/aws-lambda-readme.html
    //    - api docs for lambda-event-source: https://docs.aws.amazon.com/cdk/api/latest/docs/aws-lambda-event-sources-readme.html
    //////////////////////////////////////////////////////////////////////////////// 