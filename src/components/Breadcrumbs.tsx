import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

type Crumb = { label: string; to?: string };

const Breadcrumbs = ({ items }: { items: Crumb[] }) => (
  <nav aria-label="Breadcrumb" className="mb-8 no-print">
    <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
      <li><Link to="/" className="hover:text-foreground transition-colors">Home</Link></li>
      {items.map((c) => (
        <li key={c.label} className="flex items-center gap-1.5">
          <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
          {c.to ? (
            <Link to={c.to} className="hover:text-foreground transition-colors">{c.label}</Link>
          ) : (
            <span aria-current="page" className="text-foreground">{c.label}</span>
          )}
        </li>
      ))}
    </ol>
  </nav>
);

export default Breadcrumbs;
