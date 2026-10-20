from pathlib import Path
import json,pandas as pd,numpy as np
import matplotlib;matplotlib.use('Agg')
import matplotlib.pyplot as plt
root=Path(__file__).resolve().parent;out=root/'results';data=pd.read_csv(out/'timings.csv');meta=json.loads((out/'benchmark-methodology.json').read_text())
plt.rcParams.update({'figure.facecolor':'#f5f5ed','axes.facecolor':'#f5f5ed','font.family':'DejaVu Sans','font.size':11,'axes.spines.right':False,'axes.spines.top':False,'text.color':'#214b3b','axes.labelcolor':'#214b3b','xtick.color':'#536c5b','ytick.color':'#536c5b'})
fig,ax=plt.subplots(figsize=(10.5,6))
for (name,sub),color in zip(data.groupby('algorithm'),['#a87840','#6b9574','#31614a','#7690ad','#a05d53']):
    ax.plot(sub['size'],sub.median_ms,label=name,color=color,marker='o',linewidth=2);ax.fill_between(sub['size'],sub.q25_ms,sub.q75_ms,color=color,alpha=.12)
ax.set(xlabel='Number of non-negative integers',ylabel='Median runtime (ms · logarithmic scale)',yscale='log',title='Five algorithms. The same measured workload.');ax.grid(axis='y',alpha=.15);ax.legend(frameon=False,ncol=3,fontsize=10);fig.text(.13,.015,'Five identical seeded samples per size. Bands show observed IQR, not confidence intervals. Runtime depends on hardware and workload.',fontsize=8,color='#6a7566');fig.tight_layout(rect=(0,.05,1,1));fig.savefig(out/'benchmark.png',dpi=160,bbox_inches='tight');plt.close(fig)
fig,ax=plt.subplots(figsize=(10.5,5.7));largest=data[data['size']==1000].sort_values('median_ms');positions=np.arange(len(largest))
ax.barh(positions,largest.median_ms,color=['#658a67','#86a687','#a9bc99','#c9bd8b','#b18957'],height=.58)
for pos,row in enumerate(largest.itertuples()):ax.text(row.median_ms+max(largest.median_ms)*.015,pos,f'{row.median_ms:.3f} ms',va='center',fontsize=10,color='#596e55')
ax.set(yticks=positions,yticklabels=largest.algorithm,xlabel='Median runtime (ms · linear scale)',xlim=(0,max(largest.median_ms)*1.25),title='At 1,000 values, the implementation choices become visible.');ax.invert_yaxis();fig.text(.14,.015,'One measured environment, five random inputs. This ordering is not a universal ranking across inputs or language implementations.',fontsize=8,color='#6a7566');fig.tight_layout(rect=(0,.05,1,1));fig.savefig(out/'comparison.png',dpi=160,bbox_inches='tight');plt.close(fig)
summary=f"Five Python implementations passed correctness checks on {meta['total_verified_sorts']} measured sorts: five identical seeded random samples at each size from 50 to 1,000. Median and IQR are calculated from saved raw measurements. Measurements were recorded on {meta['platform']} with Python {meta['python']}; unchanged algorithm hashes reuse those observations. The browser explorer illustrates operations separately and its animation speed is not a performance measurement."
(out/'portfolio-summary.txt').write_text(summary+'\n',encoding='utf-8')
print('Benchmark figures regenerated from traceable saved observations.')
