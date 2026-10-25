# Retail POS Mobile — Website

The public-facing website for **Retail POS Mobile**, an Android-first retail POS currently in foundation development.

## Current status
- The mobile repository describes Sprint 0 as foundation work before business-feature development.
- No approved public APK is linked from this website.
- Checkout, inventory, till, offline sync, reports, and other operational workflows are presented as **planned direction**, not released functionality.
- Pricing and pilot access have not been announced.

## Visual direction
- Portfolio-inspired editorial layout: oversized typography, a deep slate hero, layered visual composition, spacious light content sections, refined feature cards, and a stronger footer.
- The homepage uses an abstract capability map that is explicitly labelled as an illustration, not a screenshot of a released app.
- Slate remains the base brand language from the current app theme, with restrained mint/blue accents. The latest redesign must be rebuilt and reviewed at desktop, tablet, and phone widths before merge or deployment.

## Architecture
- Website: Astro static site with minimal client-side JavaScript.
- Content: version-controlled files in this repository.
- Website database: none; no connection to the POS database.
- Mobile source: remains in its separate repository.
- Public APKs and update manifest: intended for a separate public release-asset location after a signed build is approved.
- Hosting candidate: Netlify Free, subject to current terms and quota review. No paid plan or domain is required by this repository.

See [architecture](docs/architecture.md), [product claims](docs/product-claims.md), [release process](docs/release-process.md), [the JSON checklist](docs/website-checklist.json), and the [CI fallback and build-verification guide](docs/ci-fallback.md).

## Local development
Requires Node.js 22.23.4 or a compatible supported release.

```bash
npm install
npm run check:content
npm run build
npm run dev
```

The static build is written to `dist/`.

## Deployment guardrails
Before publishing, verify the final HTTPS site URL and set `SITE_URL` to that exact origin. The current `retail-pos-mobile-website.netlify.app` value is a proposed placeholder and must not be assumed available until checked. Recheck the hosting provider's current commercial-use terms, monthly limits, and pause behavior. Do not enable paid upgrades or automatic billing without explicit approval.

## Quality gates
GitHub Actions is configured to run content checks and the production build, but the current job is blocked before any step starts by the reported account payment/spending-limit error. No green CI build has been established, and the Astro build has not run in that job. The user successfully ran the content checks and Astro build on the earlier foundation version, producing 14 pages. The visual redesign was committed afterward and still needs a fresh local build and browser review. Follow [the CI fallback guide](docs/ci-fallback.md) for no-cost local validation; do not keep rerunning the blocked job. A green website build still does not prove that an Android workflow or in-app update path works on a physical device.

Only mark checklist items completed when their acceptance criteria are checked and evidence is recorded.
