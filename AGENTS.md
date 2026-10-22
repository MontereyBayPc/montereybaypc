# Project Architecture

- Keep The Beast as a dedicated one-of-one product page outside the reusable prebuilt catalog, because its presentation and inventory rules are unique.- Public routes, titles, descriptions, and static snapshot text live in src/seo/routes.ts; the sitemap and build-time HTML snapshots read from it, so new pages must be added there to be crawlable.
- Simple content pages (trade-in, BYO, business, repair request, city pages) are data entries in src/data/info-pages.ts rendered by one InfoPage component and fed into src/seo/routes.ts, so new ones need a route in App.tsx plus a data entry.
- Part compatibility and PSU sizing rules live in src/lib/compat.ts with tests, so the quote builder stays free of hardware logic.
- Bay uses AI Elements and a server-only Responses endpoint; one browser-local conversation keeps visitor chat lightweight without exposing model credentials.
- Physical-fit metadata and trade-in estimates live in dedicated tested domain modules; unknown dimensions must remain unverified rather than inferred from product families.
- Service acknowledgments are server-validated and stored privately before issuing a customer PDF; work scope and price still require a separate technician agreement.
- Build tracking is service-role-managed in Lovable Cloud with expiring unguessable tokens and short-lived private photo URLs; never expose public table reads or stage writes.
- Prebuilt benchmark references must identify their source and distinguish CPU-only reference scores from measured complete-system game results.
- Static route snapshots replace fallback canonical and Open Graph URLs before adding self-referencing page URLs, so social crawlers receive one unambiguous URL per page.
- Paid Stripe checkouts create their build tracker server-side (webhook plus return-page lookup, idempotent on the checkout session id) so every order is trackable without customer accounts; the staff portal lives at an unlinked, noindexed route.

- Workshop assignments and internal notes stay private on build_tracking; manage-build validates dates and the database enforces one active assembly slot per day to prevent concurrent overbooking. Queue state is internal and does not automatically claim carrier dispatch on customer pages.
- Shipping policy content is shared by the legal page and SEO snapshots so carrier timing and coverage terms remain consistent.
- Shipment progress uses a private expiring build token and server-only Shippo reads; maps show geocoded scan cities, never inferred live GPS positions.
- Shareable quotes serialize part IDs and extras only, with current catalog pricing restored on open; customer contact details are never included in links.
- Trade-up eligibility and published terms live in a tested domain module so trade-in copy and legal terms remain consistent.
- Build-time homepage snapshots include the first bundled hero photo and preload it, so imagery can load before React without exposing SEO snapshot text.
