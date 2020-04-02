# Welcome to your CDK TypeScript workshop-02-sns-sqs-practice!

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Getting Started](#getting-started)
- [CDK Commands and it's Usage](#cdk-commands) 
- [namespace & context](#cdk-namespace)
- [sns,sqs using cdk](#cdk-snssqs) 

<a name="getting-started"></a>
## Getting Started

This workshop is going to cover following two items.
    1. CDK basics
        - CDK Commands
        - cdk configuration file. cdk.json
        - context in cdk
        - typical cdk project structure
    2. How you namespace your stack while using cdk?
    3. One simple aws service- dynamodb

<a name="cdk-commands"></a>
## CDK Commands and it's Usage
```

* Deployment using cdk
    cdk deploy --require-approval=never --profile cb-powerfaidscloud-nonprod-dev-cli <STACK_NAME>  <example - dev-mssecurityheader-stack>
* Diff using ckd
    cdk diff --profile cb-powerfaidscloud-nonprod-dev-cli <STACK_NAME>  <example -dev-mssecurityheader-stack>
* Destroy stack using cdk
    cdk destroy --profile cb-powerfaidscloud-nonprod-dev-cli <STACK_NAME>  <example -dev-mssecurityheader-stack>
* Not CDK, SAM conversion using cdk
    cdk synth --no-staging > ./sam/template.yaml
  
```
 
<a name="cdk-snssqs"></a>
#### Reference 
    - sns using cdk - docs : https://docs.aws.amazon.com/cdk/api/latest/docs/aws-sns-readme.html
    - sqs using cdk - docs : https://docs.aws.amazon.com/cdk/api/latest/docs/aws-sqs-readme.html
    - sns subscription using cdk - docs : https://docs.aws.amazon.com/cdk/api/latest/docs/aws-sns-subscriptions-readme.html
 