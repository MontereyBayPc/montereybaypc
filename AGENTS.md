# Project Architecture

- Keep The Beast as a dedicated one-of-one product page outside the reusable prebuilt catalog, because its presentation and inventory rules are unique.- Public routes, titles, descriptions, and static snapshot text live in src/seo/routes.ts; the sitemap and build-time HTML snapshots read from it, so new pages must be added there to be crawlable.
