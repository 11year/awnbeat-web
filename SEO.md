# Awnbeat no-cost SEO playbook

## Completed in this repository

- The homepage is now indexable. It previously sent `noindex, nofollow`, which prevented it from appearing in search results.
- `robots.txt` permits crawling and points crawlers to `sitemap.xml`.
- `sitemap.xml` is generated at request time and lists the public canonical pages plus upcoming public events. It never lists private or unpublished events.
- Canonical URLs prevent duplicate-page ambiguity; `/privacy-policy/` now permanently redirects to `/privacy/` (and the legacy file remains marked `noindex` as a safeguard).
- The homepage has a search-focused title, description, social previews, and Schema.org data for Awnbeat as an organization, website, and iOS app.
- Legal and support pages have canonical URLs.

## Required after deployment (free)

1. In [Google Search Console](https://search.google.com/search-console), add and verify `awnbeat.com` using the free DNS verification method. Submit `https://awnbeat.com/sitemap.xml` and use URL Inspection to request indexing of `https://awnbeat.com/`.
2. In [Bing Webmaster Tools](https://www.bing.com/webmasters), verify the domain and submit the same sitemap. Bing can import a verified Search Console property.
3. Check `https://awnbeat.com/robots.txt` and `https://awnbeat.com/sitemap.xml` in a browser after deploy. They must return HTTP 200, and the homepage must not send an `X-Robots-Tag: noindex` HTTP header.
4. Test the homepage's structured data with Google's Rich Results Test and URL with Search Console. Organization and WebSite markup help the search engine understand the brand; rich-result display is not guaranteed.

## Free ongoing work that earns broader search visibility

- Publish useful, indexable pages for real searches: Dallas pickup basketball, Dallas pickleball, running groups, cycling, soccer, volleyball, climbing, and specific venues. Each page needs unique first-hand copy, a descriptive title/H1, and links from the homepage or a hub page.
- Publish each public event at a stable URL with title, date/time, location, an event image, and Event schema. Do not include cancelled, private, or expired events in the sitemap.
- Create city and neighborhood pages only where Awnbeat genuinely has activity. Mention the actual area, venue, activity, and event/community details; do not mass-produce thin location pages.
- Ask event hosts, venues, clubs, universities, and community partners to link to their Awnbeat event or community page. Genuine local references are more valuable than directory spam or paid links.
- Keep the business name, website, email, and social profiles consistent. Claim a free Google Business Profile only if Awnbeat serves customers in person or is eligible as a service-area business; follow Google's eligibility rules.
- Use the exact app-store listing URL once available. A real app-store link improves trust and lets search engines connect the site with the app listing.
- Add an accessible text transcript/caption for meaningful videos and keep image alt text descriptive. Avoid putting important information only in images or client-side widgets.
- Monitor Search Console monthly: indexing status, queries, pages with errors, Core Web Vitals, and manual actions. Fix crawl/indexing errors before pursuing new keywords.

## Guardrails

- Do not buy links, use automated directory submissions, hide keyword-stuffed text, or duplicate one page for every city. These tactics create low-quality signals and can damage visibility.
- Results take time after indexing is enabled. Brand-name visibility normally improves only after Google has crawled and processed the redeployed homepage.
