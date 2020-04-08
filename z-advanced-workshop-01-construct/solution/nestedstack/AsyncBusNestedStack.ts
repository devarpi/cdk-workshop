
import { NestedStackProps } from '@aws-cdk/aws-cloudformation';
import { Construct, Duration } from '@aws-cdk/core';
import * as sqs from '@aws-cdk/aws-sqs';
import * as lambda from '@aws-cdk/aws-lambda';
import * as kms from '@aws-cdk/aws-kms';
import * as cdk from '@aws-cdk/core';
import { isEmpty, isNil } from 'ramda';

import * as sns from '@aws-cdk/aws-sns';

import CommonNestedStack from './CommonNestedStack';
import CBSnsConstruct from '../../lib/construct/sns-construct';
import { CBSnsConstructProps } from '../../lib/interfaces/construct-interfaces';

export interface CommonStackObject {
    sqsQueue: sqs.Queue;
    handlers: Array<lambda.Function>;
}


export class AsyncBusNestedStack extends CommonNestedStack {

    public readonly snsTopic: sns.Topic;


    constructor(scope: Construct, id: string, props?: NestedStackProps) {
        super(scope, id);
        const ENV_NAME = this.node.tryGetContext("ENV_NAME");
        const SERVICE_NAME = this.node.tryGetContext("SERVICE_NAME");

        if (isEmpty(ENV_NAME) || isEmpty(SERVICE_NAME)) {
            throw new Error('ENV_NAME or SERVICE_NAME context is missing...')
        }
        const key = new kms.Key(this, `${ENV_NAME}-${SERVICE_NAME}-key`, {
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            alias: `${ENV_NAME}-${SERVICE_NAME}-key`
        });

        let snsDefination = {
            topicName: `advance-workshop-topic`,
            keyArn: key.keyArn,
            displayName: `advance-workshop-topic`
        } as CBSnsConstructProps;

        const snsConstrcut = new CBSnsConstruct(this, `${ENV_NAME}-${SERVICE_NAME}-sns-id`, { ...snsDefination });

    }
}