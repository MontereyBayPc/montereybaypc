import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Package, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
type Shipment = { status: string; step: number; details: string; eta: string | null; test: boolean; checked_at: string; points: { coords: [number, number]; city: string; date: string }[]; events: { status: string; date: string; details: string; city: string | null }[] };
const stages = ['Label created', 'In transit', 'Out for delivery', 'Delivered'];
export default function ShipmentProgress({ token }: { token: string }) {
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);
  const carrierLink = `/build/${token}`;
  useEffect(() => {
    let active = true;
    const load = async () => {
      const { data, error: failure } = await supabase.functions.invoke('get-shipment-progress', { body: { token } });
      if (!active) return;
      setLoading(false);
      if (failure || data?.error) setError('Carrier updates are temporarily unavailable. Use your carrier tracking link for the latest status.');
      else { setShipment(data.shipment); setError(''); }
    };
    void load();
    const timer = setInterval(() => { if (!document.hidden) void load(); }, 300000);
    return () => { active = false; clearInterval(timer); };
  }, [token, refresh]);
  if (!loading && !error && !shipment) return null;
  return <section className="mt-10 border-y border-border py-8">
    <div className="flex justify-between items-center gap-3"><h2 className="font-heading text-2xl font-semibold flex items-center gap-3"><Package className="text-brand" />Shipment progress</h2><Button variant="outline" size="icon" aria-label="Refresh shipment" title="Refresh shipment" onClick={() => setRefresh(value => value + 1)}><RefreshCw className="w-4 h-4" /></Button></div>
    {loading && <p className="text-muted-foreground mt-4">Checking carrier scans...</p>}
    {error && <p role="status" className="text-muted-foreground mt-4">{error} <a href={carrierLink} className="underline">Open your build tracker and carrier link</a>.</p>}
    {shipment && <>
      {shipment.test && <p className="text-brand text-sm mt-4">Shippo test tracking, not a real parcel.</p>}
      <p className="mt-4 text-foreground">{shipment.details}</p>
      {['FAILURE', 'RETURNED'].includes(shipment.status) && <p className="text-destructive mt-2">{shipment.status === 'RETURNED' ? 'Returned to sender' : 'Delivery exception'}: contact us for help.</p>}
      <ol className="grid grid-cols-4 gap-2 mt-6" aria-label="Package delivery progress">{stages.map((stage, index) => <li key={stage} aria-current={index === shipment.step ? 'step' : undefined} className="min-w-0"><div className={`h-1.5 rounded-full mb-3 ${index <= shipment.step ? 'bg-brand' : 'bg-muted'}`} /><span className={`text-xs sm:text-sm ${index <= shipment.step ? 'text-foreground' : 'text-muted-foreground'}`}>{stage}</span></li>)}</ol>
      {shipment.eta && shipment.status !== 'DELIVERED' && <p className="text-sm text-muted-foreground mt-5">Carrier estimated delivery: {new Date(shipment.eta).toLocaleDateString()}. Estimates may change.</p>}
      <h3 className="font-heading text-lg mt-8 mb-3">Carrier route map</h3>
      {shipment.points.length ? <div className="h-[320px] sm:h-[400px] relative isolate overflow-hidden rounded-md border border-border service-map"><MapContainer key={JSON.stringify(shipment.points)} center={shipment.points[0].coords} zoom={6} bounds={shipment.points.length > 1 ? shipment.points.map(point => point.coords) : undefined} boundsOptions={{ padding: [35, 35], maxZoom: 9 }} scrollWheelZoom={false} className="h-full w-full"><TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />{shipment.points.length > 1 && <Polyline positions={shipment.points.map(point => point.coords)} pathOptions={{ className: 'delivery-radius' }} />}{shipment.points.map((point, index) => <CircleMarker key={index} center={point.coords} radius={7} pathOptions={{ className: 'delivery-town' }}><Popup>{point.city}<br />{point.date && new Date(point.date).toLocaleString()}</Popup></CircleMarker>)}</MapContainer></div> : <div className="border border-border rounded-md p-8 text-muted-foreground">No mapped carrier scans yet. The route will appear when the carrier reports scan locations.</div>}
      <p className="text-xs text-muted-foreground mt-3">Scan-city locations only, not live GPS. Lines connect reported scans and do not represent the exact travel route.</p>
      <ol className="mt-6 divide-y divide-border">{shipment.events.map((event, index) => <li key={index} className="py-4"><p className="text-sm text-foreground">{event.details}</p><p className="text-xs text-muted-foreground mt-1">{event.city}{event.city && event.date ? ' · ' : ''}{event.date && new Date(event.date).toLocaleString()}</p></li>)}</ol>
      <p className="text-xs text-muted-foreground mt-4">Carrier checked {new Date(shipment.checked_at).toLocaleString()}. Updates refresh every five minutes.</p>
    </>}
  </section>;
}