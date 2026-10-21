const { test, expect } = require("@playwright/test"),
  fs = require("node:fs/promises");
test("trace controls, complete order, reset and mobile layout", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(process.env.SORT_LAB_BASE || "http://127.0.0.1:8089");
  await expect(page.locator("#bars .bar")).toHaveCount(12);
  for (let kind of ["bubble", "selection", "quick"]) {
    await page.getByLabel("Algorithm", { exact: true }).selectOption(kind);
    await page
      .getByRole("button", { name: "Next step →", exact: true })
      .click();
    await expect(page.locator("#step-count")).toContainText("Step 1 /");
    await page.getByLabel("Choose a step", { exact: true }).press("End");
    await expect(page.locator("#step-note")).toContainText("Complete.");
    const values = await page.locator("#bars .bar span").allTextContents();
    expect(values.map(Number)).toEqual(
      values.map(Number).sort((a, b) => a - b),
    );
    await expect(
      page.getByRole("button", { name: "Play →", exact: true }),
    ).toBeDisabled();
    await page
      .getByRole("button", { name: "Reset to the same input ↺", exact: true })
      .click();
    await expect(page.locator("#comparisons")).toHaveText("0");
  }
  await page.getByLabel("Algorithm", { exact: true }).selectOption("bubble");
  for (let i = 0; i < 5; i++)
    await page
      .getByRole("button", { name: "Next step →", exact: true })
      .click();
  await fs.mkdir("verification/screenshots", { recursive: true });
  await page.screenshot({
    path: "verification/screenshots/explorer.jpg",
    type: "jpeg",
    quality: 85,
    fullPage: true,
  });
  await page.getByRole("button", { name: "Play →", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Pause Ⅱ", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Pause Ⅱ", exact: true }).click();
  await page
    .getByLabel("Starting pattern", { exact: true })
    .selectOption("reversed");
  await page.getByLabel("Number of values", { exact: true }).selectOption("20");
  await expect(page.locator("#bars .bar")).toHaveCount(20);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.keyboard.press("Control+Home");
  await page.screenshot({
    path: "verification/screenshots/mobile-explorer.jpg",
    type: "jpeg",
    quality: 85,
    fullPage: true,
  });
  expect(errors).toEqual([]);
});
