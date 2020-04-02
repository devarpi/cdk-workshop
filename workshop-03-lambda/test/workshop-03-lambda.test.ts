import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import Workshop03Lambda = require('../lib/workshop-03-lambda-stack');

test('Empty Stack', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new Workshop03Lambda.Workshop03LambdaStack(app, 'MyTestStack');
  // THEN
  expectCDK(stack).to(matchTemplate({
    "Resources": {}
  }, MatchStyle.EXACT))
});
