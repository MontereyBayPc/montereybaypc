import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-card/40">
    <div className="container mx-auto px-4 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <span className="font-display text-lg font-bold gradient-rgb-text">MONTEREY BAY PCs</span>
          <p className="text-muted-foreground text-sm mt-3 max-w-xs">
            Custom-built PCs engineered for performance, reliability, and style. Based in Monterey Bay, CA.
          </p>
        </div>
        <div>
          <h4 className="font-heading text-sm font-bold uppercase tracking-widest text-foreground mb-4">Quick Links</h4>
          <div className="flex flex-col gap-2">
            {[
              { to: "/builder", label: "PC Builder" },
              { to: "/prebuilt", label: "Prebuilt PCs" },
              { to: "/services", label: "Services" },
              { to: "/contact", label: "Contact" },
            ].map((l) => (
              <Link key={l.to} to={l.to} className="text-muted-foreground text-sm hover:text-primary transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-heading text-sm font-bold uppercase tracking-widest text-foreground mb-4">Connect</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <a href="https://discord.gg" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">Discord</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">Instagram</a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">YouTube</a>
          </div>
        </div>
      </div>
      <div className="mt-10 pt-6 border-t border-border text-center text-muted-foreground text-xs">
        © {new Date().getFullYear()} Monterey Bay PCs. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
