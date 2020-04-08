# Welcome to your CDK TypeScript workshop-06-nested-stack!

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Getting Started](#getting-started)
- [CDK nested stack](#cdk-nested-stack) 
- [CDK Commands and it's Usage](#cdk-commands)  
- [What we just built?](#what-we-built)  

<a name="getting-started"></a>
## Getting Started

This workshop is going to cover following two items.
    1. using cdk deploy lambda
        - use of webpack with cdk (this is not standard, we have hacked it to use with webpack)
 
<a name="cdk-nested-stack"></a>

For simplicity and building towards CI CD, please look at usecdk.sh file. 
- It is interactive shell script, which can translate in to your CI CD build space commands.
- It has support for webpack (remember cdk doesn't support webpack out of box, this is one hack to get going, it's effective)
- It has all the work we did from workshop -01 to 04 backed in to nested stack. 
- At the end it has visiualization of what we just built.

 
#### Reference
  - cdk nested stack - docs : https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-cloudformation.NestedStack.html 

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

<a name="what-we-built"></a>

#### What we just built?

**Let's see** [Go to this link](./imgs/workshop6.png)