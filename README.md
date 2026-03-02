# agentic-ds

Cloudflare Workers project written in TypeScript.

## Prerequisites

- Node.js 18+
- npm
- Cloudflare account
- Wrangler CLI (already in dev dependencies)

## Setup

Install dependencies:

```bash
npm install
```

Authenticate Wrangler (first time only):

```bash
npx wrangler login
```

## Local Development

Run the worker locally:

```bash
npm run dev
```

## Deploy

Deploy to Cloudflare:

```bash
npm run deploy
```

## Type Generation

Generate Cloudflare types:

```bash
npm run cf-typegen
```