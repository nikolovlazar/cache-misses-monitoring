import { browser } from "k6/browser";

export const options = {
  scenarios: {
    ui: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "10s", target: 10 },
        { duration: "130s", target: 10 },
        { duration: "10s", target: 0 },
      ],
      options: {
        browser: {
          type: "chromium",
        },
      },
    },
  },
};

const movieTitles = [
  "The Matrix",
  "Inception",
  "Pulp Fiction",
  "The Dark Knight",
  "Forrest Gump",
  "Interstellar",
];

const BASE_URL =
  "https://cache-misses-monitoring.nikolovlazar.workers.dev/live-search"; // For production
// const BASE_URL = "http://localhost:5173/live-search"; // For local development

export default async function () {
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(BASE_URL, { waitUntil: "networkidle" });

    const randomTitle =
      movieTitles[Math.floor(Math.random() * movieTitles.length)];
    console.log(`VU will type: "${randomTitle}"`);

    const searchInput = page.locator('input[id="search"]');

    await searchInput.waitFor({ state: "visible", timeout: 10000 });

    await searchInput.click();
    await page.waitForTimeout(200);

    await page.keyboard.press("Backspace");
    await page.keyboard.press("Backspace");
    await page.keyboard.press("Backspace");
    await page.keyboard.press("Backspace");
    await page.keyboard.press("Backspace");
    await page.keyboard.press("Backspace");
    await page.keyboard.press("Backspace");
    await page.keyboard.press("Backspace");
    await page.keyboard.press("Backspace");
    await page.keyboard.press("Backspace");
    await page.waitForTimeout(200);

    console.log(`🔤 Typing "${randomTitle}" character by character...`);

    for (let i = 0; i < randomTitle.length; i++) {
      const char = randomTitle[i];
      await page.keyboard.type(char);

      const currentValue = randomTitle.substring(0, i + 1);
      console.log(`⌨  Typed: "${currentValue}"`);

      await page.waitForTimeout(150);
    }

    console.log(`✅ Finished typing: "${randomTitle}"`);

    await page.waitForTimeout(1000);

    await page.waitForTimeout(1000);

    try {
      await page.waitForSelector(`img[alt*="${randomTitle}"]`, {
        timeout: 5000,
      });
      console.log(`✅ Live search completed for "${randomTitle}" - VU dying`);
    } catch (_) {
      console.log(`! Live search finished for "${randomTitle}" - VU dying`);
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  } finally {
    await page.close();
    await context.close();
  }
}

export function handleSummary(data) {
  console.log("\n🎯 LIVE SEARCH TEST SUMMARY:");
  console.log("Max VUs: 10");
  console.log(
    `Test Duration: ${Math.round(data.state.testRunDurationMs / 1000)}s`,
  );
  const iterationsCompleted = data.metrics?.iterations?.values?.count || 0;
  console.log(`Typing Sessions Completed: ${iterationsCompleted}`);

  const sessionRate =
    iterationsCompleted / (data.state.testRunDurationMs / 1000);
  console.log(
    `Typing Sessions Rate: ${sessionRate.toFixed(2)} sessions/second`,
  );

  return {
    "browser-test-summary.json": JSON.stringify(
      {
        maxVUs: 10,
        testDuration: data.state.testRunDurationMs,
        typingSessionsCompleted: iterationsCompleted,
        typingSessionRate: sessionRate,
        timestamp: new Date().toISOString(),
      },
      null,
      2,
    ),
  };
}
