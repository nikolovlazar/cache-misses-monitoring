import type { Context } from 'hono';
import { movieDetailsHandler } from './movie-details';

// Cache configuration
const CACHE_HEADER = 'public, max-age=300, s-maxage=300';

export async function cacheLayerHandler(c: Context) {
  try {
    const query = c.req.query('q');

    if (!query) {
      return c.json({ error: 'Search query is required' }, { status: 400 });
    }

    // Create a cache key based on the request
    const cacheKey = `movie-search:${query.toLowerCase()}`;
    const cacheUrl = new URL(c.req.url);
    cacheUrl.pathname = `/cache/${cacheKey}`;

    // Check Cloudflare cache first
    const cache = caches.default;
    const cachedResponse = await cache.match(cacheUrl.toString());

    if (cachedResponse) {
      console.log(`Cache HIT for query: ${query}`);

      // Add cache status header
      const response = new Response(cachedResponse.body, {
        status: cachedResponse.status,
        statusText: cachedResponse.statusText,
        headers: {
          ...Object.fromEntries(cachedResponse.headers),
          'X-Cache-Status': 'HIT',
          'Cache-Control': CACHE_HEADER,
        },
      });

      return response;
    }

    console.log(`Cache MISS for query: ${query}`);

    // Cache miss - call the movie-details endpoint
    const movieResponse = await movieDetailsHandler(c);

    // Only cache successful responses
    if (movieResponse.status === 200) {
      // Clone the response to cache it
      const responseToCache = movieResponse.clone();

      // Create a new response with proper cache headers
      const headers = new Headers(movieResponse.headers);
      headers.set('Cache-Control', CACHE_HEADER);
      headers.set('X-Cache-Status', 'MISS');

      const cachedResponseObj = new Response(responseToCache.body, {
        status: movieResponse.status,
        statusText: movieResponse.statusText,
        headers: headers,
      });

      // Store in cache
      await cache.put(cacheUrl.toString(), cachedResponseObj.clone());

      return cachedResponseObj;
    }

    // Don't cache error responses, just return them
    const headers = new Headers(movieResponse.headers);
    headers.set('X-Cache-Status', 'MISS');

    return new Response(movieResponse.body, {
      status: movieResponse.status,
      statusText: movieResponse.statusText,
      headers: headers,
    });
  } catch (error) {
    console.error('Error in cache layer:', error);
    return c.json({ error: 'Internal server error' }, { status: 500 });
  }
}
