import { Link } from "react-router-dom";
import { Phone, Wrench, MessageSquare } from "lucide-react";
import { BUSINESS } from "@/lib/business";

const SMS_HREF = "sms:+18317187730";

const MobileActionBar = () => (
  <>
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur border-t border-border p-3 flex gap-2 print:hidden">
      <a href={BUSINESS.phoneHref} className="flex-1 inline-flex items-center justify-center gap-2 border border-border rounded-full py-3 font-heading text-xs font-semibold uppercase tracking-widest text-foreground">
        <Phone className="w-4 h-4" /> Call
      </a>
      <a href={SMS_HREF} className="flex-1 inline-flex items-center justify-center gap-2 border border-border rounded-full py-3 font-heading text-xs font-semibold uppercase tracking-widest text-foreground">
        <MessageSquare className="w-4 h-4" /> Text
      </a>
      <Link to="/quote" className="flex-1 btn-brand justify-center !py-3 !text-xs">
        <Wrench className="w-4 h-4" /> Quote
      </Link>
    </div>
    <a
      href={SMS_HREF}
      className="hidden lg:inline-flex fixed bottom-6 right-6 z-40 items-center gap-2 btn-brand shadow-lg print:hidden"
      aria-label="Text an expert"
    >
      <MessageSquare className="w-4 h-4" /> Text an Expert
    </a>
  </>
);

export default MobileActionBar;
