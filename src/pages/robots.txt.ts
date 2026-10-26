const siteUrl = (process.env.SITE_URL || "https://retail-pos-mobile-website.netlify.app").replace(/\/$/, "");
export function GET() {
  const body = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
