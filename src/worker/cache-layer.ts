import * as Sentry from "@sentry/cloudflare";
import type { Context } from "hono";
import { movieDetailsHandler } from "./movie-details";

const CACHE_HEADER =
  "public, max-age=0, s-maxage=86400, stale-while-revalidate=60";

export async function cacheLayerHandler(c: Context) {
  try {
    const query = c.req.query("q");

    if (!query) {
      return c.json({ error: "Search query is required" }, { status: 400 });
    }

    const cacheKey = `movie-search:${query.toLowerCase()}`;
    const cacheUrl = new URL(c.req.url);
    cacheUrl.pathname = `/cache/${cacheKey}`;
    cacheUrl.search = "";

    console.log(`Cache URL: ${cacheUrl.toString()}`);
    console.log(`Cache Key: ${cacheKey}`);

    const cache = caches.default;
    return await Sentry.startSpan(
      {
        name: `Cache Get: ${cacheKey}`,
        attributes: {
          "cache.key": [cacheKey],
          "network.peer.address": "cloudflare-cache",
        },
        op: "cache.get",
      },
      async (span) => {
        const cachedResponse = await cache.match(cacheUrl.toString());
        const cacheHit = Boolean(cachedResponse);

        span.setAttribute("cache.hit", cacheHit);

        if (cacheHit && cachedResponse) {
          const responseText = await cachedResponse.clone().text();
          span.setAttribute("cache.item_size", responseText.length);
        }

        if (cachedResponse) {
          console.log(`Cache HIT for query: ${query}`);

          const response = new Response(cachedResponse.body, {
            status: cachedResponse.status,
            statusText: cachedResponse.statusText,
            headers: {
              ...Object.fromEntries(cachedResponse.headers),
              "X-Cache-Status": "HIT",
              "Cache-Control": CACHE_HEADER,
            },
          });

          return response;
        }

        console.log(`Cache MISS for query: ${query}`);

        const movieResponse = await movieDetailsHandler(c);

        if (movieResponse.status === 200) {
          const responseToCache = movieResponse.clone();

          span.setAttribute("cache.miss_reason", "movie_not_cached");

          const headers = new Headers(movieResponse.headers);
          headers.set("Cache-Control", CACHE_HEADER);
          headers.set("X-Cache-Status", "MISS");

          const cachedResponseObj = new Response(responseToCache.body, {
            status: movieResponse.status,
            statusText: movieResponse.statusText,
            headers: headers,
          });

          await Sentry.startSpan(
            {
              name: `Cache Put: ${cacheKey}`,
              attributes: {
                "cache.key": [cacheKey],
                "network.peer.address": "cloudflare-cache",
              },
              op: "cache.put",
            },
            async (span) => {
              const responseText = await cachedResponseObj.clone().text();
              span.setAttribute("cache.item_size", responseText.length);

              console.log(`Storing in cache: ${cacheUrl.toString()}`);
              await cache.put(cacheUrl.toString(), cachedResponseObj.clone());
              console.log(`Cache storage completed for: ${cacheKey}`);
            },
          );

          return cachedResponseObj;
        }

        span.setAttribute("cache.miss_reason", "movie_not_found");

        const headers = new Headers(movieResponse.headers);
        headers.set("X-Cache-Status", "MISS");

        return new Response(movieResponse.body, {
          status: movieResponse.status,
          statusText: movieResponse.statusText,
          headers: headers,
        });
      },
    );
  } catch (error) {
    console.error("Error in cache layer:", error);
    return c.json({ error: "Internal server error" }, { status: 500 });
  }
}
