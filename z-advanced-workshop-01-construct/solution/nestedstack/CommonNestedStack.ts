import * as cdk from '@aws-cdk/core';
import * as cfn from '@aws-cdk/aws-cloudformation';


export default class CommonNestedStack extends cfn.NestedStack {

    constructor(scope: cdk.Construct, id: string, props?: cfn.NestedStackProps) {
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