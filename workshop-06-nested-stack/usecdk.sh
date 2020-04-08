#!/usr/bin/env bash

which cdk &> /dev/null
if [ $? -ne 0 ]; then
  echo "ERROR - CDK CLI is not installed"
  exit 1
fi

mkdir -p deployment/cdk-lambda
mkdir -p deployment/fifo-lambda
mkdir -p deployment/dynamodb-lambda

npm clean-install

echo "Choose Environment. [default value is: dev] "
echo "1. Dev"
echo "2. Test"
echo "3. Pre-production"
echo "4. Production"
echo "5. <DEVARLOPER>"
#awsprofile='cb-powerfaidscloud-nonprod-PFCDevRole-cli'
awsprofile='cb-finaidservices-nonprod-dev-cli'

read choice


case $choice in
  1)
    env='dev'
    cp stage_vars/cdk.dev.json cdk.json
    ;;
  2)
    env='test'
    cp stage_vars/cdk.test.json cdk.json
    ;;
  3)
    env='preprod'
    cp stage_vars/cdk.preprod.json cdk.json
    ;;
  4)
    env='prod'
    awsprofile='cb-powerfaidscloud-prod-dev-cli'
    cp stage_vars/cdk.prod.json cdk.json
    ;;
  5)
    env='<DEVELOPER>'
    cp stage_vars/cdk.<DEVELOPER>.json cdk.json
    ;;
  *)
    env='nonprod'
    cp stage_vars/cdk.nonprod.json cdk.json
    ;;
esac

echo "Choose your stack => Please wait for all stack names to be displayed.... " 
cdk ls
read stackname

echo "Choose your action [default-diff] "
echo "1. deploy"
echo "2. diff"
echo "3. destroy"
read choice

case $choice in
 1)
 action='deploy'
 ;;
 3)
 action='destroy'
 ;;
 *)
 action='diff'
 ;;
esac




echo "Selection Review:"
echo "Action: $action" 
echo "Stack Name: $stackname" 
echo "AWS Profile: $awsprofile"
echo "Selected Envrionment is : $env"
echo "Is this correct? If yes, type 'YES' (case sensitive). Anything else is no."

read confirm

if [ "$confirm" != "YES" ]
then
  echo "NO CONFIRMATION! Exiting Deployment..."
  exit -1
fi


if [ "$action" == "diff" ]
then
   echo "cdk diff --profile $awsprofile $stackname"
   cdk diff --profile $awsprofile $stackname  
fi

if [ "$action" == "deploy" ]
then
  rm -rf deployment/*
  
  echo "Bootstarcp your labmda before your deploy labmda using cdk. Command : cdk bootstrap --profile  $awsprofile"
  echo "npm run bundle-lambda"
  npm run bundle-lambda

  mkdir -p deployment/cdk-lambda
  mv deployment/cdkLambdaFunction.js deployment/cdk-lambda/

  mkdir -p deployment/fifo-lambda
  mv deployment/cdkFifoLambdaFunction.js deployment/fifo-lambda/

  mkdir -p deployment/dynamodb-lambda
  mv deployment/cdkDynamoDBLambdaFunction.js deployment/dynamodb-lambda/
  

  cdk bootstrap --profile  $awsprofile

  echo "cdk deploy --profile $awsprofile $stackname"
  cdk deploy --profile $awsprofile $stackname 
fi

if [ "$action" == "destroy" ]
then 
  echo "cdk destroy --profile $awsprofile $stackname"
  cdk destroy --profile $awsprofile $stackname
fi