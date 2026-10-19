import { useState } from 'react';
import { jsPDF } from 'jspdf';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { AGREEMENT_VERSION, SERVICE_TERMS } from '@/lib/service-agreement';
import { Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
export default function ServiceAgreementForm() {
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [hardware,setHardware] = useState('');
  const [work,setWork] = useState('');
  const [checked,setChecked] = useState<string[]>([]);
  const [created,setCreated] = useState(false);
  const [sending,setSending] = useState(false);
  const [receipt,setReceipt] = useState<{id:string;accepted_at:string}|null>(null);
  const download = async (event: React.FormEvent) => {
    event.preventDefault(); if (checked.length !== SERVICE_TERMS.length || !name.trim() || !hardware.trim() || !work.trim()) return;
    setSending(true);
    const {data,error}=await supabase.functions.invoke('submit-work-order',{body:{name:name.trim(),email:email.trim(),hardware:hardware.trim(),work:work.trim(),version:AGREEMENT_VERSION,acknowledgments:['scope','data','property','rma','consent']}});
    setSending(false);
    if(error || data?.error){toast.error('Could not save your acknowledgment. Please call (831) 718-7730.');return;}
    setReceipt(data);
    const pdf = new jsPDF(); let y = 20;
    const line = (text: string,size=10) => { pdf.setFontSize(size); for (const row of pdf.splitTextToSize(text,174)) { if (y > 276) { pdf.addPage(); y=20; } pdf.text(row,18,y); y += 6; } y+=3; };
    line('MONTEREY BAY PCs - Service work order',16); line(`Terms version ${AGREEMENT_VERSION}`); line(`Customer: ${name.trim()} | ${email.trim()}`); line(`Hardware: ${hardware.trim()}`); line(`Requested work: ${work.trim()}`);
    SERVICE_TERMS.forEach(t => { line(t.title,12); line(t.text); });
    line(`Acknowledged by typed name: ${name.trim()}`); line(`Acknowledged at: ${data.accepted_at}`); line(`Work order reference: ${data.id}`); line('Acknowledgment saved to Monterey Bay PCs. Agreed price, scope and technician countersignature must be completed before work.'); line('Agreed price: ____________________'); line('Technician signature/date: ____________________');
    pdf.save('Monterey-Bay-PCs-service-work-order.pdf'); setCreated(true);
  };
  return <section className="border-t border-border pt-8"><h2 className="font-heading text-2xl font-semibold mb-4">Prepare your work order</h2><p className="text-sm text-muted-foreground mb-6">Submit your acknowledgment to Monterey Bay PCs and download your copy. We confirm the final scope, price and drop-off time separately.</p>
    <form onSubmit={download} className="grid gap-5"><label className="grid gap-2 text-sm">Legal name<Input required maxLength={100} value={name} onChange={e=>setName(e.target.value)} /></label><label className="grid gap-2 text-sm">Email<Input required type="email" maxLength={255} value={email} onChange={e=>setEmail(e.target.value)} /></label><label className="grid gap-2 text-sm">Hardware and serial number, if available<Input required maxLength={500} value={hardware} onChange={e=>setHardware(e.target.value)} /></label><label className="grid gap-2 text-sm">Requested service<Textarea required maxLength={1000} value={work} onChange={e=>setWork(e.target.value)} /></label>
      {SERVICE_TERMS.map((term,i) => <label key={term.title} className="flex items-start gap-3 text-sm"><Checkbox id={`term-${i}`} checked={checked.includes(term.title)} onCheckedChange={on => setChecked(current => on ? [...current,term.title] : current.filter(t=>t!==term.title))} className="mt-0.5" /><span>I have read and acknowledge: {term.title.toLowerCase()}.</span></label>)}
      <Button type="submit" disabled={sending || checked.length !== SERVICE_TERMS.length} className="w-fit max-w-full h-auto whitespace-normal rounded-full"><Download />{sending?'Submitting...':'Submit & download work order'}</Button>
      {created && <p role="status" className="text-sm text-brand break-all">Acknowledgment received. Your reference is {receipt?.id}. Bring your downloaded copy to drop-off.</p>}
    </form></section>;
}