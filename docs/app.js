(() => {
  "use strict";
  const $ = (selector) => document.querySelector(selector);
  const names = {
    bubble: "Bubble sort",
    selection: "Selection sort",
    quick: "Quicksort · rightmost pivot",
  };
  let frames = [],
    position = 0,
    timer = null,
    input = [],
    traces = {};
  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
    $("#play").textContent = "Play →";
  }
  function show() {
    const frame = frames[position];
    const maximum = Math.max(1, ...input);
    $("#bars").replaceChildren(
      ...frame.values.map((value, index) => {
        const bar = document.createElement("div");
        bar.className =
          "bar" +
          (frame.active.includes(index) ? " active" : "") +
          (position === frames.length - 1 ? " complete" : "");
        bar.style.height = Math.max(3, (value / maximum) * 245) + "px";
        const label = document.createElement("span");
        label.textContent = value;
        bar.append(label);
        return bar;
      }),
    );
    $("#bars").classList.toggle("dense", input.length > 20);
    $("#bars").setAttribute(
      "aria-label",
      "Values at step " + position + ": " + frame.values.join(", "),
    );
    $("#comparisons").textContent = frame.comparisons;
    $("#swaps").textContent = frame.swaps;
    $("#step-count").textContent =
      "Step " + position + " / " + (frames.length - 1);
    $("#step-note").textContent = frame.note;
    $("#timeline").value = position;
    $("#previous").disabled = position === 0;
    $("#next").disabled = position === frames.length - 1;
    $("#play").disabled = position === frames.length - 1;
    if (position === frames.length - 1) stop();
  }
  function reset() {
    stop();
    frames = traces[$("#algorithm").value];
    position = 0;
    $("#algorithm-name").textContent = names[$("#algorithm").value];
    $("#timeline").max = frames.length - 1;
    for (const row of $("#comparison-table").rows)
      row.classList.toggle(
        "selected",
        row.dataset.algorithm === $("#algorithm").value,
      );
    show();
  }
  function setInput(values, isCustom = false) {
    stop();
    input = values.slice();
    $("#input-mode").textContent = isCustom
      ? `Current input: ${input.length} custom values. Changing pattern or size returns to generated values.`
      : `Current input: ${input.length} generated values.`;
    traces = Object.fromEntries(
      Object.keys(names).map((kind) => [kind, SortLab.trace(kind, input)]),
    );
    $("#input-description").textContent =
      (isCustom ? "Custom input" : "Generated input") +
      " · " +
      input.length +
      " values: " +
      input.join(", ");
    $("#comparison-table").replaceChildren(
      ...Object.entries(names).map(([kind, name]) => {
        const frame = traces[kind].at(-1),
          row = document.createElement("tr");
        row.dataset.algorithm = kind;
        const title = document.createElement("th");
        title.scope = "row";
        title.textContent = name;
        row.append(title);
        for (const value of [frame.comparisons, frame.swaps]) {
          const cell = document.createElement("td");
          cell.textContent = value;
          row.append(cell);
        }
        const action = document.createElement("td"),
          button = document.createElement("button");
        button.type = "button";
        button.className = "secondary";
        button.textContent = "Explore trace";
        button.setAttribute("aria-label", "Explore " + name + " trace");
        button.onclick = () => {
          $("#algorithm").value = kind;
          reset();
          $("#algorithm-name").focus();
        };
        action.append(button);
        row.append(action);
        return row;
      }),
    );
    $("#input-status").textContent =
      "Compared three traces on the same " +
      input.length +
      (isCustom ? " custom" : " generated") +
      " starting values.";
    reset();
  }
  function sample() {
    setInput(SortLab.sample($("#pattern").value, Number($("#size").value)));
  }
  $("#custom-form").onsubmit = (event) => {
    event.preventDefault();
    stop();
    try {
      const values = SortLab.parseInput($("#custom-values").value);
      $("#custom-error").hidden = true;
      setInput(values, true);
    } catch (error) {
      $("#custom-error").textContent =
        error.message + " The current trace is preserved.";
      $("#custom-error").hidden = false;
      $("#custom-error").focus();
    }
  };
  $("#next").onclick = () => {
    stop();
    position = Math.min(position + 1, frames.length - 1);
    show();
  };
  $("#previous").onclick = () => {
    stop();
    position = Math.max(0, position - 1);
    show();
  };
  $("#play").onclick = () => {
    if (timer) {
      stop();
      return;
    }
    $("#play").textContent = "Pause Ⅱ";
    timer = setInterval(
      () => {
        position = Math.min(position + 1, frames.length - 1);
        show();
      },
      Number($("#speed").value),
    );
  };
  $("#reset").onclick = reset;
  $("#timeline").oninput = (event) => {
    stop();
    position = Number(event.target.value);
    show();
  };
  $("#algorithm").onchange = reset;
  for (const id of ["pattern", "size"])
    $("#" + id).onchange = () => {
      $("#custom-error").hidden = true;
      sample();
    };
  $("#speed").onchange = stop;
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
  });
  sample();
})();
