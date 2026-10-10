const { fetchPublicEvent, fetchEventHighlights, fetchHost, isUuid } = require("./_supabase");

const SITE_ORIGIN = "https://awnbeat.com";
const APP_STORE_URL = "https://apps.apple.com/us/app/awnbeat/id6789319121";
// The iOS app routes awnbeat://events/<uuid> to the event (AppDeepLinkParser in MainTabView.swift).
const APP_EVENT_URL_PREFIX = "awnbeat://events/";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function cleanText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function safeImageUrl(value) {
  try {
    const url = new URL(cleanText(value));
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : "";
  } catch {
    return "";
  }
}

const EVENT_TIME_ZONE = "America/Chicago";

function zonedParts(value) {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return null;

  const display = new Intl.DateTimeFormat("en-US", {
    timeZone: EVENT_TIME_ZONE,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  }).formatToParts(date);

  const key = new Intl.DateTimeFormat("en-US", {
    timeZone: EVENT_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);

  const pick = (list, type) => list.find((part) => part.type === type)?.value || "";

  return {
    dateLabel: `${pick(display, "weekday")}, ${pick(display, "month")} ${pick(display, "day")}`,
    clock: `${pick(display, "hour")}:${pick(display, "minute").padStart(2, "0")}`,
    dayPeriod: pick(display, "dayPeriod").replace(/\s/g, "").toUpperCase(),
    dayKey: `${pick(key, "year")}-${pick(key, "month")}-${pick(key, "day")}`
  };
}

function formatEventWhen(startValue, endValue) {
  const start = zonedParts(startValue);
  if (!start) return "";

  const startStamp = `${start.dateLabel} \u00b7 ${start.clock} ${start.dayPeriod}`;
  const end = zonedParts(endValue);
  if (!end) return startStamp;

  if (start.dayKey === end.dayKey) {
    if (start.dayPeriod === end.dayPeriod) {
      return `${start.dateLabel} \u00b7 ${start.clock}\u2013${end.clock} ${end.dayPeriod}`;
    }
    return `${start.dateLabel} \u00b7 ${start.clock} ${start.dayPeriod}\u2013${end.clock} ${end.dayPeriod}`;
  }

  return `${startStamp} \u2013 ${end.dateLabel} \u00b7 ${end.clock} ${end.dayPeriod}`;
}

function eventPrice(event) {
  const cents = Number(event?.price_cents);
  if (event?.is_free || !Number.isFinite(cents) || cents <= 0) return "";

  const currency = cleanText(event.currency).toUpperCase() || "USD";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: cents % 100 === 0 ? 0 : 2
    }).format(cents / 100);
  } catch {
    return `$${(cents / 100).toFixed(2)}`;
  }
}

