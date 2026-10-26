import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const required = [
  "src/pages/index.astro", "src/pages/product/index.astro", "src/pages/features/index.astro",
  "src/pages/offline-first/index.astro", "src/pages/download/index.astro", "src/pages/changelog/index.astro",
  "src/pages/security/index.astro", "src/pages/faq/index.astro", "src/pages/about/index.astro",
  "src/pages/contact/index.astro", "src/pages/pricing/index.astro", "src/pages/privacy/index.astro",
  "src/pages/terms/index.astro", "src/pages/404.astro", "src/pages/robots.txt.ts", "src/pages/sitemap.xml.ts",
  "src/layouts/SiteLayout.astro", "src/components/SiteHeader.astro", "src/components/SiteFooter.astro",
  "src/styles/global.css", "docs/website-checklist.json", "docs/product-claims.md"
];
for (const file of required) assert.ok(existsSync(join(root, file)), "Missing required file: " + file);

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const checklist = JSON.parse(readFileSync(join(root, "docs/website-checklist.json"), "utf8"));
assert.equal(checklist.checklist.length, 14, "Expected 14 checklist categories.");
for (const section of checklist.checklist) {
  assert.ok(section.category_id && section.title && Array.isArray(section.items), "Malformed checklist category.");
  for (const entry of section.items) {
    assert.ok(entry.id && entry.requirement && entry.acceptance_criteria && entry.status, "Malformed checklist item.");
    assert.ok(["not_started", "in_progress", "blocked", "completed", "deferred", "not_applicable"].includes(entry.status), "Unknown checklist status: " + entry.id);
  }
}

const features = JSON.parse(readFileSync(join(root, "src/data/features.json"), "utf8"));
assert.ok(Array.isArray(features) && features.length >= 5, "Expected at least five planned feature areas.");
assert.ok(features.every((f) => f.status === "planned" && f.id && f.title && f.outcome && f.planned_scope), "Feature claims must remain clearly marked planned.");

const download = readFileSync(join(root, "src/pages/download/index.astro"), "utf8");
assert.match(download, /not available yet/i, "Download page must disclose that no public APK is available.");
assert.doesNotMatch(download, /href=["'][^"']+\.apk/i, "An APK must not be linked before release approval.");
const changelog = readFileSync(join(root, "src/pages/changelog/index.astro"), "utf8");
assert.match(changelog, /no public release/i, "Changelog must not imply a release has shipped.");

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
const generatedRoutes = new Set(["/robots.txt", "/sitemap.xml"]);
const sourceFiles = walk(join(root, "src")).filter((file) => file.endsWith(".astro"));
const sourceText = sourceFiles.map((file) => readFileSync(file, "utf8")).join("\n");
const ids = new Set([...sourceText.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1]));

function validateLocalHref(href, sourceFile) {
  if (!href || /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(href)) return;
  if (href.startsWith("#")) {
    const id = href.slice(1).split(/[?&]/)[0];
    assert.ok(ids.has(id), "Broken anchor in " + sourceFile + ": " + href);
    return;
  }
  if (!href.startsWith("/")) return;
  const pathname = href.split(/[?#]/)[0] || "/";
  assert.ok(routes.has(pathname) || assets.has(pathname) || generatedRoutes.has(pathname), "Broken internal link in " + sourceFile + ": " + href);
  const hashIndex = href.indexOf("#");
  if (hashIndex >= 0) {
    const id = href.slice(hashIndex + 1).split("?")[0];
    assert.ok(ids.has(id), "Broken anchor in " + sourceFile + ": " + href);
  }
}

for (const file of sourceFiles) {
  const text = readFileSync(file, "utf8");
  for (const match of text.matchAll(/href=["']([^"']+)["']/g)) validateLocalHref(match[1], relative(root, file));
  for (const match of text.matchAll(/href=\{([^}]+)\}/g)) {
    for (const pathMatch of match[1].matchAll(/["'](\/[A-Za-z0-9_./-]*)["']/g)) validateLocalHref(pathMatch[1], relative(root, file));
  }
  for (const match of text.matchAll(/\bhref\s*:\s*["'](\/[^"']*)["']/g)) validateLocalHref(match[1], relative(root, file));
}

const layout = readFileSync(join(root, "src/layouts/SiteLayout.astro"), "utf8");
assert.match(layout, /<title>\{title\}<\/title>/, "Site layout must render page titles.");
assert.match(layout, /name="description"/, "Site layout must render meta descriptions.");
assert.match(layout, /rel="canonical"/, "Site layout must support canonical URLs.");
for (const file of pageFiles) {
  const text = readFileSync(file, "utf8");
  assert.match(text, /<SiteLayout\s+title=/, "Page must define a title: " + relative(root, file));
  assert.match(text, /description=/, "Page must define a description: " + relative(root, file));
}
for (const file of ["src/pages/privacy/index.astro", "src/pages/terms/index.astro"]) {
  const text = readFileSync(join(root, file), "utf8");
  assert.match(text, /noindex=\{true\}/, "Draft legal page must remain noindex: " + file);
}
const sitemap = readFileSync(join(root, "src/pages/sitemap.xml.ts"), "utf8");
assert.doesNotMatch(sitemap, /\/privacy\/|\/terms\//, "Draft legal pages must not be included in the sitemap.");

const publicFiles = pageFiles.filter((file) => !file.endsWith("404.astro"));
const publicText = publicFiles.map((file) => readFileSync(file, "utf8")).join("\n");
assert.doesNotMatch(publicText, /TODO|FIXME|example\.com|your-domain/i, "Public pages contain unresolved placeholders.");

const css = readFileSync(join(root, "src/styles/global.css"), "utf8");
assert.match(css, /@media\s*\(max-width:/, "Responsive breakpoints are required.");
assert.match(css, /prefers-reduced-motion/, "Reduced-motion preferences must be respected.");

console.log("Content checks passed: " + required.length + " required files, " + features.length + " planned feature areas, " + routes.size + " routes, " + checklist.checklist.length + " checklist categories, internal links, page metadata, and draft policy guards.");
