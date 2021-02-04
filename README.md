<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

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
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#setup">Setup</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

This is my response to the coding challenge posed by a certain company.

### Built With

* [AWS](https://getbootstrap.com)
* [Node](https://jquery.com)
* [Docker](https://laravel.com)
* [Visual Studio Code](https://laravel.com)

It is assumed the reader has knowledge of the above and is able to find his/her way around them.

<!-- GETTING STARTED -->
## Getting Started

To build and deploy the project to AWS follow these steps.

### Prerequisites

* AWS account
  * Full access privileges with a valid access key ID and secret access key.
  * Recommend using a new organization sub-account to make sure any resources created by this project can be guaranteed to be removed by deleting the account.
* Docker
  * Required by AWS SAM for local application testing.
  * Required by Visual Studio Code for running a remote development container.
* Visual Studio Code
  * This guide assumes you will be using Visual Studio Code. If using a different IDE, you'll need to install AWS SAM, AWS CLI, Python, Node in order to work with the project.
* Visual Studio Code Remote - Containers extension
  * This is the extension with id `ms-vscode-remote.remote-containers` .
* Project source code
  * `git clone https://github.com/shoe5454/cost-service` or download the project sources from `https://github.com/shoe5454/cost-service`
  * In the rest of this guide, the local `cost-service` folder will be referred to as `<PROJECT_DIR>`

### Setup

1. In Visual Studio Code, hit F1 then search for the `Remote-Containers: Open Folder in Container...` command.
2. Browse for and select your `<PROJECT_DIR>` folder.
  * The Docker container for your development environment will be created. This may take a few minutes.
4. Open the Terminal panel in Visual Studio Code. Run `aws configure` and follow the prompts.
  * Recommend using `us-east-1` as the default region because the project has not been tested with other regions.
5. In the Terminal panel, run `npm install` . This is only required if you intend to run unit tests locally.

### Deploy To AWS

The project uses the AWS Serverless Application Model (SAM). Use the following steps to deploy the project onto AWS.

1. From the Terminal panel in Visual Studio Code, build the project.
   ```sh
   sam build
   ```
2. Deploy the project to AWS.
   ```sh
   sam deploy --guided --capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND
   ```
   `CAPABILITY_AUTO_EXPAND` is required because the SAM template uses a nested stack.
   To access the project frontend, point your browser to the URL shown in the CloudFormation/SAM output key `CloudFrontFrontendUrl`
3. If this is not the first time deploying and you have made changes to the frontend code, invalidate the project's CloudFront web distribution.
  * You can identify the project's web distribution in CloudFront by searching for the stack name you chose when deploying the project. The stack name should appear in the distibution's Comment field.
4. Create users for the sales representative and the administrator in AWS Cognito (https://console.aws.amazon.com/cognito).
  * The project's Cognito user pool name is the  stack name you chose when deploying the project.
5. Assign the created users to the relevant group in Cognito (`sales_rep` and `costs_admin`).
  * These groups should already exist in Cognito, they were created when the project was deployed.
  * Users assigned to the `sales_rep` group will have permission to calculate costs for new merchants.
  * Users assigned to the `costs_admin` group will have permission to calculate costs for new merchants as well as upload CSVs to replace existing cost data.
6. Log in as the `costs_admin` user and upload the example CSV TODO

## Architecture

Logical architecture diagram

## Project Folder Structure


## Running Locally

### Unit Tests

From the Terminal panel in Visual Studio Code:
```sh
npm run test
```

### Local Lambdas

TODO

<!-- USAGE EXAMPLES -->
## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_



<!-- KNOWN LIMITATIONS -->
## Known Limitations

1. CloudFront needs to be manually invalidated after deploying updated frontend code.


<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.



<!-- CONTACT -->
## Contact

Your Name - [@your_twitter](https://twitter.com/your_username) - email@example.com

Project Link: [https://github.com/your_username/repo_name](https://github.com/your_username/repo_name)



<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements
* [Visual Studio Code remote container setup](https://github.com/avdi/aws-sam)
* [README template](https://github.com/othneildrew/Best-README-Template)




<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=for-the-badge
[issues-url]: https://github.com/othneildrew/Best-README-Template/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[product-screenshot]: images/screenshot.png





