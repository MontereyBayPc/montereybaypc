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
  .map((r) => `<a href="${r.path}">${esc(r.h1)}</a>`)
  .join(" | ");

function render(template: string, path: string, title: string, description: string, bodyHtml: string, noindex: boolean) {
  const url = `${SITE_URL}${path}`;
  let html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(description)}">`)
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${esc(title)}">`)
    .replace(/<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${esc(title)}">`)
    .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${esc(description)}">`)
    .replace(/<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${esc(description)}">`);
  const extra = `<link rel="canonical" href="${url}" />\n    <meta property="og:url" content="${url}" />${noindex ? '\n    <meta name="robots" content="noindex" />' : ""}\n  </head>`;
  html = html.replace("</head>", extra);
  return html.replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`);
}

export function prerenderPlugin(): Plugin {
  let outDir = "dist";
  return {
    name: "static-route-snapshots",
    apply: "build",
    configResolved(c) {
      outDir = resolve(c.root, c.build.outDir);
    },
    closeBundle() {
      const template = readFileSync(join(outDir, "index.html"), "utf8");
      const write = (path: string, html: string) => {
        const dir = path === "/" ? outDir : join(outDir, path);
        mkdirSync(dir, { recursive: true });
        writeFileSync(join(dir, "index.html"), html);
      };
      for (const r of seoRoutes) {
        const body = `<header><nav>${nav}</nav></header><main><h1>${esc(r.h1)}</h1>${r.body
          .map((p) => `<p>${esc(p)}</p>`)
          .join("")}</main>`;
        write(r.path, render(template, r.path, r.title, r.description, body, false));
      }
      for (const r of noindexRoutes) {
        write(r.path, render(template, r.path, r.title, r.description, `<main><h1>${esc(r.title)}</h1></main>`, true));
      }
      console.log(`prerendered ${seoRoutes.length + noindexRoutes.length} route snapshots`);
    },
  };
}
