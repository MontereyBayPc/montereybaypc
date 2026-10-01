// Runs before `vite dev` and `vite build` (predev/prebuild hooks); writes public/sitemap.xml.
import { writeFileSync } from "fs";
import { resolve } from "path";
import { SITE_URL, seoRoutes } from "../src/seo/routes";

const urls = seoRoutes.map((e) =>
  [
    `  <url>`,
    `    <loc>${SITE_URL}${e.path}</loc>`,
    `    <changefreq>${e.changefreq}</changefreq>`,
    `    <priority>${e.priority}</priority>`,
    `  </url>`,
  ].join("\n"),
);

writeFileSync(
  resolve("public/sitemap.xml"),
  [`<?xml version="1.0" encoding="UTF-8"?>`, `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`, ...urls, `</urlset>`].join("\n"),
);
console.log(`sitemap.xml written (${seoRoutes.length} entries)`);
