# Welcome to your CDK TypeScript workshop-03-lambda!

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Getting Started](#getting-started)
- [deploy lambda using cdk with webpack](#cdk-lambda) 
- [CDK Commands and it's Usage](#cdk-commands)  

<a name="getting-started"></a>
## Getting Started

This workshop is going to cover following two items.
    1. using cdk deploy lambda
        - use of webpack with cdk (this is not standard, we have hacked it to use with webpack)
 
<a name="cdk-labmda"></a>

#### first run npm install at the root of project

    ```

    cd workshop-03-lambda
    npm install

    ```


#### when using webpack first run following command before you run cdk deploy command

    ```

     npm run bundle-lambda
     ##now run cdk deploy command
     cdk deploy --require-approval=never --profile cb-powerfaidscloud-nonprod-dev-cli <STACK_NAME>  <example - dev-mssecurityheader-stack>

    ```

#### Reference
- lambda using cdk docs : https://docs.aws.amazon.com/cdk/api/latest/docs/aws-lambda-readme.html

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