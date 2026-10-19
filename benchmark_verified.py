"""Reproducible local benchmark; timings depend on the execution environment."""
import csv
import random
import statistics
import time
from bubble_sort import bubble_sort
from insertion_sort import insertion_sort
from selection_sort import selectionSort
from quick_sort import quickSort
from radix_sort import radixSort


def run():
    rng = random.Random(40)
    algorithms = {'Bubble': bubble_sort, 'Insertion': insertion_sort,
                  'Selection': selectionSort,
                  'Quick': lambda a: quickSort(a, 0, len(a)-1), 'Radix': radixSort}
    rows = []
    for size in [50, 100, 250, 500, 1000]:
        samples = [[rng.randrange(10000) for _ in range(size)] for _ in range(5)]
        for name, fn in algorithms.items():
            times = []
            for sample in samples:
                values = sample.copy()
                start = time.perf_counter()
                result = fn(values)
                elapsed = time.perf_counter() - start
                assert (result if result is not None else values) == sorted(sample), name
                times.append(elapsed * 1000)
            rows.append(dict(algorithm=name, size=size,
                             median_ms=statistics.median(times), repeats=5))
    with open('verified_timings.csv', 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=rows[0])
        writer.writeheader()
        writer.writerows(rows)


if __name__ == '__main__':
    run()
