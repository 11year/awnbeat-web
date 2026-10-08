// Public fallback deliberately fetches no private entity metadata.
// Visual style matches the public event page (api/event.js, "Event unavailable" state).
const allowedKinds = new Set(["communities", "groups", "posts", "profile", "chats"]);
const APP_STORE_URL = "https://apps.apple.com/us/app/awnbeat/id6789319121";

function pageHtml(url) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex">
  <title>Open in Awnbeat</title>
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
      color: inherit;
      text-decoration: none;
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

    h1 {
      margin: 0;
      font-weight: 400;
      font-size: clamp(36px, 10vw, 52px);
      line-height: 1.05;
      letter-spacing: -0.03em;
    }

    .body {
      margin: 0;
      font-weight: 400;
      font-size: 17px;
      line-height: 1.45;
      color: #3a3a3a;
      text-wrap: pretty;
    }

    .open-app {
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
    <a class="app-mark" href="/" aria-label="Awnbeat home">
      <img class="app-icon" src="/appiconlight.png" alt="">
      <p class="brand-name">Awnbeat</p>
    </a>
    <main class="glass">
      <h1>Open in Awnbeat</h1>
      <p class="body">Open the app and sign in to view this content. Private content is available only to people who have access.</p>
      <a class="open-app" href="${url}">Open Awnbeat</a>
    </main>
    <a class="app-store-badge" href="${APP_STORE_URL}" target="_blank" rel="noopener" aria-label="Download Awnbeat on the App Store"><img src="/app-store-badge.svg" alt="Download on the App Store"></a>
  </div>
</body>
</html>`;
}

module.exports = function handler(req, res) {
  const { resource: kind, entityId } = req.query || {};
  if (!allowedKinds.has(kind) || typeof entityId !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(entityId)) {
    return res.status(404).send("Page not found");
  }
  const route = kind === "communities" ? "groups" : kind;
  const query = new URLSearchParams();
  if (kind === "chats") {
    if (["direct", "group", "event"].includes(req.query.kind)) query.set("kind", req.query.kind);
    if (/^[0-9a-f-]{36}$/i.test(req.query.topic || "")) query.set("topic", req.query.topic);
    if (/^\d{1,4}$/.test(req.query.team || "")) query.set("team", req.query.team);
  }
  const suffix = query.toString() ? "?" + query.toString().replaceAll("&", "&amp;") : "";
  const url = `awnbeat://${route}/${entityId}${suffix}`;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Content-Security-Policy", "default-src 'none'; style-src 'unsafe-inline'; img-src 'self'; font-src 'self'; base-uri 'none'; frame-ancestors 'none'");
  return res.status(200).send(pageHtml(url));
};
