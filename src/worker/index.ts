import { Hono } from "hono";
import { cacheLayerHandler } from "./cache-layer";
import { cacheStatusHandler, clearCacheHandler } from "./cache-management";
import * as Sentry from "@sentry/cloudflare";

const app = new Hono<{ Bindings: Env }>().onError((err, c) => {
  Sentry.captureException(err);

  return c.json({ error: "Internal server error" }, 500);
});

app.get("/api/", (c) => c.json({ name: "Cloudflare" }));
app.get("/api/movie-details", cacheLayerHandler);

// Cache management endpoints
app.get("/api/cache/status", cacheStatusHandler);
app.delete("/api/cache/clear", clearCacheHandler);

export default Sentry.withSentry((env: Env) => {
  const { id: versionId } = env.CF_VERSION_METADATA;

  return {
    dsn: "https://17210238fad17ebbf8ac0ff04bd6d4c0@o4506044970565632.ingest.us.sentry.io/4509668596973568",
    release: versionId,
    // Adds request headers and IP for users, for more info visit:
    // https://docs.sentry.io/platforms/javascript/guides/cloudflare/configuration/options/#sendDefaultPii
    sendDefaultPii: true,

    // Enable logs to be sent to Sentry
    _experiments: { enableLogs: true },
    // Set tracesSampleRate to 1.0 to capture 100% of spans for tracing.
    // Learn more at
    // https://docs.sentry.io/platforms/javascript/configuration/options/#traces-sample-rate
    tracesSampleRate: 1.0,
  };
}, app);
