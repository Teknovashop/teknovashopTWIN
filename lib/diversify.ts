export type Item = { id: string; tags?: string[]; brand?: string; title: string }
function jaccard(a: string[] = [], b: string[] = []) { const A=new Set(a.map(x=>x.toLowerCase())), B=new Set(b.map(x=>x.toLowerCase())); const inter=[...A].filter(x=>B.has(x)).length; const uni=new Set([...A,...B]).size; return uni?inter/uni:0 }
function seeded(seed = Date.now()){ let s=(seed>>>0)||1; return ()=> (s=(s*1664525+1013904223)>>>0, (s&0xffff)/0x10000) }
export function diversify<T extends Item>(candidates: Array<{ item: T; score: number }>, k=3, lambda=0.75, epsilon=0.15, seed?: number): T[] {
  let rng=seeded(seed); const pool=[...candidates]; const picked:T[]=[]; const randomSlots=Math.max(0, Math.round(k*epsilon));
  while(picked.length<k && pool.length){
    if(picked.length<randomSlots){ const total=pool.reduce((s,x)=>s+Math.max(1e-6,x.score),0); let r=rng()*total; let idx=0; for(let i=0;i<pool.length;i++){ r-=Math.max(1e-6,pool[i].score); if(r<=0){ idx=i; break } } picked.push(pool.splice(idx,1)[0].item); continue }
    let bestIdx=0, bestVal=-Infinity; for(let i=0;i<pool.length;i++){ const {item,score}=pool[i]; const sim=picked.length? Math.max(...picked.map(p=> jaccard(p.tags||[], item.tags||[]) ))*0.7 + (picked.some(p=>p.brand && p.brand===item.brand)?0.3:0) : 0; const val=lambda*score - (1-lambda)*sim; if(val>bestVal){ bestVal=val; bestIdx=i } }
    picked.push(pool.splice(bestIdx,1)[0].item)
  }
  return picked
}
