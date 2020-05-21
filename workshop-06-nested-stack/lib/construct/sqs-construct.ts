import * as cdk from '@aws-cdk/core';
import { isEmpty, isNil } from 'ramda';
import * as sqs from '@aws-cdk/aws-sqs';
import { QueueEncryption, IQueue } from '@aws-cdk/aws-sqs';
import { CBSqsConstructProps, CBSqsQueueAndName } from '../interfaces/construct-interfaces';
import CBConstruct from './common-construct';

import kms = require('@aws-cdk/aws-kms');

export default class CBSqsConstruct extends CBConstruct {
  /** allows accessing the counter function */
  public readonly sqsQueue: sqs.Queue;

  public readonly sqsQueueAndName: CBSqsQueueAndName;

  public readonly dlQueue?: sqs.Queue;

  constructor(scope: cdk.Construct, id: string, props: CBSqsConstructProps) {
    super(scope, id);
    if (isEmpty(props) || isNil(props)) {
      return;
    }
    const { queueName = '', fifo, isDLQ, contentBasedDeduplication, environment = {} } = props;
    const ENVIRONMENT = this.getEnvironmentKeyValuePairs(environment);
    const envServiceName = `${ENVIRONMENT.SERVICE_NAME}-${ENVIRONMENT.ENV_NAME}`;

    const inputQueueName = queueName.split('.');
    let extractedQueueName = inputQueueName[0];

    if (fifo || contentBasedDeduplication) {
      extractedQueueName = isDLQ ? (extractedQueueName += '-dlq.fifo') : (extractedQueueName += '.fifo');
    } else {
      extractedQueueName = isDLQ ? (extractedQueueName += '-dlq') : extractedQueueName;
    }

    let sqsQueueName = `${envServiceName}-${extractedQueueName}`;
    const sqsExportName = `${envServiceName}-${inputQueueName[0]}`;
    if (isDLQ) {
      this.dlQueue = this.createQueue(props, sqsQueueName, `${sqsExportName}-dlq`);
      sqsQueueName = `${envServiceName}-${queueName}`;
      this.sqsQueue = this.createQueueWithDlQueue(props, this.dlQueue, sqsQueueName, `${sqsExportName}-sqs`);
    } else {
      this.sqsQueue = this.createQueue(props, sqsQueueName, `${sqsExportName}`);
    }
    this.sqsQueueAndName = {} as CBSqsQueueAndName;
    this.sqsQueueAndName.queueName = sqsQueueName;
    this.sqsQueueAndName.sqsQueue = this.sqsQueue;
  }

  createSQSQueue(props: CBSqsConstructProps): sqs.Queue {
    const { queueName = 'pfc-sqs-queue', keyArn } = props;
    const sqsProps = Object.assign(
      props,
      keyArn
        ? {
            encryption: QueueEncryption.KMS,
            encryptionMasterKey: kms.Key.fromKeyArn(this, `${queueName}-key`, keyArn),
          }
        : {
            encryption: QueueEncryption.KMS_MANAGED,
          }
    );
    const sqsQueue = new sqs.Queue(this, queueName, sqsProps);
    return sqsQueue;
  }

  exportQueueOutputProps(queueName: string, exportName: string, queueArn: string, queueUrl: string) {
    this.cfnOutputForPfc(
      `${exportName}-output-name`,
      queueName,
      `${exportName}-name`,
      `queue name export for ${queueName}`
    );
    this.cfnOutputForPfc(
      `${exportName}-output-arn`,
      queueArn,
      `${exportName}-arn`,
      `queue arn export for ${queueName}`
    );
    this.cfnOutputForPfc(
      `${exportName}-output-url`,
      queueUrl,
      `${exportName}-url`,
      `queue url export for ${queueName}`
    );
  }

  createQueue(props: CBSqsConstructProps, queueName: string, exportName: string) {
    const sqsProps = Object.assign(props, {
      queueName,
    });
    const sqsQueue = this.createSQSQueue(sqsProps);
    this.exportQueueOutputProps(queueName, exportName, sqsQueue.queueArn, sqsQueue.queueUrl);
    return sqsQueue;
  }

  createQueueWithDlQueue(props: CBSqsConstructProps, dlQuque: IQueue, queueName: string, exportName: string) {
    const sqsProps = Object.assign(props, {
      queueName,
      deadLetterQueue: { maxReceiveCount: 1, queue: dlQuque },
    });
    const sqsQueue = this.createSQSQueue(sqsProps);
    this.exportQueueOutputProps(queueName, exportName, sqsQueue.queueArn, sqsQueue.queueUrl);
    return sqsQueue;
  }
}
