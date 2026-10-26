const cpuReferences: Record<string,{score:number;url:string}> = {
  starter: {score:11052,url:'https://www.hwcooling.net/wp-content/uploads/2023/11/intel-core-i7-14700k-g120.html'},
  mid: {score:19731,url:'https://www.hwcooling.net/wp-content/uploads/2023/11/intel-core-i7-14700k-g120.html'},
  'high-end': {score:33982,url:'https://www.hwcooling.net/wp-content/uploads/2023/11/intel-core-i7-14700k-g120.html'},
  extreme: {score:42103,url:'https://nanoreview.info/en/cpu/amd-ryzen-9-9950x'},
};
export default function BuildBenchmarks({slug,cpu,resolution,games}: {slug:string;cpu:string;resolution:string;games:{name:string;fps:string|number}[]}) {
  const num=(f:string|number)=>parseInt(String(f).replace(/\D/g,''))||0;
  const max=Math.max(...games.map(g=>Math.min(num(g.fps),240)),1);
  const reference = cpuReferences[slug];
  return <section className="mt-16 border-t border-border pt-10">
    <h2 className="font-heading text-3xl font-bold mb-6">Benchmarks</h2>
    <div className="grid sm:grid-cols-[1fr_auto] gap-3 border-b border-border pb-6 mb-8"><div><h3 className="font-heading font-semibold">Cinebench R23 / Multi-core</h3><p className="text-sm text-muted-foreground mt-2">{cpu}</p><p className="text-xs text-muted-foreground mt-2">CPU reference result, not a measurement of this complete build. Cooling and power settings affect your result.</p></div><div className="sm:text-right"><p className="font-heading text-3xl font-bold text-brand">{reference ? reference.score.toLocaleString() : 'N/A'}</p>{reference && <a className="text-xs underline text-muted-foreground" href={reference.url} target="_blank" rel="noreferrer">Reference source</a>}</div></div>
    <div className="flex flex-wrap justify-between items-center gap-4 mb-5"><h3 className="font-heading text-xl font-semibold">Game performance</h3><span className="font-heading text-xs uppercase tracking-widest text-muted-foreground">{resolution}</span></div>
    <p className="text-sm text-muted-foreground mb-6">Average FPS at {resolution} from published benchmarks for this CPU and GPU combo. Results vary with game updates, drivers and settings.</p>
    <div className="space-y-4">{games.map(g=><div key={g.name} className="grid grid-cols-[1fr_auto] gap-2"><span className="text-sm">{g.name}</span><span className="font-heading font-bold text-brand">{g.fps}</span><div className="col-span-2 h-2 rounded-full bg-muted overflow-hidden"><div className="h-full bg-brand rounded-full" style={{width:`${Math.min(100,Math.min(num(g.fps),240)/max*100)}%`}} /></div></div>)}</div>
  </section>;
}