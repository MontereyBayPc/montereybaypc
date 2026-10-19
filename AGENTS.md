# Project Architecture

- Keep The Beast as a dedicated one-of-one product page outside the reusable prebuilt catalog, because its presentation and inventory rules are unique.- Public routes, titles, descriptions, and static snapshot text live in src/seo/routes.ts; the sitemap and build-time HTML snapshots read from it, so new pages must be added there to be crawlable.
- Simple content pages (trade-in, BYO, business, repair request, city pages) are data entries in src/data/info-pages.ts rendered by one InfoPage component and fed into src/seo/routes.ts, so new ones need a route in App.tsx plus a data entry.
- Part compatibility and PSU sizing rules live in src/lib/compat.ts with tests, so the quote builder stays free of hardware logic.
- Bay uses AI Elements and a server-only Responses endpoint; one browser-local conversation keeps visitor chat lightweight without exposing model credentials.
- Physical-fit metadata and trade-in estimates live in dedicated tested domain modules; unknown dimensions must remain unverified rather than inferred from product families.
- Service acknowledgments are server-validated and stored privately before issuing a customer PDF; work scope and price still require a separate technician agreement.
- Build tracking is service-role-managed in Lovable Cloud with expiring unguessable tokens and short-lived private photo URLs; never expose public table reads or stage writes.
- Prebuilt benchmark references must identify their source and distinguish CPU-only reference scores from measured complete-system game results.
