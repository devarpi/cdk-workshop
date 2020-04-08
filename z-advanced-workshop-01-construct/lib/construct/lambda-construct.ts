import { Duration } from '@aws-cdk/core';
import * as cdk from '@aws-cdk/core';
import {
  SqsEventSource,
  S3EventSource,
  SnsEventSource,
  DynamoEventSource,
  KinesisEventSource,
} from '@aws-cdk/aws-lambda-event-sources';

import * as lambda from '@aws-cdk/aws-lambda';
import * as ec2 from '@aws-cdk/aws-ec2';
import { PolicyStatement } from '@aws-cdk/aws-iam';
import { isEmpty, isNil } from 'ramda';
import * as events from '@aws-cdk/aws-events';
import * as targets from '@aws-cdk/aws-events-targets';
import { CronOptions } from '@aws-cdk/aws-events';
import { enumCloudWatchEventType, enumEventSource } from '../enums/construct-enums';
import { CBLambdaConstructProps, CBEventObjects } from '../interfaces/construct-interfaces';
import CBConstruct from './common-construct';

export default class CBLambdaConstruct extends CBConstruct {
  public readonly lambdaFunction: lambda.Function;

  constructor(scope: cdk.Construct, id: string, props: CBLambdaConstructProps) {
    super(scope, id);
    if (isEmpty(props) || isNil(props)) {
      return;
    }

    const {
      description,
      environment = {},
      eventObjects,
      functionFolderLocation,
      functionName,
      handlerDefinition,
      iamPolicyStatements,
      isDLQ,
      lambdaLayerArn = '',
      lambdaLayerName = '',
      memorySize,
      securityGroupId = '',
      timeout = Duration.seconds(30),
      tracing,
      vpc,
      scheduleCron,
    } = props;

    const ENVIRONMENT = this.getEnvironmentKeyValuePairs(environment);
    const envServiceName = `${ENVIRONMENT.SERVICE_NAME}-${ENVIRONMENT.ENV_NAME}`;
    const lambdaFunctionName = `${envServiceName}-${functionName}`;
    const groupId = `${envServiceName}-finaid-security-group`;

    this.lambdaFunction = new lambda.Function(this, lambdaFunctionName, {
      runtime: lambda.Runtime.NODEJS_12_X,
      functionName: lambdaFunctionName,
      handler: handlerDefinition,
      code: lambda.Code.asset(functionFolderLocation),
      memorySize: memorySize || 512,
      timeout,
      deadLetterQueueEnabled: isDLQ,
      tracing,
      environment: ENVIRONMENT,
      layers: this.getLambdaLayerVersionArn(lambdaLayerName, lambdaLayerArn),
      vpc,
      securityGroup: this.getSecurityGroup(securityGroupId, groupId),
      vpcSubnets: this.getVPCSubnet(vpc),
      description,
    });
    this.addToRolePolicy(iamPolicyStatements);
    this.addEventSources(eventObjects);
    this.addEventTargets(eventObjects, scheduleCron as CronOptions);

    this.cfnOutputForPfc(
      `${functionName}-output-name`,
      this.lambdaFunction.functionArn,
      `${functionName}-lambda-arn`,
      `lambda arn export for ${functionName}`
    );
  }

  getLambdaLayerVersionArn(lambdaLayerName: string, lambdaLayerArn: string) {
    if (!lambdaLayerName || lambdaLayerArn) {
      return [];
    }
    return [lambda.LayerVersion.fromLayerVersionArn(this, lambdaLayerName, lambdaLayerArn)];
  }

  getSecurityGroup(securityGroupId: string, groupId: string) {
    if (!securityGroupId) {
      return undefined;
    }
    return ec2.SecurityGroup.fromSecurityGroupId(this, groupId, securityGroupId);
  }

  getVPCSubnet(vpc?: ec2.IVpc) {
    return vpc ? { subnetType: ec2.SubnetType.PRIVATE } : { subnetType: ec2.SubnetType.ISOLATED };
  }

  addToRolePolicy(iamPolicyStatements?: Record<string, any>[]) {
    if (isNil(iamPolicyStatements) || isEmpty(iamPolicyStatements)) {
      return;
    }
    iamPolicyStatements.forEach(iamPolicyStatement => {
      this.lambdaFunction.addToRolePolicy(iamPolicyStatement as PolicyStatement);
    });
  }

  addEventSources(eventObjects?: CBEventObjects) {
    if (
      isNil(eventObjects) ||
      isNil(eventObjects.eventSources) ||
      isEmpty(eventObjects) ||
      isEmpty(eventObjects.eventSources)
    ) {
      return;
    }
    eventObjects.eventSources.forEach(eventSource => {
      if (eventSource.eventType === enumEventSource.SQS) {
        this.lambdaFunction.addEventSource(eventSource.eventObject as SqsEventSource);
      } else if (eventSource.eventType === enumEventSource.S3) {
        this.lambdaFunction.addEventSource(eventSource.eventObject as S3EventSource);
      } else if (eventSource.eventType === enumEventSource.SNS) {
        this.lambdaFunction.addEventSource(eventSource.eventObject as SnsEventSource);
      } else if (eventSource.eventType === enumEventSource.DYNAMODB_STREAM) {
        this.lambdaFunction.addEventSource(eventSource.eventObject as DynamoEventSource);
      } else if (eventSource.eventType === enumEventSource.KINESIS) {
        this.lambdaFunction.addEventSource(eventSource.eventObject as KinesisEventSource);
      }
    });
  }

  addEventTargets(eventObjects?: CBEventObjects, options?: CronOptions) {
    if (
      isNil(eventObjects) ||
      isNil(eventObjects.cloudWatchEvent) ||
      isNil(eventObjects.cloudWatchEvent.enable) ||
      isEmpty(eventObjects) ||
      isEmpty(eventObjects.cloudWatchEvent) ||
      isEmpty(eventObjects.cloudWatchEvent.enable)
    ) {
      return;
    }

    let scheduleRule;
    if (eventObjects.cloudWatchEvent.eventType === enumCloudWatchEventType.CRON) {
      scheduleRule = {
        schedule: events.Schedule.cron(
          options || {
            minute: '0/5',
            hour: '*',
            day: '*',
            month: '*',
            year: '?',
          }
        ),
      };
    } else if (eventObjects.cloudWatchEvent.eventType === enumCloudWatchEventType.RATE) {
      scheduleRule = {
        schedule: events.Schedule.rate(Duration.seconds(30)),
      };
    } else if (eventObjects.cloudWatchEvent.eventType === enumCloudWatchEventType.EXPRESSION) {
      if (isEmpty(eventObjects.cloudWatchEvent.eventExpressionString)) {
        throw new Error('for eventType expression eventExpressionString is required field');
      }

      const expression = eventObjects.cloudWatchEvent.eventExpressionString as string;
      scheduleRule = {
        schedule: events.Schedule.expression(expression),
      };
    }
    const eventRule = new events.Rule(this, 'Schedule', scheduleRule);
    eventRule.addTarget(new targets.LambdaFunction(this.lambdaFunction));
  }
}
