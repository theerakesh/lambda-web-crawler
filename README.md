# AWS-Lambda-web-crawler

This project contains source code and supporting files for a serverless application that you can deploy with the SAM CLI. It includes the following files and folders.

- **webcrawler** - Code crawling a website
- **emailphoneextractor** - Code for the extracting email/phone
- events - Invocation events that you can use to invoke the function.
- template.yaml - A template that defines the application's AWS resources.

The application uses several AWS resources, including Lambda functions and a Step-Function. These resources are defined in the `template.yaml` file in this project. You can update the template to add AWS resources through the same deployment process that updates your application code.

## Deploy the sample application

The Serverless Application Model Command Line Interface (SAM CLI) is an extension of the AWS CLI that adds functionality for building and testing Lambda applications. It uses Docker to run your functions in an Amazon Linux environment that matches Lambda. It can also emulate your application's build environment and API.

To use the SAM CLI, you need the following tools.

* SAM CLI - [Install the SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
* Node.js - [Install Node.js 14.x](https://nodejs.org/en/), including the NPM package management tool.
* Docker - [Install Docker community edition](https://hub.docker.com/search/?type=edition&offering=community)


> **_NOTE:_** Create a s3 bucket through aws console or cli as below
> ```bash
>   $ aws s3 mb s3://your-unique-bucket-name
> ```
>  and update `template.yaml` where the lambda can store >the crawled pages
>```yaml
>  Parameters: 
>  AppBucketName: 
>    Type: String
>    Default: your-unique-bucket-name # bucket name has to >be globally unique
>```



To build and deploy your application for the first time, run the following in your shell:

```bash
sam build
sam deploy --guided
```

The first command will build the source of your application. The second command will package and deploy your application to AWS, with a series of prompts


## Use the SAM CLI to build and test locally

Build your application with the `sam build` command.

```bash
web-crawler$ sam build
```

The SAM CLI installs dependencies defined in `hello-world/package.json`, creates a deployment package, and saves it in the `.aws-sam/build` folder.

Test a single function by invoking it directly with a test event. An event is a JSON document that represents the input that the function receives from the event source. Test events are included in the `events` folder in this project.

Run functions locally and invoke them with the `sam local invoke` command.

```bash
web-crawler$ sam local invoke WebCrawlerFunction --event events/event.json
```

Once deployed you can use the step function to invoke the lambda as follows

- first provide a Input as `event`
  <img width="865" alt="image" src="https://user-images.githubusercontent.com/90252765/170495065-5a040f05-54dd-4025-8d5c-16f5818d9a60.png">

- start execution and u can see following out based on the steps fails or passes
- **fail**
  <img width="673" alt="image" src="https://user-images.githubusercontent.com/90252765/170495467-fca915f9-e55c-4dd2-aebb-8d0f5e2661e2.png">

- **pass**
  <img width="664" alt="image" src="https://user-images.githubusercontent.com/90252765/170495673-139acf8f-e270-48f0-8eed-9365e54ee606.png">

- Now you can select the state and see the respective `input/output` e.g. after selecting state `EmailPhoneExtractor`
  <img width="667" alt="image" src="https://user-images.githubusercontent.com/90252765/170495997-36685031-3aa3-4179-8fc1-9ab15ce31b6c.png">

## Understanding how the lambdas works

First lambda `webcrawler` uses