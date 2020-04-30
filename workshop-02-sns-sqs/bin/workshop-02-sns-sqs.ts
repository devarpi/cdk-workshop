#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { Workshop02SnsSqsStack } from '../lib/workshop-02-sns-sqs-stack';


////////////////////////////////////////////////////////////////////////////////
// Exercise:
//
// - add namespace inside workshop-02-sns-sqs.ts file
// - adjust stack name and prefix with ENV_NAME & SERVICE_NAME
// - add tags to the stack 
// use following array for tags
// // const tags = [
//     { key: 'engineer', value: 'dsheth' },
//     { key: 'cb_program', value: 'teched' },
//     { key: 'accessibility', value: 'privae' },
//     { key: 'data_classification', value: 'proprietary' },
//     {
//         key: 'team_lead', value: 'phaynes'
//     },
//     {
//         key: 'env', value: `${ENV_NAME}`
//     }
// ];

////////////////////////////////////////////////////////////////////////////////

const app = new cdk.App();
new Workshop02SnsSqsStack(app, 'Workshop02SnsSqsStack');
