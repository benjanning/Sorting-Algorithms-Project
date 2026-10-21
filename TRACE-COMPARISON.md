# Same starting values, inspectable work

The comparison table is derived from the final frames of the same instrumented traces used by playback. It shows complete key-comparison and index-swap totals for bubble, selection and rightmost-pivot quicksort. In-progress counters remain explicitly labelled "so far". None of these counts measures elapsed time or stands in for the separate five-implementation Python benchmark.

## Input and state

One current input is copied into all three trace builders and their immutable frame histories are cached. Algorithm selection, Explore trace and Reset choose from those histories without generating new values. Pattern or size changes deliberately replace the input with the existing deterministic sample. Custom values replace the input for all three traces, preserve duplicates/zeros, and are shown explicitly beside the controls and above the table. The typed custom example remains available if a visitor returns to generated values.

The custom parser accepts 1–24 canonical whole numbers from 0 to 99, separated by spaces or commas. It rejects empty/missing values, repeated comma delimiters, signs, fractions, exponent syntax, leading zeros, unsupported values and overlong arrays. An error stops playback, preserves the input/trace and moves focus to a useful message. The lower-level trace API still supports empty arrays for the preserved Python parity fixtures.

All steps and algorithms for a given input share the same bar scale. A minimal visible height keeps zero values inspectable; labels and the accessible bar description contain the exact numbers. Dense 24-value layouts have sufficient spacing for labels and no page overflow. The table has a labelled horizontal-scroll region on narrow screens. Native selection and timeline controls, step descriptions, focus indication and user-controlled playback remain available; no autoplay is introduced.

## What the counts mean

Key comparisons count tests between data values, not loop bounds or other control-flow checks. An index swap exchanges two different positions; it can exchange equal values, which may leave the visible number sequence unchanged. Self placements remain visible in the trace but are not counted as index-changing swaps.

For the independently known reversed input `[3, 2, 1]`, bubble uses three comparisons/three swaps, selection three/one, and this rightmost-pivot quicksort three/one. On `[1, 1, 1]`, quicksort makes three comparisons/two different-index exchanges. These are facts about the illustrated implementations and those inputs, not universal complexity constants or a speed ranking.

Seven Python regressions preserve original correctness checks and validate measurement aggregation/cache provenance. Five Node checks retain actual-Python output parity and multiset preservation at every frame, known counts and strict custom parsing. Three browser journeys retain playback/completion/mobile behavior and check every table row against its selected trace, custom duplicates, invalid-input recovery, same-input reset, native controls and the 24-value mobile boundary. Genuine screenshots are retained by the existing release workflow before source export and Pages publication.

The five Python implementation files, recorded timing CSVs and measurement metadata are unchanged. Their existing normalized algorithm/output hashes continue to reuse verified observations. Source CI still verifies those hashes; no fresh benchmark experiment is claimed by this frontend improvement. Original coursework and historical figures remain intact.
