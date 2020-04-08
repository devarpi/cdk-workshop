import * as cdk from '@aws-cdk/core';
import * as kms from '@aws-cdk/aws-kms';
import { isEmpty, isNil } from 'ramda';

import CBSnsConstruct from '../lib/construct/sns-construct';
import { CBSnsConstructProps } from '../lib/interfaces/construct-interfaces';
import { AsyncBusNestedStack } from './nestedstack/AsyncBusNestedStack';


export class ZAdvancedWorkshop01SoutionConstructStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const ENV_NAME = this.node.tryGetContext("ENV_NAME");
    const SERVICE_NAME = this.node.tryGetContext("SERVICE_NAME");

    if (isEmpty(ENV_NAME) || isNil(ENV_NAME) || isEmpty(SERVICE_NAME) || isNil(SERVICE_NAME)) {
      throw new Error('ENV_NAME or SERVICE_NAME context is missing...')
    }
    //Create first nested stack with sns and key
    const asynBusNestedStack = new AsyncBusNestedStack(this, `${ENV_NAME}-${SERVICE_NAME}-sns-topic-stack`);

  }
}
