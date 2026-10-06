import { Link } from "react-router-dom";
import { Phone, Wrench } from "lucide-react";
import { BUSINESS } from "@/lib/business";

const MobileActionBar = () => (
  <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur border-t border-border p-3 flex gap-3">
    <a href={BUSINESS.phoneHref} className="flex-1 inline-flex items-center justify-center gap-2 border border-border rounded-full py-3 font-heading text-xs font-semibold uppercase tracking-widest text-foreground">
      <Phone className="w-4 h-4" /> Call
    </a>
    <Link to="/quote" className="flex-1 btn-brand justify-center !py-3 !text-xs">
      <Wrench className="w-4 h-4" /> Configure Build
    </Link>
  </div>
);

export default MobileActionBar;
