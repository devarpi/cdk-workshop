import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as events from '@aws-cdk/aws-events';
import { Schedule } from '@aws-cdk/aws-events';
import { Duration } from '@aws-cdk/core';
import * as targets from '@aws-cdk/aws-events-targets';

import * as _ from 'lodash';
import CommonStack from '../lib/commonStack';

export class Workshop03LambdaSolutionStack extends CommonStack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const ENV_NAME = this.node.tryGetContext("ENV_NAME");
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

  }
}
