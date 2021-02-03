Logical architecture diagrams

Mandatory requirements
AWS account with full privileges and a valid access key ID and secret access key
Assumed that the reader has some knowledge of AWS SAM, Node

Recommended requirements
If you do not have the below requirements, you'll need to install AWS SAM, AWS CLI, Python, Node in order to run/test/build/deploy the project.
VSCode
VSCode Remote Container Extension
Docker

Setting up dev environment using VS Code

1. Open folder in container
2. In VSCode Terminal, run aws configure. Recommend setting us-east-1 as default as this has not been tested with other regions

Building and deploying to AWS

1. sam build
2. sam deploy --guided --capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND (CAPABILITY_AUTO_EXPAND required because project contains nested stack)
3. Invalidate CloudFront if you deployed updated frontend code (not needed to first time you are deploying)
4. Create users for sales rep and costing admin from the Cognito Management Console (https://console.aws.amazon.com/cognito) . The user pool name is the CloudFormation stack name
5. Assign those users to the predefined relevant group (sales_rep and costs_admin)

Directory structure

Running tests

1. npm install
2. npm run test

Current limitations

1. CloudFront needs to be manually invalidated when deploying updated frontend code

Credits
VSCode remote container setup from https://github.com/avdi/aws-sam
