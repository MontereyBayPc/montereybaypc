# Project Architecture

- Keep The Beast as a dedicated one-of-one product page outside the reusable prebuilt catalog, because its presentation and inventory rules are unique.- Public routes, titles, descriptions, and static snapshot text live in src/seo/routes.ts; the sitemap and build-time HTML snapshots read from it, so new pages must be added there to be crawlable.
- Simple content pages (trade-in, BYO, business, repair request, city pages) are data entries in src/data/info-pages.ts rendered by one InfoPage component and fed into src/seo/routes.ts, so new ones need a route in App.tsx plus a data entry.
- Part compatibility and PSU sizing rules live in src/lib/compat.ts with tests, so the quote builder stays free of hardware logic.
