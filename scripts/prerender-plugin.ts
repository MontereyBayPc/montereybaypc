// Build-only Vite plugin: writes dist/<route>/index.html for every public route with
// route-specific head tags and static text inside #root, so crawlers and no-JS
// visitors see real content. React's createRoot replaces it on load.
import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { join, resolve } from "path";
import type { Plugin } from "vite";
import { SITE_URL, seoRoutes, noindexRoutes } from "../src/seo/routes";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const nav = seoRoutes
  .filter((r) => r.path.split("/").length <= 2)
  .map((r) => `      <li><a href="${r.path}">${esc(r.h1)}</a></li>`)
  .join("\n");

const footer = `<footer>
    <h2>All pages</h2>
    <ul>
${seoRoutes.map((r) => `      <li><a href="${r.path}">${esc(r.title)}</a></li>`).join("\n")}
    </ul>
    <p>Monterey Bay PCs, Monterey, CA. Email montereybaypc@gmail.com. Phone (831) 718-7730.</p>
  </footer>`;

export function render(template: string, path: string, title: string, description: string, bodyHtml: string, noindex: boolean, heroAsset?: string) {
  const url = `${SITE_URL}${path}`;
  let html = template
    .replace(/<meta\b[^>]*\bproperty=["']og:url["'][^>]*>\s*/gi, "")
    .replace(/<link\b[^>]*\brel=["']canonical["'][^>]*>\s*/gi, "")
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(description)}">`)
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${esc(title)}">`)
    .replace(/<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${esc(title)}">`)
    .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${esc(description)}">`)
    .replace(/<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${esc(description)}">`);
  const extra = `<link rel="canonical" href="${url}" />\n    <meta property="og:url" content="${url}" />${noindex ? '\n    <meta name="robots" content="noindex" />' : ""}\n  </head>`;
  html = html.replace("</head>", extra);
  if (path === '/' && heroAsset) html = html.replace('</head>', `<link rel="preload" as="image" href="${esc(heroAsset)}" fetchpriority="high" /></head>`);
  // Snapshot text stays in the HTML for crawlers but is visually hidden so visitors
  // never see a plain-text page while the app loads.
  const hidden = `<div style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap">${bodyHtml}</div>`;
  const photo = path === '/' && heroAsset ? `<section class="relative min-h-[100vh] overflow-hidden" aria-label="Monterey Bay PCs"><img src="${esc(heroAsset)}" alt="Custom gaming PC built by Monterey Bay PCs" width="1600" height="900" fetchpriority="high" class="absolute inset-0 w-full h-full object-cover opacity-45" /><div class="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20"></div></section>` : '';
  return html.replace('<div id="root"></div>', `<div id="root">${photo}${hidden}</div>`);
}

export function prerenderPlugin(): Plugin {
  let outDir = "dist";
  let heroAsset: string | undefined;
  return {
    name: "static-route-snapshots",
    apply: "build",
    configResolved(c) {
      outDir = resolve(c.root, c.build.outDir);
    },
    generateBundle(_options, bundle) {
      heroAsset = Object.values(bundle).find(entry => entry.type === 'asset' && /^hero-pc-[^.]+\.webp$/.test(entry.fileName.split('/').pop() ?? ''))?.fileName;
      if (heroAsset) heroAsset = '/' + heroAsset;
    },
    closeBundle() {
      const template = readFileSync(join(outDir, "index.html"), "utf8");
      const write = (path: string, html: string) => {
        const dir = path === "/" ? outDir : join(outDir, path);
        mkdirSync(dir, { recursive: true });
        writeFileSync(join(dir, "index.html"), html);
      };
      for (const r of seoRoutes) {
        const sections = (r.sections ?? [])
          .map((sec) => `    <section>\n      <h2>${esc(sec.h)}</h2>\n      <ul>\n${sec.items.map((i) => `        <li>${esc(i)}</li>`).join("\n")}\n      </ul>\n    </section>`)
          .join("\n");
        const body = `
  <header>
    <nav>
    <ul>
${nav}
    </ul>
    </nav>
  </header>
  <main>
    <h1>${esc(r.h1)}</h1>
${r.body.map((p) => `    <p>${esc(p)}</p>`).join("\n")}
${sections}
  </main>
  ${footer}
`;
        write(r.path, render(template, r.path, r.title, r.description, body, false, heroAsset));
      }
      for (const r of noindexRoutes) {
        write(r.path, render(template, r.path, r.title, r.description, `<main><h1>${esc(r.title)}</h1></main>`, true));
      }
      console.log(`prerendered ${seoRoutes.length + noindexRoutes.length} route snapshots`);
    },
  };
}
