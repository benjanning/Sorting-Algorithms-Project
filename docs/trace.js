(function(root){'use strict';
function trace(kind,input){
 if(!['bubble','selection','quick'].includes(kind)||!Array.isArray(input)||input.length>24||input.some(v=>!Number.isInteger(v)||v<0||v>99))throw Error('Choose a supported algorithm and at most 24 integers from 0 to 99.');
 const a=input.slice(),frames=[];let comparisons=0,swaps=0;
 const record=(note,active=[])=>frames.push({values:a.slice(),active:active.slice(),comparisons,swaps,note});
 const exchange=(i,j,note)=>{if(i!==j){[a[i],a[j]]=[a[j],a[i]];swaps++;}record(note,[i,j]);};
 record('The same starting values. Step through the actual comparisons and exchanges.');
 if(kind==='bubble')for(let i=0;i<a.length-1;i++){let moved=false;for(let j=0;j<a.length-i-1;j++){comparisons++;record('Compare adjacent values '+a[j]+' and '+a[j+1]+'.',[j,j+1]);if(a[j]>a[j+1]){exchange(j,j+1,'Swap the adjacent values into ascending order.');moved=true;}}if(!moved){record('No swaps in this pass: the remaining values are already ordered.');break;}}
 if(kind==='selection')for(let i=0;i<a.length;i++){let minimum=i;for(let j=i+1;j<a.length;j++){comparisons++;record('Compare the current minimum '+a[minimum]+' with '+a[j]+'.',[minimum,j]);if(a[j]<a[minimum])minimum=j;}exchange(i,minimum,minimum===i?'The minimum is already in its final position.':'Place the remaining minimum at position '+(i+1)+'.');}
 if(kind==='quick'){
  function sort(low,high){if(low>=high)return;const pivot=a[high];let i=low-1;record('Use the rightmost value '+pivot+' as pivot.',[high]);for(let j=low;j<high;j++){comparisons++;record('Compare '+a[j]+' with pivot '+pivot+'.',[j,high]);if(a[j]<pivot){i++;exchange(i,j,'Move a smaller value to the left partition.');}}exchange(i+1,high,'Place the pivot between the two partitions.');sort(low,i);sort(i+2,high);}
  sort(0,a.length-1);
 }
 record('Complete. The values are in ascending order.');return frames;
}
function sample(pattern,n=12){let a=Array.from({length:n},(_,i)=>pattern==='duplicates'?10+(i%5)*15:Math.round(10+i*80/Math.max(n-1,1)));if(pattern==='reversed')a.reverse();if(pattern==='random'||pattern==='duplicates'){let seed=40;for(let i=a.length-1;i>0;i--){seed=(1664525*seed+1013904223)>>>0;const j=seed%(i+1);[a[i],a[j]]=[a[j],a[i]];}}return a;}
const api={trace,sample};if(typeof module!=='undefined')module.exports=api;else root.SortLab=api;
})(typeof window!=='undefined'?window:globalThis);
