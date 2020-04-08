import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import ZAdvancedWorkshop01Construct = require('../lib/z-advanced-workshop-01-construct-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new ZAdvancedWorkshop01Construct.ZAdvancedWorkshop01ConstructStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
