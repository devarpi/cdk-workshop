#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { Workshop04LambdaEventStack } from '../lib/workshop-04-lambda-event-stack';
import { Tag } from '@aws-cdk/core';

const app = new cdk.App();
const ENV_NAME = app.node.tryGetContext("ENV_NAME");
const SERVICE_NAME = app.node.tryGetContext("SERVICE_NAME");


const workshop04LambdaEventStack = new Workshop04LambdaEventStack(app, `${ENV_NAME}-${SERVICE_NAME}-cdk-lambda-event-stack`);

const tags = [
    { key: 'engineer', value: 'dsheth' },
    { key: 'cb_program', value: 'financial_aid_software' },
    { key: 'accessibility', value: 'privae' },
    { key: 'data_classification', value: 'proprietary' },
    {
        key: 'team_lead', value: 'bdakshinamurthy'
    },
    {
        key: 'env', value: `${ENV_NAME}`
    }
];

//Add All Tags
for (const tag of tags) {
    Tag.add(workshop04LambdaEventStack, tag.key, tag.value);
}
//Tag the entier stack