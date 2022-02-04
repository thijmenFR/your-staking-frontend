# app.rad.live

## Installation

### Prerequisites

- Node 14+
- Yarn 1.22.15+

### Configuration

Addresses of contracts and collections are configured in `src/utils/constants.ts`

### Docker

You can run dockerized application with the following docker file

```
FROM node:14

COPY ./ /app

WORKDIR /app
RUN yarn install
EXPOSE 3000
CMD ["yarn", "start"]
```

### Host OS

You can run and build application with the following commands

```
git clone git@github.com:little-core-labs/app.rad.live-frontend.git
cd app.rad.live-fronted-workspace>
yarn install
yarn start
```

Application will start on http://localhost:3000

## Deploy

All deploys are currently run by [AWS Amplify](https://docs.aws.amazon.com/amplify/index.html). The production environment is based off the `master` branch and dev/testing is based off the `staging` branch. A push to master or staging branches should take 5-10 min to deploy on AWS.

### Production

The default URL for the production environment can be found here:

TBD

The custom domain for this site can be found here:

https://app.rad.live

All new code is deployed automatically by AWS Amplify when it's pushed to this repo. `git push origin master` will provision, build, deploy, and verify the new code on AWS.

### Staging

The default URL for the staging environment can be found here:

https://staging.d39vm6807fu19i.amplifyapp.com

The custom domain for this site can be found here:

https://app-staging.rad.live

All new code is deployed automatically by AWS Amplify when it's pushed to this repo. `git push origin staging` will provision, build, deploy, and verify the new code on AWS.
