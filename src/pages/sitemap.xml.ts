const siteUrl = (process.env.SITE_URL || "https://retail-pos-mobile-website.netlify.app").replace(/\/$/, "");
const routes = ["/","/product/","/features/","/offline-first/","/download/","/changelog/","/security/","/faq/","/about/","/contact/","/pricing/"];
export function GET() {
  const urls = routes.map((route) => `  <url><loc>${siteUrl}${route}</loc></url>`).join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
