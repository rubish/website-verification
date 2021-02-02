# Website Verification Service

This hack solves two of the tasks involved in website verification:

1. Functional, Non-Redirecting Website
2. Identify Pages of Interest

## Setup

- Install node (>15), mongodb and redis.
- Copy `.env.sample` to `.env` and customize connections strings as per your setup
- Execute `npm install` in project root

## Lint

```
npm run lint
```

## Development

Start server in one console and worker in another

```
npm run server:dev
```

```
npm run worker:dev
```

You would also need to start a headless browser to fetch the website pages.

```
docker run -p 3000:3000 browserless/chrome
```

Import `website-verification.postman_collection.json` in postman and try out the APIs.
