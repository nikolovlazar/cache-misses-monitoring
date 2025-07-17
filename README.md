# Cache Misses Monitoring Demo

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/templates/tree/main/vite-react-template)

This project demonstrates a real-world scenario where cache misses can unexpectedly overwhelm your servers and degrade service performance. It's inspired by the [NPM incident caused by VS Code 1.7](https://code.visualstudio.com/blogs/2016/11/3/rollback), where an automatic type acquisition feature generated millions of 404 requests that briefly impacted NPM's availability.

![React + TypeScript + Vite + Cloudflare Workers](https://imagedelivery.net/wSMYJvS3Xw-n339CbDyDIA/fc7b4b62-442b-4769-641b-ad4422d74300/public)

## The Problem

In many applications, endpoints are heavily cached to improve performance and reduce server load. However, changes in frontend behavior can cause requests to bypass the cache layer entirely, creating what we call "cache wall jumping" - where requests that should hit the cache end up hitting your origin server directly.

### Our Demo Scenario

This project simulates a common situation:

- **The Setup**: A `/movie-details` endpoint is cached so that requests don't hit the server
- **The Change**: A new real-time search feature is introduced that hits the endpoint on every keystroke
- **The Problem**: These dynamic requests bypass the cache, causing a surge of direct server requests
- **The Impact**: Server load increases dramatically, potentially causing performance degradation

This mirrors the NPM incident where VS Code 1.7's Automatic Type Acquisition feature made repeated requests for non-existent `@types` packages, overwhelming NPM's servers with 404 responses.

## Tech Stack

- [**React**](https://react.dev/) - Frontend with live search functionality
- [**Vite**](https://vite.dev/) - Fast build tooling and development server
- [**Hono**](https://hono.dev/) - Lightweight backend framework
- [**Cloudflare Workers**](https://developers.cloudflare.com/workers/) - Edge computing with caching capabilities

## Monitoring with Sentry

This project demonstrates how Sentry can help identify and monitor cache miss incidents:

- **Performance Monitoring**: Track endpoint response times and throughput
- **Error Tracking**: Monitor 404s and other cache-related errors
- **Alerting**: Get notified when cache hit rates drop or server load spikes
- **Real-time Insights**: Understand the impact of frontend changes on backend performance

## Getting Started

To start a new project with this template, run:

```bash
npm create cloudflare@latest -- --template=cloudflare/templates/vite-react-template
```

A live deployment of this template is available at:
[https://react-vite-template.templates.workers.dev](https://react-vite-template.templates.workers.dev)

## Development

Install dependencies:

```bash
npm install
```

Start the development server with:

```bash
npm run dev
```

Your application will be available at [http://localhost:5173](http://localhost:5173).

## Production

Build your project for production:

```bash
npm run build
```

Preview your build locally:

```bash
npm run preview
```

Deploy your project to Cloudflare Workers:

```bash
npm run build && npm run deploy
```

## Learn More

- [The NPM Incident: VS Code 1.7 Rollback](https://code.visualstudio.com/blogs/2016/11/3/rollback) - The real-world incident that inspired this demo
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Vite Documentation](https://vitejs.dev/guide/)
- [React Documentation](https://reactjs.org/)
- [Hono Documentation](https://hono.dev/)
- [Sentry Performance Monitoring](https://docs.sentry.io/product/performance/)

---

_This project was created for an article about monitoring cache misses and their impact on application performance. Article link: TBD_
