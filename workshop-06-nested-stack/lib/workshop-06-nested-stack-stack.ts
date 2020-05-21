import * as cdk from '@aws-cdk/core';
import CommonStack from './commonStack';
import * as _ from 'lodash';
import { AsyncBusStack } from './nestedStack/AsyncBusNestedStack';
import { FifoQueueLambdaStack } from './nestedStack/FifoQueuLambda';
import { DynamoDBNestedStack } from './nestedStack/DynamoDBNestedStack';

export class Workshop06NestedStackStack extends CommonStack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const ENV_NAME = this.node.tryGetContext("ENV_NAME");
    const SERVICE_NAME = this.node.tryGetContext("SERVICE_NAME");

    if (_.isEmpty(ENV_NAME) || _.isEmpty(SERVICE_NAME)) {
      throw new Error('ENV_NAME or SERVICE_NAME context is missing...')
    }
    // The code that defines your stack goes here

    //first get async bus nested stack

    const asyncBusStack = new AsyncBusStack(this, `${SERVICE_NAME}-${ENV_NAME}-asyncbus-nested-stack`)

    const fiffoQueueLambdaStack = new FifoQueueLambdaStack(this, `${SERVICE_NAME}-${ENV_NAME}-fifo-queue-lambda-nested-stack`)
    const dynamoDBNestedStack = new DynamoDBNestedStack(this, `${SERVICE_NAME}-${ENV_NAME}-dynamodb-lambda-nested-stack`)

    //dynamoDBNestedStack.addDependency(asyncBusStack);

  }
}
