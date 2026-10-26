import { defineConfig } from "astro/config";

const siteUrl = process.env.SITE_URL || "https://retail-pos-mobile-website.netlify.app";

export default defineConfig({
  site: siteUrl,
  output: "static",
  trailingSlash: "always",
  build: { format: "directory" }
});
