#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ZAdvancedWorkshop01ConstructStack } from '../lib/z-advanced-workshop-01-construct-stack';
import { ZAdvancedWorkshop01SoutionConstructStack } from '../solution/z-advanced-workshop-01-construct-stack';
import { Tag } from '@aws-cdk/core';

const app = new cdk.App();


const ENV_NAME = app.node.tryGetContext("ENV_NAME");
const SERVICE_NAME = app.node.tryGetContext("SERVICE_NAME");

const tags = [
    { key: 'engineer', value: 'dsheth' },
    { key: 'cb_program', value: 'financial_aid_software' },
    { key: 'accessibility', value: 'privae' },
    { key: 'data_classification', value: 'proprietary' },
    {
        key: 'team_lead', value: 'bdakshinamurthy'
    },
    {
        key: 'env', value: 'dev'
    },
    {
        key: 'asset_id', value: 'PFCL-MS-DR-SERVICE'
    },
    {
        key: 'lifecycle', value: 'nonprod'
    },
    {
        key: 'provisioned_by', value: 'cdk'
    },
    {
        key: 'system_id', value: 'PFCL'
    }
];

const advancedWorkshop01ConstructStack = new ZAdvancedWorkshop01ConstructStack(app, `${ENV_NAME}-${SERVICE_NAME}-construct-withnested-stack`);

//Add All Tags
for (const tag of tags) {
    Tag.add(advancedWorkshop01ConstructStack, tag.key, tag.value);
}
//Tag the entier stack
