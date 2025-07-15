import { browser } from 'k6/browser';
import { check } from 'k6';

export const options = {
  scenarios: {
    ui: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '10s', target: 10 },
        { duration: '40s', target: 10 },
        { duration: '10s', target: 0 },
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
const BASE_URL = 'http://localhost:5173/live-search'; // For local development

export default async function () {
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to the React app
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // Each VU types one movie title character by character to trigger live search
    const randomTitle =
      movieTitles[Math.floor(Math.random() * movieTitles.length)];
    console.log(`VU will type: "${randomTitle}"`);

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

    // Type the movie title letter by letter to trigger live search
    console.log(`🔤 Typing "${randomTitle}" character by character...`);

    for (let i = 0; i < randomTitle.length; i++) {
      const char = randomTitle[i];
      await page.keyboard.type(char);

      const currentValue = randomTitle.substring(0, i + 1);
      console.log(`⌨️  Typed: "${currentValue}"`);

      // Wait 400ms between characters to allow debounced search to trigger
      // (LiveSearch has 300ms debounce, so 400ms should be enough)
      await page.waitForTimeout(150);
    }

    console.log(`✅ Finished typing: "${randomTitle}"`);

    // Wait a bit more for the final search to complete
    await page.waitForTimeout(1000);

    // Wait for any final search operations to complete
    await page.waitForTimeout(1000);

    // Check if we have movie details displayed (indicating successful search)
    try {
      // Look for movie details content to verify search worked
      await page.waitForSelector(`img[alt*="${randomTitle}"]`, {
        timeout: 5000,
      });
      console.log(`✅ Live search completed for "${randomTitle}" - VU dying`);
    } catch (error) {
      // Could be "not found" result or still loading - that's okay for testing
      console.log(`⚠️ Live search finished for "${randomTitle}" - VU dying`);
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  } finally {
    await page.close();
    await context.close();
  }
}

export function handleSummary(data) {
  console.log('\n🎯 LIVE SEARCH TEST SUMMARY:');
  console.log('Max VUs: 10');
  console.log(
    `Test Duration: ${Math.round(data.state.testRunDurationMs / 1000)}s`
  );
  const iterationsCompleted = data.metrics?.iterations?.values?.count || 0;
  console.log(`Typing Sessions Completed: ${iterationsCompleted}`);

  // Calculate typing session rate
  const sessionRate =
    iterationsCompleted / (data.state.testRunDurationMs / 1000);
  console.log(
    `Typing Sessions Rate: ${sessionRate.toFixed(2)} sessions/second`
  );

  return {
    'browser-test-summary.json': JSON.stringify(
      {
        maxVUs: 10,
        testDuration: data.state.testRunDurationMs,
        typingSessionsCompleted: iterationsCompleted,
        typingSessionRate: sessionRate,
        timestamp: new Date().toISOString(),
      },
      null,
      2
    ),
  };
}
