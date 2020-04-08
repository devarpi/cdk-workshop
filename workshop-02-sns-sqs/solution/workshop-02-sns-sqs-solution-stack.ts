import * as cdk from '@aws-cdk/core';
import * as sns from '@aws-cdk/aws-sns';
import * as snsSubscription from '@aws-cdk/aws-sns-subscriptions';
import * as sqs from '@aws-cdk/aws-sqs';
import * as kms from '@aws-cdk/aws-kms';

import * as _ from 'lodash';
import { SubscriptionFilter } from '@aws-cdk/aws-sns';
import CommonStack from './commonStack';


export class Workshop02SnsSqsSolutionStack extends CommonStack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //namespace your deployment with envName and serviceName
    const ENV_NAME = this.node.tryGetContext("ENV_NAME");
    const SERVICE_NAME = this.node.tryGetContext("SERVICE_NAME");

    if (_.isEmpty(ENV_NAME) || _.isEmpty(SERVICE_NAME)) {
      throw new Error('ENV_NAME or SERVICE_NAME context is missing...')
    }

    //kms key generation
    const key = new kms.Key(this, `${ENV_NAME}-${SERVICE_NAME}-key`, {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      alias: `${ENV_NAME}-${SERVICE_NAME}-key`
    });

    //cloudformation export
    this.cfnOutput(`${ENV_NAME}-${SERVICE_NAME}-key-output-arn`, key.keyArn,
      `${ENV_NAME}-${SERVICE_NAME}-key-arn`, `KMS key arn export ${ENV_NAME}-${SERVICE_NAME}-key`);

    //sns creation
    const topic = new sns.Topic(this, `${ENV_NAME}-${SERVICE_NAME}-sns`, {
      displayName: `demo topic`,
      topicName: `${ENV_NAME}-${SERVICE_NAME}-topic`,
      masterKey: key
    });

    //cloudformation export
    this.cfnOutput(`${ENV_NAME}-${SERVICE_NAME}-workshop-topic-output-arn`, topic.topicArn,
      `${ENV_NAME}-${SERVICE_NAME}-workshop-topic-arn`, `sns topic arn export ${ENV_NAME}-${SERVICE_NAME}-topic`);

    this.cfnOutput(`${ENV_NAME}-${SERVICE_NAME}-workshop-topic-output-name`, topic.topicName,
      `${ENV_NAME}-${SERVICE_NAME}-workshop-topic-name`, `sns topic name export ${ENV_NAME}-${SERVICE_NAME}-topic`);

    //sqs queue creation
    const queue = new sqs.Queue(this, `${ENV_NAME}-${SERVICE_NAME}-sqs`,
      {
        queueName: `${ENV_NAME}-${SERVICE_NAME}-workshop`,
        encryption: sqs.QueueEncryption.KMS
      });

    //cloudformation export
    this.cfnOutput(`${ENV_NAME}-${SERVICE_NAME}-workshop-queue-output-name`, queue.queueName,
      `${ENV_NAME}-${SERVICE_NAME}-workshop-name`, `queue name export for ${ENV_NAME}-${SERVICE_NAME}-workshop`);

    this.cfnOutput(`${ENV_NAME}-${SERVICE_NAME}-workshop-queue-output-arn`, queue.queueArn,
      `${ENV_NAME}-${SERVICE_NAME}-workshop-arn`, `queue arn export for ${ENV_NAME}-${SERVICE_NAME}-workshop`);

    const topicSubs = new snsSubscription.SqsSubscription(queue, {
      rawMessageDelivery: true
    });

    topic.addSubscription(topicSubs)
    // The code that defines your stack goes here
  }
}
