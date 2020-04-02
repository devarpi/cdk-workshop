# Welcome to your CDK TypeScript workshop 
The purpose of this repo is to outline basics for CDK, we will talk how you can be up and running with cdk on your dev (personal recommendation use mac) environment.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Getting Started](#getting-started)
- [How to install CDK?](#cdk-install)
- [Bootstrap CDK project](#cdk-bootstrap)
- [namespace & context](#cdk-namespace)
- [Typical cdk project structure](#cdk-structure)
- [Workshop Outline](#cdk-structure)
- [Reference](#cdk-reference)

<a name="getting-started"></a>
#### Getting Started

The AWS Cloud Development Kit (AWS CDK) is an open source software development framework to model and provision your cloud application resources using familiar programming languages.

It supports following languages :
- Typescript (We are going to use typescript)
- javascript
- C#
- Python
- Java 


<a name="cdk-install"></a>
#### How to install CDK?
```
npm install -g aws-cdk
cdk --version
```


<a name="cdk-bootstrap"></a>
#### Bootstrap CDK project
```
mkdir firstcdkapp
cd firstcdkapp
cdk init --language typescript
```


<a name="cdk-structure"></a>
#### Typical cdk project structure
```
.
├── README.md
├── bin
│   └── firstcdkapp.ts
├── cdk.json
├── jest.config.js
├── lib
│   └── firstcdkapp-stack.ts
├── package-lock.json
├── package.json
├── test
│   └── firstcdkapp.test.ts
└── tsconfig.json
```

<a name="cdk-outline"></a>
#### Workshop Outline
There are number of workshop in this repo.

- [workshop-01-dynamodb-namespace](https://bitbucket.collegeboard.org/projects/INASAURS/repos/cdk-workshop/browse/workshop-01-dynamodb-namespace)
- [workshop-02-sns-sqs](https://bitbucket.collegeboard.org/projects/INASAURS/repos/cdk-workshop/browse/workshop-02-sns-sqs)
- [workshop-03-lambda](https://bitbucket.collegeboard.org/projects/INASAURS/repos/cdk-workshop/browse/workshop-03-lambdap)
- [workshop-04-lambda-event](https://bitbucket.collegeboard.org/projects/INASAURS/repos/cdk-workshop/browse/workshop-04-lambda-event)
- [workshop-05-appsync](https://bitbucket.collegeboard.org/projects/INASAURS/repos/cdk-workshop/browse/workshop-05-appsync)
- [workshop-06-nested-stack](https://bitbucket.collegeboard.org/projects/INASAURS/repos/cdk-workshop/browse/workshop-06-nested-stack)
- [z-advanced-workspace-01-construct](https://bitbucket.collegeboard.org/projects/INASAURS/repos/cdk-workshop/browse/z-advanced-workshop-01-construct)
    - dynamodb
    - sns
    - lambda
    - sqs
    - apigateway
- [z-advance-workspace-02-custom-resource](https://bitbucket.collegeboard.org/projects/INASAURS/repos/cdk-workshop/browse/z-advanced-workshop-02-custom-resource)
    - cognito-userpool-federated-identity

<a name="cdk-reference"></a>
#### Reference
- getting started cdk - https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html

