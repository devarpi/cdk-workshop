import { Construct, CfnOutput } from '@aws-cdk/core';

/**
 * Common construct class where we are going to have number of utility methods added,
 * So all constructs can extend and use these methods
 */
export default class CBConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
  }

  // This will export cfn for perticular resource.
  cfnOutputForPfc(id: string, value: string, exportName: string, description: string) {
    // tslint:disable-next-line:no-unused-expression
    new CfnOutput(this, id, {
      value,
      exportName,
      description,
    });
  }

  getEnvironmentKeyValuePairs(environment: object) {
    const ENVIRONMENT = {} as {
      [key: string]: string;
    };

    Object.entries(environment).forEach(([key, value]) => {
      ENVIRONMENT[key] = value.toString();
    });

    return ENVIRONMENT;
  }
}
