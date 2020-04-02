import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import Workshop04LambdaEvent = require('../lib/workshop-04-lambda-event-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new Workshop04LambdaEvent.Workshop04LambdaEventStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
