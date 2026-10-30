import { boardRam, boardSocket, cpuSocket, minPsu, psuWatts, ramGen, RECOMMENDED, systemWatts } from './compat';
import { buildFee } from '../../supabase/functions/_shared/price-consensus';
export type BuilderPart = {id:string;category:string;name:string;price:number};
export function estimateBuild(parts: BuilderPart[], selection: Record<string,string>, extras: string[]) {
  const ids = [...Object.values(selection),...extras];
  const subtotal = ids.reduce((s,id)=>s+Number(parts.find(p=>p.id===id)?.price ?? 0),0);
  return subtotal + buildFee(subtotal);
}
export function optimizeBuild(parts: BuilderPart[], selection: Record<string,string>, extras: string[], budget: number | null) {
  const next = {...selection};
  const get = (cat:string)=>parts.find(p=>p.id===next[cat]);
  // Preserve the customer's CPU and GPU; choose supporting parts only from known-compatible catalog options.
  for (const category of ['motherboard','ram','psu']) {
    if(next[category]==='none')continue;
    const cpu=get('cpu'), gpu=get('gpu'), board=get('motherboard');
    const candidates=parts.filter(p=>p.category===category).filter(p=>{
      if(category==='motherboard')return !!cpu && !!cpuSocket(cpu.name) && boardSocket(p.name)===cpuSocket(cpu.name);
      if(category==='ram')return !!board && !!boardRam(board.name) && ramGen(p.name)===boardRam(board.name);
      return !!cpu && !!gpu && (psuWatts(p.name) ?? 0)>=minPsu(systemWatts(cpu.name,gpu.name));
    }).sort((a,b)=> Number(RECOMMENDED.includes(b.name))-Number(RECOMMENDED.includes(a.name)) || a.price-b.price);
    const candidate=candidates.find(p=>budget===null || estimateBuild(parts,{...next,[category]:p.id},extras)<=budget);
    if(candidate)next[category]=candidate.id;
  }
  return next;
}
