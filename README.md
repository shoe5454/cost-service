<!-- PROJECT LOGO -->
<br />
<p align="center">
  <h3 align="center">Cost Service</h3>
</p>



<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
        <li><a href="#architecture">Architecture</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#setup">Setup</a></li>
        <li><a href="#deploy-to-aws">Deploy To AWS</a></li>
      </ul>
    </li>
    <li>
      <a href="#usage">Usage</a>
      <ul>
        <li><a href="#uploading-csv-file">Uploading CSV File</a></li>
        <li><a href="#calculating-cost">Calculating Cost</a></li>      
        <li><a href="#logs">Logs</a></li>
      </ul>
    </li>
    <li>
      <a href="#development">Development</a>
      <ul>
        <li><a href="#project-folder-structure">Project Folder Structure</a></li>
        <li><a href="#running-locally">Running Locally</a></li>
      </ul>
    </li>
    <li><a href="#future-todos">Future TODOs</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Screen Shot][product-screenshot]](https://github.com/shoe5454/cost-service)

This is my response to the coding challenge posed by a certain company.

### Built With

* [AWS](https://aws.amazon.com)
* [Node](https://nodejs.org)
* [Docker](https://www.docker.com)
* [Visual Studio Code](https://code.visualstudio.com)

It is assumed the reader has knowledge of the above and is able to find his/her way around them.

### Architecture

![Screen Shot][architecture-screenshot]

## Getting Started

To build and deploy the project to AWS follow these steps.

### Prerequisites

* AWS account
  * Full access privileges with a valid access key ID and secret access key.
  * Recommend using a new organization sub-account to make sure any resources created by this project can be guaranteed to be removed by deleting the account (i.e. stack deletion has not been tested).
* Docker
  * Required by AWS SAM for local application testing.
  * Required by Visual Studio Code for running a remote development container.
* Visual Studio Code
  * This guide assumes you will be using Visual Studio Code. If using a different IDE, you'll need to install AWS SAM, AWS CLI, Python, and Node in order to work with the project.
* Visual Studio Code Remote - Containers extension
  * This is the extension with id `ms-vscode-remote.remote-containers` .
* Project source code
  * `git clone https://github.com/shoe5454/cost-service` or download the project sources from `https://github.com/shoe5454/cost-service`
  * In the rest of this guide, the local `cost-service` folder will be referred to as `<PROJECT_DIR>`

### Setup

1. In Visual Studio Code, hit F1 then search for the `Remote-Containers: Open Folder in Container...` command.
2. Browse for and select your `<PROJECT_DIR>` folder.
   * The Docker container for your development environment will be created. This may take a few minutes.
3. **For the rest of this guide, all commands are to be run from the Terminal panel in Visual Studio Code**, i.e. run inside the development Docker container.
4. Run `aws configure` and follow the prompts.
   * Recommend using `us-east-1` as the default region because the project has not been tested with other regions.
5. Run `npm install` . This is only required if you intend to run unit tests locally or inspect dependency sources.

### Deploy To AWS

The project uses the AWS Serverless Application Model (SAM). Use the following steps to deploy the project onto AWS.

1. Build the project.
   ```sh
   sam build
   ```
2. Deploy the project to AWS.
   ```sh
   sam deploy --guided --capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND
   ```
   * `CAPABILITY_AUTO_EXPAND` is required because the SAM template uses a nested stack.
   * To access the project frontend, point your browser to the URL shown in the CloudFormation/SAM output key `CloudFrontFrontendUrl`
3. If this is not the first time deploying and you have made changes to the frontend code, invalidate the project's CloudFront web distribution.
   * You can identify the project's web distribution in CloudFront by searching for the stack name you chose when deploying the project. The stack name should appear in the distibution's Comment field.
4. Create users for the sales representative and the administrator in [AWS Cognito](https://console.aws.amazon.com/cognito).
   * The project's Cognito user pool name is the  stack name you chose when deploying the project.
5. Assign the created users to the relevant group in Cognito (`sales_rep` and `costs_admin`).
   * These groups should already exist in Cognito, they were created when the project was deployed.
   * Users assigned to the `sales_rep` group will have permission to calculate costs for new merchants.
   * Users assigned to the `costs_admin` group will have permission to calculate costs for new merchants as well as upload CSVs to replace existing cost data.
6. Upload a CSV file. See [Uploading CSV File](#uploading-csv-file).

## Usage

### Uploading CSV File

1. Log in as the user belonging to the `costs_admin` group.
   * To log in, point your web browser to the URL shown in the CloudFormation/SAM output key `CloudFrontFrontendUrl`.
2. You should see an _Upload costs CSV_ section. Choose a file containing cost data then press the Upload button.
   * For a sample CSV file see `<PROJECT_DIR>/__tests__/unit/business/cost-data-example.csv` . 

Any files uploaded will remove all existing cost data from the service and replace with the new information from the uploaded CSV file. You will be notified when the upload completes. However, there is currently no frontend feedback provided as to whether the CSV file was successfully processed after uploading. You will have to use the [Logs](#logs) to view the status of the processing.

### Calculating Cost

To calculate the cost for a new merchant, log in as a user belonging to either the `costs_admin` or `sales_rep` group. You should see a _Calculate cost_ form. All 3 fields are required. You'll need to type in the industry as an exact match (minus leading and trailing whitespace) to what was in the CSV.

### Logs

Logs are stored in [AWS CloudWatch](https://console.aws.amazon.com/cloudwatch/) under log groups. There are log groups for the 3 Lambdas: `calculateCostFunction`, `generateCostFileUploadEndpointFunction`, and `costsFileUploadedFunction`. There is also a log group for the nested stack (`FrontendSource`) that deploys the frontend code to S3.

The `costsFileUploadedFunction` function is particularly useful to determine whether processing of a cost CSV file upload has completed successfully or not, because the processing is done asynchronously without any user feedback on the web page. After uploading the CSV file, there should be a log message saying `Cost data successfully replaced` . You may have to wait for a bit to see that message.

## Development

### Project Folder Structure

```sh
/
|-__tests__/
  |-integration/
  |-unit/
|-.devcontainer/
|-.vscode/
|-doc/
|-events/
|-src/
  |-adapters/
  |-business/
  |-errors/
  |-handlers/
  |-ui/
|-template.yml
```

Notable folders:
* `/doc :` Documentation related files other than this README
* `/events :` Sample events to use when running locally (these are currently not yet tested)
* `/src/adapters :` Adapters to external resources ala the _hexagonal/ports and adapters_ design pattern.
* `/src/business :` The bulk of the 'application logic'. Also performs user permissions testing.
* `/src/errors :` Custom errors
* `/src/handlers :` Lambda handlers which invoke the business logic. Performs Lambda/transport specific tasks.
* `/src/ui :` Content in this folder is deployed as static website resources on S3/CloudFront.
* `/template.yml :` SAM template

### Running Locally

#### Unit Tests

```sh
npm run test
```

#### Integration Tests

```sh
npm run integ-test
```

NOTE: Integration test has not yet been updated from the sample code

#### Local Lambdas

Because the following command to start the local API server needs to run under sudo, you'll need to first run `aws configure` under sudo:
```sh
sudo aws configure
```

Then run:
```sh
sudo sam local start-api
```

## Future TODOs

1. CI/CD
   * Currently, CloudFront needs to be manually invalidated after deploying updated frontend code.
   * Improvements required for zero-downtime deployments.
   * Deployment process for updates that include REST contract changes or schema changes?
   * Deployment versioning
   * Is there a better way to organize and coordinate the deployment of backend and frontend artifacts?
2. Production monitoring
   * Alarms, metrics.
3. Security
   * Client code is currently exposed to unauthenticated users.
   * API rate limiting and/or API alarms to prevent/audit reverse engineering attempts of the cost algorithm.
   * Verify the development Docker image is secure and not malicious.
   * VPCs
   * OAuth2/OIDC: Use PKCE instead of Implicit flow.
4. Frontend
   * Dropdown or select field for the industry in the _Calculate cost_ form.
   * User feedback as to whether the CSV is successfully processed or not.
   * Client-side error reporting.
   * Better validation and error handling.
5. Updating the cost data db is not atomic.
6. No schema versioning.
7. Business requirements
   * Allow for scheduling of when new price data becomes effective?
   * Ability to store and retrieve past quotes?
8. Audit log.

## License

Distributed under the MIT License. See `LICENSE` for more information.



## Acknowledgements
* [Visual Studio Code remote container setup](https://github.com/avdi/aws-sam)
* [README template](https://github.com/othneildrew/Best-README-Template)




<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[product-screenshot]: doc/images/screenshot.png
[architecture-screenshot]: doc/images/cost-service-architecture.png





