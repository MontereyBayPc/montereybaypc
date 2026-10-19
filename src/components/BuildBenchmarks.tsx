import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
const cpuReferences: Record<string,{score:number;url:string}> = {
  starter: {score:11052,url:'https://www.hwcooling.net/wp-content/uploads/2023/11/intel-core-i7-14700k-g120.html'},
  mid: {score:19731,url:'https://www.hwcooling.net/wp-content/uploads/2023/11/intel-core-i7-14700k-g120.html'},
  'high-end': {score:33982,url:'https://www.hwcooling.net/wp-content/uploads/2023/11/intel-core-i7-14700k-g120.html'},
  extreme: {score:42103,url:'https://nanoreview.info/en/cpu/amd-ryzen-9-9950x'},
};
const games = ['Fortnite','Cyberpunk 2077','Call of Duty: Warzone','Valorant','Microsoft Flight Simulator'];
export default function BuildBenchmarks({slug,cpu}: {slug:string;cpu:string}) {
  const [resolution,setResolution] = useState('1080p');
  const reference = cpuReferences[slug];
  return <section className="mt-16 border-t border-border pt-10">
    <h2 className="font-heading text-3xl font-bold mb-6">Benchmarks</h2>
    <div className="grid sm:grid-cols-[1fr_auto] gap-3 border-b border-border pb-6 mb-8"><div><h3 className="font-heading font-semibold">Cinebench R23 / Multi-core</h3><p className="text-sm text-muted-foreground mt-2">{cpu}</p><p className="text-xs text-muted-foreground mt-2">CPU reference result, not a measurement of this complete build. Cooling and power settings affect your result.</p></div><div className="sm:text-right"><p className="font-heading text-3xl font-bold text-brand">{reference ? reference.score.toLocaleString() : 'N/A'}</p>{reference && <a className="text-xs underline text-muted-foreground" href={reference.url} target="_blank" rel="noreferrer">Reference source</a>}</div></div>
    <div className="flex flex-wrap justify-between items-center gap-4 mb-5"><h3 className="font-heading text-xl font-semibold">Game performance</h3><Tabs value={resolution} onValueChange={setResolution}><TabsList aria-label="Benchmark resolution">{['1080p','1440p','4K'].map(r=><TabsTrigger value={r} key={r}>{r}</TabsTrigger>)}</TabsList></Tabs></div>
    <p className="text-sm text-muted-foreground mb-6">Native resolution, Ultra preset, ray tracing off, no upscaling or frame generation. Verified complete-build averages are not available yet; N/A means unmeasured, not unsupported.</p>
    <div className="space-y-4" aria-live="polite">{games.map(game=><div key={game} className="grid grid-cols-[1fr_auto] gap-2"><span className="text-sm">{game}</span><span className="font-heading font-semibold text-muted-foreground">N/A</span><div className="col-span-2 h-2 rounded-full bg-muted" aria-label={`${game} ${resolution}: not measured`} /></div>)}</div>
  </section>;
}