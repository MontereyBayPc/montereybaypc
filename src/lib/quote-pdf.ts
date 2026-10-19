import { jsPDF } from 'jspdf';
import { BUSINESS } from './business';

export function exportQuotePdf(parts: { name: string; price: number; category: string }[], fee: number, notes: string[]) {
  const doc = new jsPDF();
  const margin = 18;
  let y = 23;
  const line = (text: string, size = 10) => {
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(text, 170);
    for (const item of lines) { if (y > 270) { doc.addPage(); y = 22; } doc.text(item, margin, y); y += size * 0.48 + 2; }
  };
  doc.setFont('helvetica','bold'); line('MONTEREY BAY PCs', 20);
  doc.setFont('helvetica','normal'); line('Custom build estimate', 14);
  line(`${BUSINESS.email} | ${BUSINESS.phone}`); line(`Prepared ${new Date().toLocaleDateString('en-US')}`); y += 8;
  parts.forEach(p => { doc.setFont('helvetica','bold'); line(`${p.category} - $${Number(p.price).toLocaleString('en-US')}`); doc.setFont('helvetica','normal'); line(p.name); y += 2; });
  y += 5; const subtotal = parts.reduce((sum,p) => sum + Number(p.price),0);
  line(`Parts: $${subtotal.toLocaleString('en-US')}`); line(`Assembly fee: $${fee.toLocaleString('en-US')}`);
  doc.setFont('helvetica','bold'); line(`Estimated total: $${(subtotal + fee).toLocaleString('en-US')}`, 14); doc.setFont('helvetica','normal');
  line('Estimate only, not an invoice. Tax and delivery excluded. Prices, stock, compatibility and final scope require technician confirmation.');
  notes.forEach(n => line(n));
  doc.save('Monterey-Bay-PCs-build-estimate.pdf');
}