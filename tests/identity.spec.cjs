const { test, expect } = require("@playwright/test");
const fs = require("node:fs");
const base = process.env.SORT_LAB_BASE || "http://127.0.0.1:8089";
for (const width of [1440, 390])
  test(`original item identities and observed equal order at ${width}px`, async ({
    page,
  }) => {
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    await page.goto(base);
    await page
      .getByText("Try your own starting values", { exact: true })
      .click();
    async function input(values) {
      await page
        .getByLabel("Custom starting values", { exact: true })
        .fill(values.join(","));
      await page
        .getByRole("button", { name: "Compare custom values", exact: true })
        .click();
    }
    await input([2, 2, 1]);
    await page.getByLabel("Show original positions", { exact: true }).check();
    for (const [kind, ids, result] of [
      ["selection", ["#3", "#2", "#1"], "Reordered on this input"],
      ["bubble", ["#3", "#1", "#2"], "Preserved on this input"],
    ]) {
      await page.getByLabel("Algorithm", { exact: true }).selectOption(kind);
      await page.getByLabel("Choose a step", { exact: true }).press("End");
      await expect(page.locator("#bars .origin")).toHaveText(ids);
      await expect(page.locator("#bars .bar span")).toHaveText(["1", "2", "2"]);
      await expect(
        page.locator(
          `#comparison-table tr[data-algorithm="${kind}"] .equal-order-result`,
        ),
      ).toHaveText(result);
      await expect(page.locator("#order-status")).toContainText(
        kind === "bubble" ? "retain" : "changed",
      );
    }
    await page
      .getByText("Inspect equal-value order at this step", { exact: true })
      .click();
    await expect(page.locator("#order-list")).toContainText(
      "Value 2: originally #1 → #2; now #1 → #2.",
    );
    await input([2, 1, 2]);
    await page.getByLabel("Algorithm", { exact: true }).selectOption("quick");
    await page.getByLabel("Choose a step", { exact: true }).press("End");
    await expect(page.locator("#bars .origin")).toHaveText(["#2", "#3", "#1"]);
    await expect(page.locator("#order-list")).toContainText(
      "Value 2: originally #1 → #3; now #3 → #1.",
    );
    await expect(page.locator("#bars")).toHaveAttribute(
      "aria-label",
      /1 \(original position 2\), 2 \(original position 3\), 2 \(original position 1\)/,
    );
    const step = await page.locator("#step-count").innerText();
    await page.getByLabel("Show original positions", { exact: true }).uncheck();
    await expect(page.locator("#bars .origin")).toHaveCount(0);
    await expect(page.locator("#step-count")).toHaveText(step);
    await page
      .getByLabel("Show original positions", { exact: true })
      .press("Space");
    await expect(
      page.getByLabel("Show original positions", { exact: true }),
    ).toBeChecked();
    await expect(page.locator("#step-count")).toHaveText(step);
    await input([3, 1, 2]);
    await expect(
      page.locator("#comparison-table .equal-order-result"),
    ).toHaveText(["No equal values", "No equal values", "No equal values"]);
    await input(Array.from({ length: 24 }, (_, i) => (i % 2 ? 99 : 0)));
    await expect(page.locator("#bars .origin")).toHaveCount(24);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const sizes = await page.locator("#bars .origin").evaluateAll((nodes) =>
      nodes.map((node) => ({
        font: parseFloat(getComputedStyle(node).fontSize),
        width: node.getBoundingClientRect().width,
        bar: node.parentElement.getBoundingClientRect().width,
      })),
    );
    expect(
      sizes.every((size) => size.font >= 10 && size.width <= size.bar),
    ).toBe(true);
    if (width === 390) {
      await page.locator("#bars").press("ArrowRight");
      await expect
        .poll(() => page.locator("#bars").evaluate((el) => el.scrollLeft))
        .toBeGreaterThan(0);
    }
    await input([2, 2, 1, 4, 4, 3, 1, 2]);
    await page.getByLabel("Algorithm", { exact: true }).selectOption("quick");
    await page.getByLabel("Choose a step", { exact: true }).press("End");
    const visible = await page.locator("#bars .bar").evaluateAll((nodes) =>
      nodes.map((node) => ({
        value: Number(node.querySelector("span").textContent),
        origin: Number(node.querySelector("small").textContent.slice(1)) - 1,
      })),
    );
    const original = [2, 2, 1, 4, 4, 3, 1, 2];
    expect(visible.map((row) => original[row.origin])).toEqual(
      visible.map((row) => row.value),
    );
    expect(visible.map((row) => row.origin).sort((a, b) => a - b)).toEqual([
      0, 1, 2, 3, 4, 5, 6, 7,
    ]);
    fs.mkdirSync("verification/screenshots", { recursive: true });
    await page.locator(".explorer").screenshot({
      path: `verification/screenshots/item-origins-${width}.jpg`,
      type: "jpeg",
      quality: 85,
    });
    if (width === 1440)
      await page.locator(".input-comparison").screenshot({
        path: "verification/screenshots/equal-order-comparison.jpg",
        type: "jpeg",
        quality: 85,
      });
    expect(errors).toEqual([]);
  });
