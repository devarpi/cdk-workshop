import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';

import * as _ from 'lodash';
import { Duration } from '@aws-cdk/core';

import CBLambdaConstruct from './construct/lambda-construct';
import { CBLambdaConstructProps } from './interfaces/construct-interfaces';

export class ZAdvancedWorkshop01ConstructStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const ENV_NAME = this.node.tryGetContext("ENV_NAME");
    const SERVICE_NAME = this.node.tryGetContext("SERVICE_NAME");

    if (_.isEmpty(ENV_NAME) || _.isEmpty(SERVICE_NAME)) {
      throw new Error('ENV_NAME or SERVICE_NAME context is missing...')
    }
    // The code that defines your stack goes here
    let handlerName = `cdkLambdaFunctionOne`;
    let LAMBD_ENV_VARS = {} as any;
    LAMBD_ENV_VARS['envName'] = ENV_NAME;
    LAMBD_ENV_VARS['serviceName'] = SERVICE_NAME;


    const cdkLambdaFunction = new lambda.Function(this, `${ENV_NAME}-${SERVICE_NAME}-cdk-lambda-id`, {
      runtime: lambda.Runtime.NODEJS_12_X,
      functionName: `${ENV_NAME}-${SERVICE_NAME}-cdk-lambda`,
      description: `cdk workshop lambda for ${ENV_NAME} envrionment and the service name is ${SERVICE_NAME}`,
      handler: `${handlerName}.handler`,
      code: lambda.Code.asset(`deployment/${handlerName}`),
      memorySize: 128,
      environment: LAMBD_ENV_VARS,
      timeout: Duration.seconds(30)
    });

    const cbLambdaConstructProps = {
      functionName: `${ENV_NAME}-${SERVICE_NAME}-cdk-lambda-construct`,
      functionFolderLocation: `deployment/${handlerName}`,
      handlerDefinition: `${handlerName}.handler`
    } as CBLambdaConstructProps;

    const firstLambdaWithConstruct = new CBLambdaConstruct(this, `${ENV_NAME}-${SERVICE_NAME}-cdk-lambda-withconstuct-id`, { ...cbLambdaConstructProps })
  }
}
