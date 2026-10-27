import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { FPS_PRESETS, simulatedFps } from '@/lib/operations';
const cpuReferences: Record<string,{score:number;url:string}> = {
  starter: {score:11052,url:'https://www.hwcooling.net/wp-content/uploads/2023/11/intel-core-i7-14700k-g120.html'},
  mid: {score:19731,url:'https://www.hwcooling.net/wp-content/uploads/2023/11/intel-core-i7-14700k-g120.html'},
  'high-end': {score:33982,url:'https://www.hwcooling.net/wp-content/uploads/2023/11/intel-core-i7-14700k-g120.html'},
  extreme: {score:42103,url:'https://nanoreview.info/en/cpu/amd-ryzen-9-9950x'},
};
export default function BuildBenchmarks({slug,cpu,resolution='',games=[]}: {slug:string;cpu:string;resolution?:string;games?:{name:string;fps:string|number}[]}) {
  const [preset,setPreset]=useState(resolution.includes('4K')?2:resolution.includes('1440')?1:0);
  const shown=games.map(g=>({...g,value:simulatedFps(g.fps,resolution,preset,g.name)}));
  const max=Math.max(...shown.map(g=>g.value ?? 0),1);
  const reference = cpuReferences[slug];
  return <section className="mt-16 border-t border-border pt-10">
    <h2 className="font-heading text-3xl font-bold mb-6">Benchmarks</h2>
    <div className="grid sm:grid-cols-[1fr_auto] gap-3 border-b border-border pb-6 mb-8"><div><h3 className="font-heading font-semibold">Cinebench R23 / Multi-core</h3><p className="text-sm text-muted-foreground mt-2">{cpu}</p><p className="text-xs text-muted-foreground mt-2">CPU reference result, not a measurement of this complete build. Cooling and power settings affect your result.</p></div><div className="sm:text-right"><p className="font-heading text-3xl font-bold text-brand">{reference ? reference.score.toLocaleString() : 'N/A'}</p>{reference && <a className="text-xs underline text-muted-foreground" href={reference.url} target="_blank" rel="noreferrer">Reference source</a>}</div></div>
    {games.length>0 && <>
    <div className="flex flex-wrap justify-between items-center gap-4 mb-5"><h3 className="font-heading text-xl font-semibold">Game performance</h3><span className="font-heading text-xs uppercase text-brand">{FPS_PRESETS[preset]}</span></div>
    <Slider aria-label="Game FPS preset" min={0} max={2} step={1} value={[preset]} onValueChange={v=>setPreset(v[0])} className="mb-4 max-w-lg" />
    <div className="flex justify-between text-xs text-muted-foreground max-w-lg gap-2 mb-6">{FPS_PRESETS.map(p=><span key={p}>{p}</span>)}</div>
    <p className="text-sm text-muted-foreground mb-6">Simulated FPS, not measurements of this PC. Resolution and quality scaling are approximate; game updates, CPU limits, drivers and upscaling affect results. No frame generation assumed.</p>
    <div className="space-y-4">{shown.map(g=><div key={g.name} className="grid grid-cols-[1fr_auto] gap-2"><span className="text-sm">{g.name}</span><span className="font-heading font-bold text-brand">{g.value===null?'N/A':`~${g.value} FPS`}</span><progress aria-label={`${g.name} simulated FPS`} value={g.value ?? 0} max={max} className="col-span-2 w-full h-2 accent-brand" /></div>)}</div></>}
  </section>;
}