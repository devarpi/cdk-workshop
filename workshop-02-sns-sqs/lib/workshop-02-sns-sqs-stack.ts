import * as cdk from '@aws-cdk/core';
import * as sns from '@aws-cdk/aws-sns';
import * as snsSubscription from '@aws-cdk/aws-sns-subscriptions';
import * as sqs from '@aws-cdk/aws-sqs';
import * as kms from '@aws-cdk/aws-kms';

import * as _ from 'lodash';
import { SubscriptionFilter } from '@aws-cdk/aws-sns';


export class Workshop02SnsSqsStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const ENV_NAME = this.node.tryGetContext("ENV_NAME");
    const SERVICE_NAME = this.node.tryGetContext("SERVICE_NAME");

    if (_.isEmpty(ENV_NAME) || _.isEmpty(SERVICE_NAME)) {
      throw new Error('ENV_NAME or SERVICE_NAME context is missing...')
    }


    ////////////////////////////////////////////////////////////////////////////////
    // Exercise: 1 - bin/workshop-02-sns-sqs.ts  
    // - add namespace inside bin/workshop-02-sns-sqs.ts file and follow instruction given inside that file.
    //
    // ALL RESOURCES HERE SHOULD HAVE namespace - both for object name and id.
    // EXAMPLE - From workshop -01 when dynamoDB table was created
    //
    // const workshopTable = new dynamodb.Table(this, `${ENV_NAME}-${SERVICE_NAME}-workshop-domain-id`, {
    //   tableName: `${ENV_NAME}-${SERVICE_NAME}-workshop-solution-domain`....
    // ${ENV_NAME}-${SERVICE_NAME} is namespace inside id and tableName 
    //
    // Exercise: 2 lib/workshop-02-sns-sqs-stack.ts
    // - Step -1 create KMS key 
    //    - api docs for kms: https://docs.aws.amazon.com/cdk/api/latest/docs/aws-kms-readme.html
    // - Step -2 create sns topic key 
    //    - api docs for sns: https://docs.aws.amazon.com/cdk/api/latest/docs/aws-sns-readme.html 
    //    - set key from step -1 as masterKey in sns
    // - Step -3 create sqs queue simple
    //    - api docs for sqs: https://docs.aws.amazon.com/cdk/api/latest/docs/aws-sqs-readme.html
    //    - set key from step -1 as masterKey in sns
    // - Step -4 create sns subscriptions for the queue created in Step -3 
    //    - api docs for sns subscriptions : https://docs.aws.amazon.com/cdk/api/latest/docs/aws-sns-subscriptions-readme.html 
    //////////////////////////////////////////////////////////////////////////////// 


  }
}

