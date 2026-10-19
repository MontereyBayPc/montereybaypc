import { useState } from 'react';
import { MapContainer, TileLayer, Circle, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
const towns = [
  { name:'Monterey', lat:36.6002, lng:-121.8947 },
  { name:'Carmel', lat:36.5552, lng:-121.9233 },
  { name:'Pacific Grove', lat:36.6177, lng:-121.9166 },
  { name:'Seaside', lat:36.6111, lng:-121.8519 },
  { name:'Marina', lat:36.6844, lng:-121.8022 },
  { name:'Salinas', lat:36.6777, lng:-121.6555 },
];
function Focus({ town }: { town: typeof towns[number] }) { const map = useMap(); return <Button variant="outline" size="sm" className="absolute top-3 right-3 z-[1000] bg-background" onClick={() => map.flyTo([town.lat,town.lng],12)}>View {town.name}</Button>; }
export default function ServiceAreaMap() {
  const [selected,setSelected] = useState(towns[0]);
  return <section className="mb-12"><div className="flex flex-wrap gap-2 mb-4">{towns.map(t => <Button key={t.name} size="sm" variant={selected.name === t.name ? 'default' : 'outline'} onClick={() => setSelected(t)}>{t.name}</Button>)}</div>
    <div className="relative h-[360px] sm:h-[430px] overflow-hidden rounded-md border border-border isolate service-map"><MapContainer center={[36.63,-121.82]} zoom={10} scrollWheelZoom={false} className="h-full w-full">
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Circle center={[36.6002,-121.8947]} radius={48280.32} pathOptions={{className:'delivery-radius'}} />
      {towns.map(t => <CircleMarker key={t.name} center={[t.lat,t.lng]} radius={7} pathOptions={{className:'delivery-town'}}><Popup><strong>{t.name}</strong><br />Service-town center, not a pickup address.</Popup></CircleMarker>)}<Focus town={selected} />
    </MapContainer></div><p className="mt-4 text-sm text-muted-foreground">Approximate 30-mile radius from central Monterey, not a driving-distance guarantee. Local delivery $75, subject to address confirmation. Pickup is by arrangement only; we confirm the exact location privately.</p>
  </section>;
}