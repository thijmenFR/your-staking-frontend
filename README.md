# YOUR

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

## Deployment
Before deployment check `cluster` variable in `src/contracts/config.ts`. It should be set to Solana network you want to deploy, `devnet` is default.


Once new accounts created for deployment corresponding values in `Pubkeys` should be updated in `src/contracts/config.ts`