import * as cdk from '@aws-cdk/core';


export default class CommonStack extends cdk.Stack {

    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id);
    }

    cfnOutput(id: string, value: string, exportName: string, description: string) {
        new cdk.CfnOutput(this, id, {
            value,
            exportName,
            description
        });
    }
}