"""Compare browser ports with actual Python implementation outputs."""
from pathlib import Path
import sys,json,random
ROOT=Path(__file__).resolve().parents[1];sys.path.insert(0,str(ROOT))
from bubble_sort import bubble_sort
from selection_sort import selectionSort
from quick_sort import quickSort
rng=random.Random(40);inputs=[[],[1],[2,1],[3,2,1],[1,2,3],[4,1,4,0,1]]+[[rng.randrange(100) for _ in range(n)] for n in range(2,25)]
cases=[]
for values in inputs:
    outputs={}
    for name,fn in [('bubble',bubble_sort),('selection',selectionSort),('quick',lambda a:quickSort(a,0,len(a)-1))]:
        a=values.copy();result=fn(a);outputs[name]=result if result is not None else a
    cases.append(dict(input=values,outputs=outputs))
(ROOT/'verification').mkdir(exist_ok=True);(ROOT/'verification/python-fixtures.json').write_text(json.dumps(cases,indent=2)+'\n',encoding='utf-8')
