const Footer = () => (
  <footer className="border-t border-border bg-background">
    <div className="container mx-auto px-4 lg:px-8 py-10 flex flex-col items-center gap-4">
      <a
        href="https://instagram.com/montereybaypc"
        target="_blank"
        rel="noreferrer"
        className="text-muted-foreground text-sm hover:text-foreground transition-colors duration-300"
      >
        Instagram
      </a>
      <p className="text-muted-foreground text-xs">
        © 2023–2026 Monterey Bay PCs. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
