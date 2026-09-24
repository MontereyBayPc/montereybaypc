import { Link } from "react-router-dom";

export const LogoMark = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
    <rect x="1" y="1" width="30" height="30" rx="8" className="fill-foreground" />
    <path d="M7 22V10l5 7 5-7v12" className="stroke-background" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20 22c3-1 5-3.5 5-6.5" className="stroke-brand" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    <circle cx="25" cy="11" r="1.8" className="fill-brand" />
  </svg>
);

const Logo = () => (
  <Link to="/" aria-label="Monterey Bay PCs home" className="flex items-center gap-2.5 group">
    <LogoMark className="w-8 h-8 lg:w-9 lg:h-9 transition-transform duration-300 group-hover:rotate-[-6deg]" />
    <span className="font-display text-base lg:text-lg font-bold tracking-tight text-foreground leading-none">
      Monterey Bay <span className="text-brand">PCs</span>
    </span>
  </Link>
);

export default Logo;
