import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import Workshop02SnsSqs = require('../lib/workshop-02-sns-sqs-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new Workshop02SnsSqs.Workshop02SnsSqsStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
