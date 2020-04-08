#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { Workshop06NestedStackStack } from '../lib/workshop-06-nested-stack-stack';
import { Tag } from '@aws-cdk/core';

const app = new cdk.App();

const ENV_NAME = app.node.tryGetContext("ENV_NAME");
const SERVICE_NAME = app.node.tryGetContext("SERVICE_NAME");

const workshop06NestedStackStack = new Workshop06NestedStackStack(app, `${ENV_NAME}-${SERVICE_NAME}-nested-stack`);


// const tags = [
//     { key: 'engineer', value: 'dsheth' },
//     { key: 'cb_program', value: 'financial_aid_software' },
//     { key: 'accessibility', value: 'privae' },
//     { key: 'data_classification', value: 'proprietary' },
//     {
//         key: 'team_lead', value: 'bdakshinamurthy'
//     },
//     {
//         key: 'env', value: 'dev'
//     },
//     {
//         key: 'asset_id', value: 'PFCL-MS-DR-SERVICE'
//     },
//     {
//         key: 'lifecycle', value: 'nonprod'
//     },
//     {
//         key: 'provisioned_by', value: 'cdk'
//     },
//     {
//         key: 'system_id', value: 'PFCL'
//     }
// ];

// //Add All Tags
// for (const tag of tags) {
//     Tag.add(workshop06NestedStackStack, tag.key, tag.value);
// }
//Tag the entier stack