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
