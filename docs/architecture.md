# Website architecture

| Concern | Decision |
|---|---|
| Mobile app source | Separate repository; do not expose it through the website |
| Website | This repository; Astro static generation |
| Content | Version-controlled files |
| Website database | None for the initial release |
| POS database access | None; no shared database or credentials |
| APK and update manifest | Separate public release-asset location after a signed build is approved |
| Hosting | Netlify Free is the initial candidate, pending current terms and quota verification |

## Why no website database?
The initial site explains the product, publishes documentation and release history, and provides official download instructions. These are static-content requirements. A database would add cost and maintenance without solving a current need.

The website must not query or share POS sales, customer, supplier, ledger, or device data. It must not contain Supabase credentials, private tokens, signing keys, or production secrets.

## Static behavior
- Build-time page generation; no server runtime is required for public pages.
- No accounts, stored contact forms, analytics, or user tracking in the initial scope.
- Sitemap and robots endpoints are generated at build time.
- Set `SITE_URL` to the actual production HTTPS origin before launch.

## Product-truth boundary
The mobile repository README says Sprint 0 is establishing the production foundation before business-feature development. Operational capabilities therefore remain labelled as planned until code and relevant tests are reviewed. A passing website build does not prove that an Android workflow works.

## Hosting cost guardrails
Netlify Free is a candidate, not a completed deployment. Recheck current official terms, commercial eligibility, monthly credits, and pause behavior before connecting it. Do not enable paid upgrades or automatic billing without explicit approval.

## Future release separation
After a signed APK is approved, publish it and its update manifest through a separate public release-asset location. The mobile updater must validate HTTPS, version/build policy, allowed download hosts, and SHA-256 before opening Android's installer. Android's normal installer confirmation remains user-controlled.
