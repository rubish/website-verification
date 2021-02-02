# Website Verification Service

Today Razorpay has enabled ~1.2 Million merchants to accept payments on their websites. And to do that we had to manually verify the merchant's website. Yes you read it right, it is all done Manually! So, our Platform team is brewing something to automate the merchant's website verification process during Merchant Onboarding to Razorpay.

To establish if the Merchant’s business is legitimate, we have to scan the Merchant’ website and surface multiple details ranging from page availability to business category.

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
