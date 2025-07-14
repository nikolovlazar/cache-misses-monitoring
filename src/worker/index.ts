import { Hono } from 'hono';
import { cacheLayerHandler } from './cache-layer';
import { cacheStatusHandler, clearCacheHandler } from './cache-management';

const app = new Hono<{ Bindings: Env }>();

app.get('/api/', (c) => c.json({ name: 'Cloudflare' }));
app.get('/api/movie-details', cacheLayerHandler);

// Cache management endpoints
app.get('/api/cache/status', cacheStatusHandler);
app.delete('/api/cache/clear', clearCacheHandler);

export default app;
