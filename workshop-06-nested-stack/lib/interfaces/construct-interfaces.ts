import { FunctionOptions } from '@aws-cdk/aws-lambda';
import { QueueProps } from '@aws-cdk/aws-sqs';
import * as sqs from '@aws-cdk/aws-sqs';
import { TopicProps, SubscriptionProtocol } from '@aws-cdk/aws-sns';
import * as lambda from '@aws-cdk/aws-lambda';
import { enumCloudWatchEventType, enumEventSource } from '../enums/construct-enums';

export interface CBCloudWatchEvent {
  enable: boolean;
  eventType?: enumCloudWatchEventType.CRON | enumCloudWatchEventType.RATE | enumCloudWatchEventType.EXPRESSION;
  eventObject?: object;
  eventExpressionString?: string;
}

export interface CBEventObjects {
  eventSources?: CBEventSource[];
  cloudWatchEvent?: CBCloudWatchEvent;
}

export interface CBEventSource {
  eventType?:
  | enumEventSource.S3
  | enumEventSource.SQS
  | enumEventSource.SNS
  | enumEventSource.DYNAMODB_STREAM
  | enumEventSource.KINESIS;
  eventObject?: object;
  queueName?: string;
}

export interface CBLambdaConstructProps extends FunctionOptions {
  functionName: string;
  functionFolderLocation: string;
  handlerDefinition: string;
  lambdaLayerName?: string;
  lambdaLayerArn?: string;
  securityGroupId?: string;
  eventObjects?: CBEventObjects;
  environment: {
    [key: string]: string;
  };
  iamPolicyStatements?: Record<string, any>[];
  isDLQ?: boolean;
  scheduleCron?: {
    [key: string]: string;
  };
}

export interface CBSqsConstructProps extends QueueProps {
  isDLQ?: boolean;
  maxReceiveCount?: number;
  keyArn?: string;
  environment: {
    [key: string]: string;
  };
}

export interface CBSqsQueueAndName {
  sqsQueue: sqs.Queue;
  queueName: string;
}

export interface CBSnsConstructProps extends TopicProps {
  topicName: string;
  keyArn?: string;
  iamPolicyStatements?: Record<string, any>[];
  protocol?: SubscriptionProtocol;
  sqsQueue?: sqs.Queue;
  urlSub?: string;
  lambdaFunction?: lambda.Function;
  environment: {
    [key: string]: string;
  };
}
