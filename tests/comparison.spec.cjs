const { test, expect } = require("@playwright/test");
const fs = require("node:fs");
const { trace } = require("../docs/trace");
const base = process.env.SORT_LAB_BASE || "http://127.0.0.1:8089";
for (const width of [1440, 390])
  test(`same-input custom comparisons, recovery and reset at ${width}px`, async ({
    page,
  }) => {
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    await page.goto(base);
    await page
      .getByText("Try your own starting values", { exact: true })
      .click();
    await page
      .getByLabel("Custom starting values", { exact: true })
      .fill("3, 2, 1");
    await page
      .getByRole("button", { name: "Compare custom values", exact: true })
      .click();
    await expect(page.locator("#input-description")).toContainText(
      "Custom input · 3 values: 3, 2, 1",
    );
    for (const kind of ["bubble", "selection", "quick"]) {
      const final = trace(kind, [3, 2, 1]).at(-1),
        row = page.locator(`#comparison-table tr[data-algorithm="${kind}"]`);
      await expect(row.locator("td").nth(0)).toHaveText(
        String(final.comparisons),
      );
      await expect(row.locator("td").nth(1)).toHaveText(String(final.swaps));
      await row.getByRole("button").click();
      await expect(page.locator("#bars .bar span")).toHaveText(["3", "2", "1"]);
      await page.getByLabel("Choose a step", { exact: true }).press("End");
      await expect(page.locator("#comparisons")).toHaveText(
        String(final.comparisons),
      );
      await expect(page.locator("#swaps")).toHaveText(String(final.swaps));
      await expect(page.locator("#bars .bar span")).toHaveText(["1", "2", "3"]);
      await page
        .getByRole("button", { name: "Reset to the same input ↺", exact: true })
        .click();
      await expect(page.locator("#bars .bar span")).toHaveText(["3", "2", "1"]);
    }
    await page.getByLabel("Algorithm", { exact: true }).selectOption("bubble");
    await expect(page.locator("#bars .bar span")).toHaveText(["3", "2", "1"]);
    await page
      .getByLabel("Custom starting values", { exact: true })
      .fill("3,,1");
    await page
      .getByRole("button", { name: "Compare custom values", exact: true })
      .click();
    await expect(page.getByRole("alert")).toContainText(
      "current trace is preserved",
    );
    await expect(page.locator("#bars .bar span")).toHaveText(["3", "2", "1"]);
    const many = Array.from({ length: 24 }, (_, i) => (i % 2 ? 99 : 0));
    await page
      .getByLabel("Custom starting values", { exact: true })
      .fill(many.join(","));
    await page
      .getByRole("button", { name: "Compare custom values", exact: true })
      .click();
    await expect(page.getByRole("alert")).toBeHidden();
    await expect(page.locator("#bars .bar")).toHaveCount(24);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    fs.mkdirSync("verification/screenshots", { recursive: true });
    await page.screenshot({
      path: `verification/screenshots/custom-${width}.jpg`,
      type: "jpeg",
      quality: 85,
      fullPage: true,
    });
    await page
      .getByLabel("Custom starting values", { exact: true })
      .fill("8,3,3,1,9,0,7,2");
    await page
      .getByRole("button", { name: "Compare custom values", exact: true })
      .click();
    if (width === 1440) {
      await page
        .locator(".input-comparison")
        .evaluate((el) =>
          el.scrollIntoView({ block: "start", behavior: "instant" }),
        );
      await page.screenshot({
        path: "verification/screenshots/comparison.png",
      });
      await page
        .locator(".explorer")
        .evaluate((el) =>
          el.scrollIntoView({ block: "start", behavior: "instant" }),
        );
      await page.screenshot({
        path: "verification/screenshots/custom-trace.png",
      });
    }
    await page
      .getByLabel("Starting pattern", { exact: true })
      .selectOption("sorted");
    await expect(page.locator("#input-description")).toContainText(
      "Generated input",
    );
    await expect(page.locator("#bars .bar")).toHaveCount(12);
    const bubble = page.locator(
      '#comparison-table tr[data-algorithm="bubble"]',
    );
    await expect(bubble.locator("td").nth(0)).toHaveText("11");
    await expect(bubble.locator("td").nth(1)).toHaveText("0");
    expect(errors).toEqual([]);
  });
