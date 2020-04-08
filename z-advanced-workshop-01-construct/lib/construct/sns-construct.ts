import { isEmpty, isNil } from 'ramda';
import { PolicyStatement, Effect } from '@aws-cdk/aws-iam';
import { SubscriptionProtocol } from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';

import * as kms from '@aws-cdk/aws-kms';
import * as sns from '@aws-cdk/aws-sns';
import * as subs from '@aws-cdk/aws-sns-subscriptions';
import CBConstruct from './common-construct';
import { CBSnsConstructProps } from '../interfaces/construct-interfaces';

export default class CBSnsConstruct extends CBConstruct {
  /** allows accessing the counter function */
  public readonly snsTopic: sns.Topic;

  constructor(scope: cdk.Construct, id: string, props: CBSnsConstructProps) {
    super(scope, id);
    if (isEmpty(props) || isNil(props)) {
      return;
    }

    const { displayName, topicName, iamPolicyStatements = [], environment = {} } = props;
    const ENVIRONMENT = this.getEnvironmentKeyValuePairs(environment);
    const envServiceName = `${ENVIRONMENT.SERVICE_NAME}-${ENVIRONMENT.ENV_NAME}`;
    const topicFullName = `${envServiceName}-${topicName}`;
    this.snsTopic = new sns.Topic(this, topicFullName, {
      topicName: topicFullName,
      displayName,
      masterKey: this.getKMSMasterKey(props),
    });
    this.addSubscription(props);

    const defaultPolicies = [
      new PolicyStatement({
        effect: Effect.DENY,
        resources: ['*'],
        actions: ['sns:DeleteTopic'],
      }),
      new PolicyStatement({
        effect: Effect.DENY,
        resources: ['*'],
        actions: ['sns:Subscribe'],
        conditions: {
          'sns:Protocol': SubscriptionProtocol.SQS,
        },
      }),
    ];
    defaultPolicies.map(defaultPolicyStatement => iamPolicyStatements.push(defaultPolicyStatement));

    this.addToResourcePolicy(props);
  }

  getKMSMasterKey(props: CBSnsConstructProps) {
    const { topicName, keyArn } = props;
    if (isEmpty(keyArn) || isNil(keyArn)) {
      return undefined;
    }

    return kms.Key.fromKeyArn(this, `${topicName}-key`, keyArn);
  }

  addSubscription(props: CBSnsConstructProps): void {
    const { lambdaFunction, protocol, sqsQueue } = props;
    if (protocol === SubscriptionProtocol.LAMBDA) {
      if (!lambdaFunction) {
        throw new Error('lambda function not found');
      }
      this.snsTopic.addSubscription(new subs.LambdaSubscription(lambdaFunction));
    } else if (protocol === SubscriptionProtocol.SQS) {
      if (!sqsQueue) {
        throw new Error('sqs queue not found');
      }
      this.snsTopic.addSubscription(new subs.SqsSubscription(sqsQueue));
    }
    // TODO: you can add subscription for [https, http, email, email.json, sms]
  }

  addToResourcePolicy(props: CBSnsConstructProps): void {
    const { iamPolicyStatements } = props;
    if (isEmpty(iamPolicyStatements) || isNil(iamPolicyStatements)) {
      return;
    }
    iamPolicyStatements.map(statement => this.snsTopic.addToResourcePolicy(statement as PolicyStatement));
  }
}
