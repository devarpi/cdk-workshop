import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import Workshop06NestedStack = require('../lib/workshop-06-nested-stack-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new Workshop06NestedStack.Workshop06NestedStackStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
