import unittest,csv,json,statistics
from collections import defaultdict
from benchmark_portfolio import ROOT,digest,algorithm_hashes,measure
from radix_sort import radixSort
class BenchmarkTests(unittest.TestCase):
    def test_raw_results_reconcile_with_summary(self):
        out=ROOT/'results';groups=defaultdict(list)
        with (out/'raw-timings.csv').open(encoding='utf-8') as f:raw=list(csv.DictReader(f))
        with (out/'timings.csv').open(encoding='utf-8') as f:summary=list(csv.DictReader(f))
        self.assertEqual(len(raw),125);self.assertEqual(len(summary),25)
        for row in raw:groups[(row['algorithm'],row['size'])].append(float(row['ms']))
        for row in summary:
            values=groups[(row['algorithm'],row['size'])];self.assertEqual(len(values),5);self.assertAlmostEqual(statistics.median(values),float(row['median_ms']))
            self.assertTrue(all(v>0 for v in values));self.assertLessEqual(float(row['q25_ms']),float(row['median_ms']));self.assertLessEqual(float(row['median_ms']),float(row['q75_ms']))
    def test_measurements_match_current_code_and_reuse_cache(self):
        out=ROOT/'results';meta=json.loads((out/'benchmark-methodology.json').read_text());self.assertEqual(meta['algorithm_hashes'],algorithm_hashes())
        for name,sha in meta['output_hashes'].items():self.assertEqual(digest(out/name),sha)
        self.assertFalse(measure())
    def test_radix_domain_excludes_booleans_and_fractions(self):
        for values in [[True,2],[1.5,2],[-1,2]]:
            with self.assertRaises(ValueError):radixSort(values)
if __name__=='__main__':unittest.main()
