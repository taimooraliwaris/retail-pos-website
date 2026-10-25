import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const required = [
  "src/pages/index.astro", "src/pages/product/index.astro", "src/pages/features/index.astro",
  "src/pages/offline-first/index.astro", "src/pages/download/index.astro", "src/pages/changelog/index.astro",
  "src/pages/security/index.astro", "src/pages/faq/index.astro", "src/pages/about/index.astro",
  "src/pages/contact/index.astro", "src/pages/pricing/index.astro", "src/pages/privacy/index.astro",
  "src/pages/terms/index.astro", "src/pages/robots.txt.ts", "src/pages/sitemap.xml.ts",
  "src/layouts/SiteLayout.astro", "src/styles/global.css", "docs/website-checklist.json", "docs/product-claims.md"
];
for (const file of required) assert.ok(existsSync(join(root, file)), `Missing required file: ${file}`);

const checklist = JSON.parse(readFileSync(join(root, "docs/website-checklist.json"), "utf8"));
assert.equal(checklist.checklist.length, 14, "Expected 14 checklist categories.");
for (const section of checklist.checklist) {
  assert.ok(section.category_id && section.title && Array.isArray(section.items), "Malformed checklist category.");
  for (const entry of section.items) assert.ok(entry.id && entry.requirement && entry.acceptance_criteria && entry.status, "Malformed checklist item.");
}

const features = JSON.parse(readFileSync(join(root, "src/data/features.json"), "utf8"));
assert.ok(Array.isArray(features) && features.length >= 5, "Expected at least five planned feature areas.");
assert.ok(features.every((f) => f.status === "planned" && f.id && f.title && f.outcome && f.planned_scope), "Feature claims must remain clearly marked planned.");

const download = readFileSync(join(root, "src/pages/download/index.astro"), "utf8");
assert.match(download, /not available yet/i, "Download page must disclose that no public APK is available.");
assert.doesNotMatch(download, /href=["'][^"']+\.apk/i, "An APK must not be linked before release approval.");
const changelog = readFileSync(join(root, "src/pages/changelog/index.astro"), "utf8");
assert.match(changelog, /no public release/i, "Changelog must not imply a release has shipped.");

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}
const pageRoot = join(root, "src/pages");
const pageFiles = walk(pageRoot).filter((file) => file.endsWith(".astro"));
const routes = new Set(["/"]);
for (const file of pageFiles) {
  const rel = relative(pageRoot, file).replaceAll("\\", "/");
  if (rel === "index.astro") routes.add("/");
  else if (rel.endsWith("/index.astro")) routes.add("/" + rel.slice(0, -"/index.astro".length) + "/");
  else routes.add("/" + rel.replace(/\.astro$/, ""));
}
const publicRoot = join(root, "public");
const assets = new Set(walk(publicRoot).map((file) => "/" + relative(publicRoot, file).replaceAll("\\", "/")));
const pageText = pageFiles.map((file) => readFileSync(file, "utf8")).join("\n");
for (const match of pageText.matchAll(/href=["'](\/[A-Za-z0-9_./-]*)["']/g)) {
  const href = match[1];
  assert.ok(routes.has(href) || assets.has(href), `Broken internal link: ${href}`);
}

const publicFiles = pageFiles.filter((file) => !file.endsWith("404.astro"));
const publicText = publicFiles.map((file) => readFileSync(file, "utf8")).join("\n");
assert.doesNotMatch(publicText, /TODO|FIXME|example\.com|your-domain/i, "Public pages contain unresolved placeholders.");
console.log(`Content checks passed: ${required.length} required files, ${features.length} planned feature areas, ${routes.size} routes, ${checklist.checklist.length} checklist categories.`);
