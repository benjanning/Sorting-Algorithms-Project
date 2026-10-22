# Original items and equal-value order

Sorted numbers such as `1, 2, 2` cannot tell us whether the two 2s changed places. Stability requires preserving equal-item relative order for every supported input. The table reports only the current example.

Each trace starts with identities 0 through n-1 and copies them into every frame. Real exchanges swap identity and value together; self placements change neither. Every frame must contain the original identity permutation, with input[identity[i]] equal to its value. Historical snapshots remain independent. UI # labels add one to show readable starting positions, rather than values, current ranks or counts.

The pure equal-order helper validates the permutation and compares each repeated-value subsequence with its original order. The disclosure reports this at the current step; the shared table reports each algorithm's final result on the same input.

Known examples:

- Selection on `2 (#1), 2 (#2), 1 (#3)` moves the minimum to the front and finishes with 2s #2 then #1.
- Rightmost-pivot quicksort on `2 (#1), 1 (#2), 2 (#3)` finishes with 2s #3 then #1.
- Bubble's strict adjacent swaps preserve equal-item order: equal items cannot cross without being exchanged as neighbours.
- Selection and quicksort can preserve order on other examples. Preserved once is not proof of general stability.

Enabling markers pauses playback but preserves the step and input. Labels use at least a 10px font and enough width for #24. Dense charts scroll within their own focusable region, including keyboard use; the page does not overflow. The accessible chart name includes values and starting positions, and the disclosure provides exact sequences without relying on colour.

Eight Node checks include every-frame identity/value reconciliation on actual Python fixture inputs, independent snapshots, known reversals and invalid-identity rejection. Five browser journeys include exact selection/quick reversals, bubble preservation, labels and evidence, retained steps, no-repeat cases, readable 24-item labels and keyboard scrolling at 390px. Seven Python checks preserve correctness and benchmark-cache provenance.

These are instrumented JavaScript ports of three approaches. All five Python implementations, their hashes and recorded timings are unchanged. Operation counts and playback pace are not measured runtime. The existing source release/export and central review pipeline publishes genuine screenshots after checks pass.
