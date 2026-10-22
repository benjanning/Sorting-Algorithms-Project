const { test } = require("node:test"),
  assert = require("node:assert/strict"),
  fs = require("node:fs"),
  { trace, sample, parseInput } = require("../docs/trace");
test("all final traces agree with actual Python outputs and every swap preserves the multiset", () => {
  let cases = JSON.parse(
    fs.readFileSync("verification/python-fixtures.json", "utf8"),
  );
  for (let item of cases)
    for (let kind of ["bubble", "selection", "quick"]) {
      const original = item.input.slice(),
        frames = trace(kind, item.input);
      assert.deepEqual(frames.at(-1).values, item.outputs[kind]);
      assert.deepEqual(item.input, original);
      for (let frame of frames) {
        assert.deepEqual(
          frame.values.slice().sort((a, b) => a - b),
          original.slice().sort((a, b) => a - b),
        );
        assert.ok(frame.active.every((i) => i >= 0 && i < original.length));
      }
    }
});
test("simple traces have independently known comparison and swap counts", () => {
  for (let [kind, input, comparisons, swaps] of [
    ["bubble", [3, 2, 1], 3, 3],
    ["bubble", [1, 2, 3], 2, 0],
    ["selection", [3, 2, 1], 3, 1],
    ["quick", [3, 1, 2], 2, 2],
  ]) {
    const last = trace(kind, input).at(-1);
    assert.equal(last.comparisons, comparisons);
    assert.equal(last.swaps, swaps);
  }
});
test("patterns are deterministic and unsupported domains are rejected", () => {
  assert.deepEqual(sample("random", 12), sample("random", 12));
  assert.throws(() => trace("unknown", [1]));
  assert.throws(() => trace("bubble", [-1, 2]));
  assert.throws(() => trace("quick", Array(25).fill(1)));
});
test("custom values preserve duplicates and reject ambiguous or unsupported input", () => {
  assert.deepEqual(parseInput(" 8, 3  3, 0,99 "), [8, 3, 3, 0, 99]);
  assert.deepEqual(parseInput("0"), [0]);
  assert.equal(parseInput(Array(24).fill("99").join(",")).length, 24);
  for (const value of [
    "",
    " ",
    ",1",
    "1,",
    "1,,2",
    "1, ,2",
    "01,2",
    "1.0,2",
    "1e1,2",
    "-1,2",
    "100,2",
    "true,2",
    null,
    Array(25).fill("1").join(","),
  ])
    assert.throws(() => parseInput(value));
});
test("complete comparison totals are known independently for reversed and equal inputs", () => {
  for (const [kind, comparisons, swaps] of [
    ["bubble", 3, 3],
    ["selection", 3, 1],
    ["quick", 3, 1],
  ]) {
    const final = trace(kind, parseInput("3,2,1")).at(-1);
    assert.equal(final.comparisons, comparisons);
    assert.equal(final.swaps, swaps);
    assert.deepEqual(final.values, [1, 2, 3]);
  }
  const equal = trace("quick", [1, 1, 1]).at(-1);
  assert.equal(equal.comparisons, 3);
  assert.equal(equal.swaps, 2);
});

test("every frame keeps immutable original identities consistent with actual values", () => {
  const cases = JSON.parse(
    fs.readFileSync("verification/python-fixtures.json", "utf8"),
  );
  for (const item of cases)
    for (const kind of ["bubble", "selection", "quick"]) {
      const frames = trace(kind, item.input);
      for (const frame of frames) {
        assert.deepEqual(
          frame.origins.slice().sort((a, b) => a - b),
          item.input.map((_, i) => i),
        );
        assert.deepEqual(
          frame.origins.map((id) => item.input[id]),
          frame.values,
        );
      }
      if (item.input.length) {
        const start = frames[0].origins.slice();
        frames.at(-1).origins[0] = -1;
        assert.deepEqual(frames[0].origins, start);
        assert.deepEqual(trace(kind, item.input)[0].origins, start);
      }
    }
});
test("known equal-value reversals and preserved orders use original item identities", () => {
  const { equalOrder } = require("../docs/trace");
  for (const [kind, input, ids, preserved] of [
    ["selection", [2, 2, 1], [2, 1, 0], false],
    ["bubble", [2, 2, 1], [2, 0, 1], true],
    ["quick", [2, 1, 2], [1, 2, 0], false],
    ["selection", [1, 1, 1], [0, 1, 2], true],
    ["quick", [1, 1, 1], [2, 0, 1], false],
  ]) {
    const last = trace(kind, input).at(-1);
    assert.deepEqual(last.origins, ids);
    const order = equalOrder(input, last.origins);
    assert.equal(order.hasRepeats, true);
    assert.equal(order.preserved, preserved);
  }
  assert.deepEqual(equalOrder([2, 2, 1], [2, 1, 0]).groups, [
    { value: 2, original: [0, 1], current: [1, 0] },
  ]);
  assert.equal(equalOrder([3, 1, 2], [1, 2, 0]).hasRepeats, false);
  assert.deepEqual(equalOrder([], []), {
    hasRepeats: false,
    preserved: true,
    groups: [],
  });
});
test("equal-order inspection rejects missing, duplicate and invalid identities", () => {
  const { equalOrder } = require("../docs/trace");
  for (const ids of [
    [0, 0, 1],
    [0, 1],
    [-1, 1, 2],
    [0, 1, 3],
    [0, 1, 1.5],
    [true, 1, 2],
    null,
  ])
    assert.throws(() => equalOrder([2, 2, 1], ids));
  const input = [2, 2, 1],
    ids = [2, 1, 0];
  const before = JSON.stringify([input, ids]);
  equalOrder(input, ids);
  assert.equal(JSON.stringify([input, ids]), before);
});
