# Retail POS Mobile — Website

The public-facing website for **Retail POS Mobile**, an Android-first retail POS currently in foundation development.

## Current status
- The mobile repository describes Sprint 0 as foundation work before business-feature development.
- No approved public APK is linked from this website.
- Checkout, inventory, till, offline sync, reports, and other operational workflows are presented as **planned direction**, not released functionality.
- Pricing and pilot access have not been announced.

## Architecture
- Website: Astro static site with minimal client-side JavaScript.
- Content: version-controlled files in this repository.
- Website database: none; no connection to the POS database.
- Mobile source: remains in its separate repository.
- Public APKs and update manifest: intended for a separate public release-asset location after a signed build is approved.
- Hosting candidate: Netlify Free, subject to current terms and quota review. No paid plan or domain is required by this repository.

See [architecture](docs/architecture.md), [product claims](docs/product-claims.md), [release process](docs/release-process.md), and [the JSON checklist](docs/website-checklist.json).

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
GitHub Actions is configured to run content checks and the production build. The initial workflow attempts failed before any steps started and produced no step logs, so a green CI build has not yet been established. Check repository Actions/runner availability or run the documented commands in a network-enabled Node.js 22.23.4 environment before merging. A green website build still does not prove that an Android workflow or in-app update path works on a physical device.

Only mark checklist items completed when their acceptance criteria are checked and evidence is recorded.
