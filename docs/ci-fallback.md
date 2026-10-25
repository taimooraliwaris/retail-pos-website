# CI fallback and build-verification procedure

## Current blocker

The `Website checks` GitHub Actions workflow has not executed a build. Run #12, attempt 2, failed before any step started; GitHub reported no assigned runner and no step logs. The account-level error reported during this troubleshooting says recent account payments failed or the spending limit needs to be increased.

Repository Actions permissions are already enabled and are not the cause indicated by that error. Do not keep rerunning the same job while the account-level block remains, and do not enable paid upgrades, auto-recharge, or new services without explicit approval.

**Status: blocked, not passed.** Source-level review does not substitute for an Astro production build.

## No-cost local fallback

Use a network-enabled environment with Node.js **22.23.4 or newer**. The repository declares this minimum in `package.json`; a lower Node 22 patch may not satisfy the project's supported environment.

From a clean checkout of the website branch:

```bash
npm install --no-audit --no-fund
npm run check:content
npm run build
```

Expected results:

- `npm run check:content` exits with code 0 and reports successful content, route, metadata, and release-guard checks.
- `npm run build` exits with code 0 and creates `dist/`.
- If either command fails, keep the gate blocked and record the full error, Node version, npm version, and commit SHA. Do not mark the production build verified from a source review alone.

To inspect the built site locally after a successful build:

```bash
npm run preview -- --host 127.0.0.1
```

Check the homepage, product, features, offline-first, download, changelog, security, FAQ, about, contact, and pricing routes; also check `/robots.txt`, `/sitemap.xml`, the 404 page, mobile navigation, and browser console. Privacy and terms are drafts and must remain noindex until reviewed.

## Release and hosting guardrails

- Do not merge the draft PR or publish a production deployment based only on these source-level checks.
- Do not publish an APK until a signed release is approved and its package identity, version, checksum, compatibility, and update path are verified.
- Before deployment, replace the proposed `SITE_URL` with the exact assigned HTTPS origin and verify canonical URLs, sitemap, and robots output.
- Any hosted alternative must be confirmed to allow this project's intended use on a genuinely free plan. Do not create paid resources or enable billing without explicit approval.
- When the GitHub account-level block is resolved, rerun the existing workflow and require a green content-check and build result before changing the checklist status to completed.
