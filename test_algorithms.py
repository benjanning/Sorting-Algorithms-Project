"""Regression tests for the five educational sorting implementations."""
import random
import unittest

from bubble_sort import bubble_sort
from selection_sort import selectionSort
from insertion_sort import insertion_sort
from quick_sort import quickSort
from radix_sort import radixSort


class SortingAlgorithmsTests(unittest.TestCase):
    def check_comparison_sorts(self, values):
        expected = sorted(values)
        for algorithm in (bubble_sort, selectionSort, insertion_sort):
            with self.subTest(algorithm=algorithm.__name__, values=values):
                result = values.copy()
                algorithm(result)
                self.assertEqual(result, expected)

        with self.subTest(algorithm="quickSort", values=values):
            result = values.copy()
            quickSort(result, 0, len(result) - 1)
            self.assertEqual(result, expected)

    def test_known_cases(self):
        for values in ([], [1], [4, 1, 3, 1, 2], [5, 4, 3, 2, 1], [-8, 0, 8, -1, 7]):
            self.check_comparison_sorts(values)

    def test_random_cases(self):
        rng = random.Random(42)
        for length in range(0, 15):
            self.check_comparison_sorts([rng.randint(-100, 100) for _ in range(length)])

    def test_radix_sort(self):
        for values in ([], [0], [200, 1, 20, 10, 200, 0], [9, 8, 7, 6, 5]):
            with self.subTest(values=values):
                self.assertEqual(radixSort(values.copy()), sorted(values))

    def test_radix_rejects_negative(self):
        with self.assertRaises(ValueError):
            radixSort([-1, 4])


if __name__ == "__main__":
    unittest.main()
