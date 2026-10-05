const { fetchPublicEvent, fetchHost, isUuid } = require("./_supabase");

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

function hostInitial(name) {
  const letter = cleanText(name).charAt(0).toUpperCase();
  return letter || "A";
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

function pageHtml({ title, hostName, hostPhotoUrl, canonicalUrl, indexable, when, appEventId }) {
  const heading = title || "Event unavailable";
  const documentTitle = title ? `${title} | Awnbeat` : "Event unavailable | Awnbeat";
  const description = hostName
    ? `${heading}, hosted by ${hostName} on Awnbeat.`
    : "Get Awnbeat on the App Store.";
  const photoUrl = safeImageUrl(hostPhotoUrl);
  const hostRow = hostName
    ? `<div class="host-row">
        ${
          photoUrl
            ? `<img class="host-photo" src="${escapeHtml(photoUrl)}" alt="">`
            : `<span class="host-photo host-photo-fallback" aria-hidden="true">${escapeHtml(hostInitial(hostName))}</span>`
        }
        <p class="host">${escapeHtml(hostName)}</p>
      </div>`
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
  var join = document.querySelector(".join[data-app-url]");
  if (!join) return;
  var ua = navigator.userAgent || "";
  var isIOS = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  if (!isIOS) return;
  join.addEventListener("click", function (event) {
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
      if (!document.hidden) window.location.href = join.href;
    }, 1500);
    window.location.href = join.getAttribute("data-app-url");
  });
})();
</script>`
    : "";
  const whenLine = when
    ? `<p class="when">${escapeHtml(when)}</p>`
    : "";

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

    .when {
      margin: 0;
      font-weight: 400;
      font-size: 17px;
      line-height: 1.35;
      color: #3a3a3a;
    }

    .host-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      max-width: 100%;
    }

    .host-photo {
      width: 44px;
      height: 44px;
      flex: 0 0 44px;
      border-radius: 50%;
      object-fit: cover;
      background: rgba(140, 217, 166, 0.45);
    }

    .host-photo-fallback {
      display: grid;
      place-items: center;
      color: #1a1a1a;
      font-size: 18px;
      line-height: 1;
    }

    .host {
      font-size: 18px;
      line-height: 1.3;
      letter-spacing: -0.02em;
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
    <main class="glass">
      <h1>${escapeHtml(heading)}</h1>
      ${whenLine}
      ${hostRow}
      ${joinPill}
    </main>
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
    res.end(pageHtml({ title: "", hostName: "", hostPhotoUrl: "", canonicalUrl, indexable: false }));
    return;
  }

  try {
    const event = await fetchPublicEvent(eventId);

    if (!event) {
      res.statusCode = 404;
      res.end(pageHtml({ title: "", hostName: "", hostPhotoUrl: "", canonicalUrl, indexable: false }));
      return;
    }

    const host = await fetchHost(event.creator_id);
    const canonicalId = isUuid(eventId) ? eventId : event.id;

    res.statusCode = 200;
    res.end(pageHtml({
      title: cleanText(event.title) || "Awnbeat event",
      hostName: cleanText(host.name),
      hostPhotoUrl: host.photoUrl,
      canonicalUrl: `${SITE_ORIGIN}/events/${encodeURIComponent(canonicalId)}`,
      indexable: true,
      when: formatEventWhen(event.start_time, event.end_time),
      appEventId: event.id
    }));
  } catch {
    res.statusCode = 500;
    res.end(pageHtml({ title: "", hostName: "", hostPhotoUrl: "", canonicalUrl, indexable: false }));
  }
};
