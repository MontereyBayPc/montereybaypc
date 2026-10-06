import { useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { formatPhone } from "@/lib/compat";
import { BUSINESS } from "@/lib/business";

type Props = {
  kind: string;
  messagePlaceholder: string;
  checklist?: string[];
  submitLabel?: string;
  successText?: string;
};

const LeadForm = ({ kind, messagePlaceholder, checklist, submitLabel = "Send", successText = "Got it. We will reply within 1 business day." }: Props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [checked, setChecked] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    const full = [checked.length ? `Checked: ${checked.join(", ")}` : "", message.trim()].filter(Boolean).join("\n\n");
    const { error } = await supabase.from("contact_inquiries").insert({
      kind,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || null,
      message: full.slice(0, 4000),
    });
    setSending(false);
    if (error) {
      toast.error(`Could not send. Please call ${BUSINESS.phone}.`);
      return;
    }
    setSent(true);
  };

  if (sent) return <div className="border border-brand rounded-2xl p-5 text-foreground">{successText}</div>;

  return (
    <form onSubmit={submit} className="grid gap-5">
      <Input required placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} />
      <Input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} />
      <Input type="tel" placeholder="Phone (optional)" value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} maxLength={20} />
      {checklist && (
        <fieldset className="grid sm:grid-cols-2 gap-2">
          {checklist.map((c) => (
            <label key={c} className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 accent-[hsl(var(--brand))]"
                checked={checked.includes(c)}
                onChange={(e) => setChecked((x) => (e.target.checked ? [...x, c] : x.filter((i) => i !== c)))}
              />
              {c}
            </label>
          ))}
        </fieldset>
      )}
      <Textarea required placeholder={messagePlaceholder} value={message} onChange={(e) => setMessage(e.target.value)} maxLength={2000} />
      <button type="submit" disabled={sending} className="btn-brand w-fit"><Send className="w-4 h-4" /> {sending ? "Sending..." : submitLabel}</button>
    </form>
  );
};

export default LeadForm;
