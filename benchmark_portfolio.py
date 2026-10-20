"""Cacheable genuine measurements; preserve the V1 verified_timings.csv separately."""
from pathlib import Path
import csv,json,hashlib,platform,random,time,statistics,sys
from bubble_sort import bubble_sort
from insertion_sort import insertion_sort
from selection_sort import selectionSort
from quick_sort import quickSort
from radix_sort import radixSort
ROOT=Path(__file__).resolve().parent
FILES=['bubble_sort.py','insertion_sort.py','selection_sort.py','quick_sort.py','radix_sort.py']
def digest(path):return hashlib.sha256(path.read_bytes().replace(b'\r\n',b'\n')).hexdigest()
def algorithm_hashes():return {name:digest(ROOT/name) for name in FILES}
def measure(force=False):
    out=ROOT/'results';out.mkdir(exist_ok=True);meta=out/'benchmark-methodology.json';hashes=algorithm_hashes()
    if meta.exists() and not force:
        old=json.loads(meta.read_text())
        if old['algorithm_hashes']==hashes and all((out/name).exists() and digest(out/name)==sha for name,sha in old['output_hashes'].items()):
            print('Reusing verified measurements for unchanged algorithm implementations.');return False
    rng=random.Random(40);raw=[];summary=[]
    algorithms={'Bubble':bubble_sort,'Insertion':insertion_sort,'Selection':selectionSort,'Quick':lambda a:quickSort(a,0,len(a)-1),'Radix':radixSort}
    for size in [50,100,250,500,1000]:
        samples=[[rng.randrange(10000) for _ in range(size)] for _ in range(5)]
        for name,algorithm in algorithms.items():
            times=[]
            for repeat,sample in enumerate(samples,1):
                values=sample.copy();start=time.perf_counter();result=algorithm(values);elapsed=(time.perf_counter()-start)*1000
                if (result if result is not None else values)!=sorted(sample):raise AssertionError('Incorrect measured output: '+name)
                times.append(elapsed);raw.append(dict(algorithm=name,size=size,repeat=repeat,ms=elapsed))
            q=statistics.quantiles(times,n=4,method='inclusive')
            summary.append(dict(algorithm=name,size=size,repeats=5,median_ms=statistics.median(times),q25_ms=q[0],q75_ms=q[2]))
    for name,rows in [('raw-timings.csv',raw),('timings.csv',summary)]:
        with (out/name).open('w',newline='',encoding='utf-8') as f:writer=csv.DictWriter(f,fieldnames=rows[0]);writer.writeheader();writer.writerows(rows)
    evidence=dict(algorithm_hashes=hashes,hash_format='SHA-256 of UTF-8 text with LF line endings; platform line endings do not change the measured algorithm',seed=40,sizes=[50,100,250,500,1000],repeats=5,total_verified_sorts=len(raw),input='Identical seeded non-negative integer samples per size for every algorithm',timer='perf_counter; copies and correctness checks excluded from timing',python=platform.python_version(),platform=platform.platform(),processor=platform.processor(),output_hashes={name:digest(out/name) for name in ['raw-timings.csv','timings.csv']},limits='Single execution environment; five samples per size; IQR is observed variability, not a confidence interval. Browser animation timings are not benchmark results.')
    meta.write_text(json.dumps(evidence,indent=2)+'\n',encoding='utf-8');print('Measured and verified',len(raw),'sorts.');return True
if __name__=='__main__':measure(force='--refresh' in sys.argv)
