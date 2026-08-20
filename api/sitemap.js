const { fetchUpcomingPublicEventsForSitemap } = require("./_supabase");

const SITE_ORIGIN = "https://awnbeat.com";

function xmlEscape(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function urlEntry(url, lastmod) {
  return `  <url>\n    <loc>${xmlEscape(url)}</loc>${lastmod ? `\n    <lastmod>${xmlEscape(lastmod)}</lastmod>` : ""}\n  </url>`;
}

module.exports = async function handler(req, res) {
  try {
    const events = await fetchUpcomingPublicEventsForSitemap();
    const pages = [
      urlEntry(`${SITE_ORIGIN}/`, "2026-08-20"),
      urlEntry(`${SITE_ORIGIN}/support/`),
      urlEntry(`${SITE_ORIGIN}/terms/`),
      urlEntry(`${SITE_ORIGIN}/privacy/`),
      ...events.map((event) =>
        urlEntry(
          `${SITE_ORIGIN}/events/${encodeURIComponent(event.id)}`,
          event.start_time ? new Date(event.start_time).toISOString().slice(0, 10) : ""
        )
      )
    ];

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300");
    res.end(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.join("\n")}\n</urlset>`);
  } catch (error) {
    console.error("Unable to generate sitemap", error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end("Sitemap unavailable");
  }
};
