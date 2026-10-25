import { Link } from "react-router-dom";

export const LogoMark = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden="true" shapeRendering="crispEdges">
    {/* Monitor */}
    <rect x="1" y="4" width="18" height="13" className="fill-foreground" />
    <rect x="3" y="6" width="14" height="8" className="fill-background" />
    <rect x="14" y="15" width="2" height="1" className="fill-brand" />
    {/* Stand + keyboard base */}
    <rect x="8" y="17" width="3" height="2" className="fill-foreground" />
    <rect x="4" y="19" width="11" height="2" className="fill-foreground" />
    {/* Tower */}
    <rect x="22" y="2" width="9" height="27" className="fill-foreground" />
    <rect x="24" y="4" width="5" height="23" className="fill-background" />
    <rect x="25" y="24" width="3" height="2" className="fill-brand" />
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
