import { browser } from 'k6/browser';
import { check } from 'k6';

export const options = {
  scenarios: {
    ui: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '3m', target: 100 }, // Ramp up to 100 VUs over 3 minutes
        { duration: '30s', target: 0 }, // Ramp down over 30 seconds
      ],
      options: {
        browser: {
          type: 'chromium',
        },
      },
    },
  },
};

// Pool of movie titles to search for
const movieTitles = [
  'The Matrix',
  'Inception',
  'Pulp Fiction',
  'The Dark Knight',
  'Forrest Gump',
  'Interstellar',
];

// const BASE_URL = 'https://cache-misses-monitoring.lazar-nikolov-94.workers.dev'; // For production
const BASE_URL = 'http://localhost:5173'; // For local development

export default async function () {
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to the React app
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // Each VU performs just ONE search then dies
    const randomTitle =
      movieTitles[Math.floor(Math.random() * movieTitles.length)];
    console.log(`VU searching for: "${randomTitle}"`);

    // Find the search input using locator (modern k6 approach)
    const searchInput = page.locator('input[id="search"]');

    // Wait for the search input to be visible
    await searchInput.waitFor({ state: 'visible', timeout: 10000 });

    // Click on the input to focus it
    await searchInput.click();
    await page.waitForTimeout(200);

    // Clear the input by selecting all and using backspace (since backspace works but delete doesn't)
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    await page.waitForTimeout(200);

    // Type the new movie title
    await page.keyboard.type(randomTitle);
    await page.waitForTimeout(500);

    console.log(`✅ Set input value to: "${randomTitle}"`);

    // Submit the search by pressing Enter
    await page.keyboard.press('Enter');

    // Wait for search to start (loading indicator appears)
    await page.waitForTimeout(500);

    // Wait for search results to load completely
    try {
      // Wait for loading to complete by checking if "Searching" text disappears
      await page.waitForFunction(
        () => {
          const bodyText = document.body.textContent || '';
          return !bodyText.includes('Searching');
        },
        { timeout: 10000 }
      );

      console.log(`✅ Search completed for "${randomTitle}" - VU dying`);
    } catch (error) {
      console.log(`⚠️ Search timeout for "${randomTitle}" - VU dying anyway`);
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  } finally {
    await page.close();
    await context.close();
  }
}

export function handleSummary(data) {
  console.log('\n🎯 BROWSER TEST SUMMARY:');
  console.log('Max VUs: 100');
  console.log(
    `Test Duration: ${Math.round(data.state.testRunDurationMs / 1000)}s`
  );
  const iterationsCompleted = data.metrics?.iterations?.values?.count || 0;
  console.log(`Searches Completed: ${iterationsCompleted}`);

  // Calculate search rate
  const searchRate =
    iterationsCompleted / (data.state.testRunDurationMs / 1000);
  console.log(`Search Rate: ${searchRate.toFixed(2)} searches/second`);

  return {
    'browser-test-summary.json': JSON.stringify(
      {
        maxVUs: 100,
        testDuration: data.state.testRunDurationMs,
        searchesCompleted: iterationsCompleted,
        searchRate: searchRate,
        timestamp: new Date().toISOString(),
      },
      null,
      2
    ),
  };
}