function pageHtml({ title, hostName, canonicalUrl, indexable, when, appEventId, event, highlights = [] }) {
  const heading = title || "Event unavailable";
  const documentTitle = title ? `${title} | Awnbeat` : "Event unavailable | Awnbeat";
  const description = hostName
    ? `${heading}, hosted by ${hostName} on Awnbeat.`
    : "Get Awnbeat on the App Store.";
  const imageUrl = safeImageUrl(event?.image_url);
  const location = cleanText(event?.city) || cleanText(event?.address);
  const price = eventPrice(event);
  const bio = cleanText(event?.description);
  const start = zonedParts(event?.start_time);
  const previewWhen = start
    ? `${start.dateLabel.replace(/^[^,]+, /, "")} \u2022 ${start.clock} ${start.dayPeriod}`
    : when;
  const hostRow = hostName
    ? `<p class="host" title="${escapeHtml(hostName)}">${escapeHtml(hostName)}</p>`
    : "";
  const appEventUrl = isUuid(appEventId)
    ? `${APP_EVENT_URL_PREFIX}${encodeURIComponent(appEventId)}`
    : "";
  const joinPill = title
    ? `<a class="join" href="${APP_STORE_URL}" target="_blank" rel="noopener"${appEventUrl ? ` data-app-url="${escapeHtml(appEventUrl)}"` : ""}>Join</a>`
    : "";
  // On iOS, try the app first; fall back to the App Store if the page is still visible.
  const joinScript = title && appEventUrl
    ? `<script>
(function () {
  var links = document.querySelectorAll("[data-app-url]");
  var ua = navigator.userAgent || "";
  var isIOS = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  if (!isIOS) return;
  links.forEach(function (link) { link.addEventListener("click", function (event) {
    event.preventDefault();
    var timer;
    function cancel() {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", cancel);
    }
    function onVisibility() { if (document.hidden) cancel(); }
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", cancel);
    timer = setTimeout(function () {
      cancel();
      if (!document.hidden) window.location.href = link.href;
    }, 1500);
    window.location.href = link.getAttribute("data-app-url");
  }); });
})();
</script>`
    : "";
  const whenLine = previewWhen
    ? `<p class="when" title="${escapeHtml(when)}"><time${event?.start_time ? ` datetime="${escapeHtml(event.start_time)}"` : ""}>${escapeHtml(previewWhen)}</time></p>`
    : "";
  const count = Number(event?.attendee_count);
  const capacity = Number(event?.capacity);
  const hasCount = event?.attendee_count != null && Number.isFinite(count) && count >= 0;
  const guestLabel = hasCount
    ? `${Math.floor(count)}${Number.isFinite(capacity) && capacity > 0 ? `/${Math.floor(capacity)}` : ""}`
    : "";
  const seenHighlights = new Set();
  const previewHighlights = highlights
    .map(cleanText)
    .filter((name) => {
      const key = name.toLowerCase();
      if (!key || seenHighlights.has(key)) return false;
      seenHighlights.add(key);
      return true;
    })
    .slice(0, 2);
  const highlightRow = previewHighlights.length
    ? `<ul class="event-highlights" aria-label="Event highlights">${previewHighlights.map((name) => `<li title="${escapeHtml(name)}">${escapeHtml(name)}</li>`).join("")}</ul>`
    : "";
  const calendarIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 11h18m-11 4h2m4 0h2m-10 3h2"/></svg>`;
  const hasMediaFooter = hasCount || previewHighlights.length > 0;
  const card = title
    ? `<main class="event-card" aria-labelledby="event-title">
      <div class="event-copy">
        <h1 id="event-title" title="${escapeHtml(heading)}">${escapeHtml(heading)}</h1>
        <div class="event-meta">
          ${hostRow}
          ${whenLine}
          ${location || price ? `<div class="location-price">${location ? `<p class="location" title="${escapeHtml(location)}">${escapeHtml(location)}</p>` : ""}${price ? `<span class="price">${escapeHtml(price)}</span>` : ""}</div>` : ""}
        </div>
        ${bio ? `<div class="event-bio"><p>${escapeHtml(bio)}</p></div>` : ""}
      </div>
      <div class="event-image${hasMediaFooter ? " has-footer" : ""}">
        <span class="image-fallback" aria-hidden="true">${calendarIcon}</span>
        ${imageUrl ? `<img src="${escapeHtml(imageUrl)}" alt="" class="event-photo" onerror="this.hidden = true">` : ""}
        ${hasMediaFooter ? `<div class="event-footer">
        ${hasCount ? `<p class="guests" aria-label="${Math.floor(count)} guests${capacity > 0 ? ` out of ${Math.floor(capacity)} spots` : ""}"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="9" cy="7" r="3.5"/><path d="M2 20v-2a7 7 0 0 1 14 0v2z"/><circle cx="18" cy="8" r="3"/><path d="M17 13a6 6 0 0 1 6 6v1h-5v-2a9 9 0 0 0-1-5z"/></svg><span>${guestLabel}</span></p>` : ""}
        ${highlightRow}
        </div>` : ""}
      </div>
    </main>`
    : `<main class="glass"><h1>${escapeHtml(heading)}</h1></main>`;

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(documentTitle)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="${indexable ? "index, follow" : "noindex, follow"}">
  <link rel="canonical" href="${escapeHtml(canonicalUrl)}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Awnbeat">
  <meta property="og:title" content="${escapeHtml(heading)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${escapeHtml(canonicalUrl)}">
  <style>
    @font-face {
      font-family: "Montserrat";
      src: url("/fonts/Montserrat-VariableFont_wght.ttf") format("truetype");
      font-weight: 100 900;
      font-style: normal;
      font-display: swap;
    }

    * { box-sizing: border-box; }

    html, body { min-height: 100%; margin: 0; }
    html { background-color: #ffffff; }

    body {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      align-items: start;
      justify-items: center;
      min-height: 100vh;
      padding: max(32px, env(safe-area-inset-top)) 24px max(32px, env(safe-area-inset-bottom));
      color: #1a1a1a;
      background: transparent;
      font-family: "Montserrat", sans-serif;
      font-weight: 400;
      text-align: center;
    }

    .awn-bg {
      position: fixed;
      inset: 0;
      z-index: -1;
      overflow: hidden;
      pointer-events: none;
      background: #ffffff;
    }

    .awn-bg-watermark {
      position: absolute;
      inset: 0;
      background-image: url("/logo.png"), url("/logo.png");
      background-repeat: repeat, repeat;
      background-size: 200px 200px, 200px 200px;
      background-position: 0 0, 100px 100px;
      opacity: 0.07;
    }

    .awn-bg-gradient {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(140,217,166,0.18) 0%, rgba(140,217,166,0.08) 25%, rgba(250,153,89,0.12) 45%, rgba(250,153,89,0.14) 55%, rgba(122,204,235,0.10) 75%, rgba(122,204,235,0.22) 100%);
    }

    .awn-bg-center {
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse 60% 50% at 50% 28%, rgba(255,255,255,0.86) 0%, rgba(255,255,255,0.48) 58%, transparent 100%);
    }

    .stack {
      display: grid;
      justify-items: center;
      gap: 22px;
      width: min(100%, 420px);
      min-width: 0;
    }

    .app-mark {
      display: grid;
      justify-items: center;
      gap: 10px;
    }

    .app-icon {
      width: 144px;
      height: 144px;
      border-radius: 22.5%;
      object-fit: cover;
      display: block;
    }

    .brand-name {
      margin: 0;
      font-weight: 400;
      font-size: 18px;
      line-height: 1.1;
      letter-spacing: -0.02em;
    }

    .glass {
      display: grid;
      justify-items: center;
      gap: 18px;
      width: 100%;
      padding: 36px 28px 32px;
      border: 1px solid rgba(255, 255, 255, 0.72);
      border-radius: 28px;
      background: rgba(255, 255, 255, 0.38);
      box-shadow:
        0 18px 50px rgba(35, 60, 45, 0.10),
        inset 0 1px 0 rgba(255, 255, 255, 0.75);
      backdrop-filter: blur(28px) saturate(1.5);
      -webkit-backdrop-filter: blur(28px) saturate(1.5);
    }

    h1, .host { margin: 0; font-weight: 400; }

    h1 {
      font-size: clamp(36px, 10vw, 52px);
      line-height: 1.05;
      letter-spacing: -0.03em;
    }

    /* Centered event details above full-width preview media. */
    .event-card {
      display: flex;
      flex-direction: column;
      width: 100%;
      min-width: 0;
      min-height: 390px;
      overflow: hidden;
      border-radius: 16px;
      background: #fff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.10);
      text-align: center;
    }

    .event-copy {
      display: grid;
      align-content: center;
      gap: 12px;
      flex: 1;
      min-width: 0;
      padding: 24px 24px 22px;
    }

    .event-card h1 {
      display: -webkit-box;
      overflow: hidden;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      font-size: 22px;
      font-weight: 600;
      line-height: 1.25;
      letter-spacing: -0.02em;
      overflow-wrap: anywhere;
    }

    .event-meta {
      display: grid;
      gap: 6px;
      min-width: 0;
      font-size: 15px;
      line-height: 1.3;
    }

    .event-meta p { margin: 0; }
    .location-price { display: flex; align-items: baseline; justify-content: center; gap: 8px; min-width: 0; }
    .location { color: #737373; min-width: 0; }
    .price { color: #8cd9a6; font-weight: 600; white-space: nowrap; }
    .when { color: #7acceb; }
    .host { color: #fa9959; font-weight: 400; }
    .location, .when, .host { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    .event-bio { min-width: 0; }
    .event-bio p {
      display: -webkit-box;
      margin: 0;
      color: #737373;
      font-size: 13.2px;
      line-height: 18px;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
      overflow-wrap: anywhere;
    }

    .event-image {
      position: relative;
      width: 100%;
      aspect-ratio: 12 / 5;
      flex-shrink: 0;
      overflow: hidden;
      background: linear-gradient(135deg, #e4f3e9, #d8edf5);
    }

    .image-fallback { position: absolute; inset: 0; display: grid; place-items: center; color: #fa9959; }
    .image-fallback svg { width: 64px; height: 64px; }
    .event-photo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; background: #fff; }
    .event-photo[hidden] { display: none; }
    .event-image.has-footer::after {
      content: "";
      position: absolute;
      inset: 40% 0 0;
      background: linear-gradient(transparent, rgba(15, 24, 20, 0.72));
      pointer-events: none;
    }

    .event-footer {
      position: absolute;
      z-index: 1;
      left: 12px;
      right: 12px;
      bottom: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      min-width: 0;
      min-height: 26px;
      text-align: left;
    }

    .guests { display: flex; align-items: center; gap: 4px; flex-shrink: 0; margin: 0; color: #fff; font-size: 12px; text-shadow: 0 1px 3px rgba(0, 0, 0, 0.35); }
    .guests svg { width: 15px; height: 15px; }
    .event-highlights { display: flex; justify-content: flex-end; gap: 4px; margin: 0 0 0 auto; padding: 0; min-width: 0; list-style: none; }
    .event-highlights li {
      min-width: 0;
      padding: 4px 8px;
      border: 1px solid rgba(255, 255, 255, 0.24);
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.18);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      color: #fff;
      font-size: 11px;
      font-weight: 600;
      line-height: 16px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    a:focus-visible { outline: 2px solid #1a1a1a; outline-offset: 4px; }

    @media (max-width: 360px) {
      body { padding-left: 16px; padding-right: 16px; }
      .event-meta { font-size: 13px; }
    }

    .join {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 44px;
      margin-top: 6px;
      padding: 12px 36px;
      border-radius: 999px;
      background: #8cd9a6;
      color: #1a1a1a;
      font: inherit;
      font-weight: 400;
      font-size: 17px;
      line-height: 1;
      text-decoration: none;
    }

    .app-store-badge {
      display: inline-block;
    }

    .app-store-badge img {
      width: 168px;
      height: auto;
    }
  </style>
</head>
<body>
  <div class="awn-bg" aria-hidden="true">
    <div class="awn-bg-watermark"></div>
    <div class="awn-bg-gradient"></div>
    <div class="awn-bg-center"></div>
  </div>
  <div class="stack">
    <div class="app-mark">
      <img class="app-icon" src="/appiconlight.png" alt="">
      <p class="brand-name">Awnbeat</p>
    </div>
    ${card}
    ${joinPill}
    <a class="app-store-badge" href="${APP_STORE_URL}" target="_blank" rel="noopener" aria-label="Download Awnbeat on the App Store"><img src="/app-store-badge.svg" alt="Download on the App Store"></a>
  </div>
  ${joinScript}
</body>
</html>`;
}

module.exports = async function handler(req, res) {
  const rawEventId = String(req.query?.eventId || "").trim();
  const eventId = rawEventId.split("/")[0];
  const canonicalUrl = eventId
    ? `${SITE_ORIGIN}/events/${encodeURIComponent(eventId)}`
    : SITE_ORIGIN;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=3600");

  if (!eventId) {
    res.statusCode = 404;
    res.end(pageHtml({ title: "", hostName: "", canonicalUrl, indexable: false }));
    return;
  }

  try {
    const event = await fetchPublicEvent(eventId);

    if (!event) {
      res.statusCode = 404;
      res.end(pageHtml({ title: "", hostName: "", canonicalUrl, indexable: false }));
      return;
    }

    const [host, highlights] = await Promise.all([
      fetchHost(event.creator_id),
      fetchEventHighlights(event.id).catch(() => [])
    ]);
    const canonicalId = isUuid(eventId) ? eventId : event.id;

    res.statusCode = 200;
    res.end(pageHtml({
      title: cleanText(event.title) || "Awnbeat event",
      hostName: cleanText(host.name),
      canonicalUrl: `${SITE_ORIGIN}/events/${encodeURIComponent(canonicalId)}`,
      indexable: true,
      when: formatEventWhen(event.start_time, event.end_time),
      appEventId: event.id,
      event,
      highlights
    }));
  } catch {
    res.statusCode = 500;
    res.end(pageHtml({ title: "", hostName: "", canonicalUrl, indexable: false }));
  }
};
