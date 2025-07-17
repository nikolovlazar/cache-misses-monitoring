import type { Context } from "hono";

export async function cacheStatusHandler(c: Context) {
  try {
    const query = c.req.query("q");

    if (!query) {
      return c.json({ error: "Search query is required" }, { status: 400 });
    }

    // Create the same cache key used in cache-layer
    const cacheKey = `movie-search:${query.toLowerCase()}`;
    const cacheUrl = new URL(c.req.url);
    cacheUrl.pathname = `/cache/${cacheKey}`;

    // Check if item exists in cache
    const cache = caches.default;
    const cachedResponse = await cache.match(cacheUrl.toString());

    if (cachedResponse) {
      const cacheHeaders = Object.fromEntries(cachedResponse.headers);
      return c.json({
        status: "HIT",
        query: query,
        cacheKey: cacheKey,
        headers: cacheHeaders,
        cached: true,
      });
    }

    return c.json({
      status: "MISS",
      query: query,
      cacheKey: cacheKey,
      cached: false,
    });
  } catch (error) {
    console.error("Error checking cache status:", error);
    return c.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function clearCacheHandler(c: Context) {
  try {
    const query = c.req.query("q");

    if (!query) {
      return c.json({ error: "Search query is required" }, { status: 400 });
    }

    // Create the same cache key used in cache-layer
    const cacheKey = `movie-search:${query.toLowerCase()}`;
    const cacheUrl = new URL(c.req.url);
    cacheUrl.pathname = `/cache/${cacheKey}`;

    // Delete from cache
    const cache = caches.default;
    const deleted = await cache.delete(cacheUrl.toString());

    return c.json({
      success: true,
      query: query,
      cacheKey: cacheKey,
      deleted: deleted,
      message: deleted
        ? "Cache cleared successfully"
        : "No cache entry found to clear",
    });
  } catch (error) {
    console.error("Error clearing cache:", error);
    return c.json({ error: "Internal server error" }, { status: 500 });
  }
}
