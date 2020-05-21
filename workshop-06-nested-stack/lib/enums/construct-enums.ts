export enum enumCloudWatchEventType {
  CRON = 'cron',
  RATE = 'rate',
  EXPRESSION = 'expression',
}

export enum enumEventSource {
  S3 = 'S3',
  SQS = 'SQS',
  SNS = 'SNS',
  DYNAMODB_STREAM = 'DYNAMODB_STREAM',
  KINESIS = 'KINESIS',
}
