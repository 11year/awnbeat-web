// Shared page for the Stripe Connect payout onboarding return/refresh URLs.
// Stripe sends people here after setup (STRIPE_CONNECT_RETURN_URL / STRIPE_CONNECT_REFRESH_URL).
// Visual style matches the public event page (api/event.js).

const APP_STORE_URL = "https://apps.apple.com/us/app/awnbeat/id6789319121";
// Opens the app without navigating anywhere, so the person lands back on the payment
// setup screen they came from. "awnbeat" is the app's URL scheme (awn/Info.plist).
// The app has no payments deep link route, so we don't invent one.
const APP_OPEN_URL = "awnbeat://";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function pageHtml({ title, heading, body, hint }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="robots" content="noindex, nofollow">
  <meta name="referrer" content="no-referrer">
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

    .hint {
      margin: 0;
      font-weight: 400;
      font-size: 14px;
      line-height: 1.4;
      color: #5a5a5a;
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
    <div class="app-mark">
      <img class="app-icon" src="/appiconlight.png" alt="">
      <p class="brand-name">Awnbeat</p>
    </div>
    <main class="glass">
      <h1>${escapeHtml(heading)}</h1>
      <p class="body">${escapeHtml(body)}</p>
      <a class="open-app" href="${APP_OPEN_URL}" data-store-url="${APP_STORE_URL}">Open Awnbeat</a>
      <p class="hint">${escapeHtml(hint)}</p>
    </main>
    <a class="app-store-badge" href="${APP_STORE_URL}" target="_blank" rel="noopener" aria-label="Download Awnbeat on the App Store"><img src="/app-store-badge.svg" alt="Download on the App Store"></a>
  </div>
  <script>
(function () {
  // Stripe usually opens this page inside the app's in-app browser, so on iPhone/iPad the
  // button opens the app directly (no App Store fallback timer: the page stays visible
  // behind the in-app browser, which would wrongly bounce people to the App Store).
  // Elsewhere the app can't be opened, so the button goes to the App Store like Join does.
  var button = document.querySelector(".open-app");
  if (!button) return;
  var ua = navigator.userAgent || "";
  var isIOS = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  if (isIOS) return;
  button.href = button.getAttribute("data-store-url");
  button.target = "_blank";
  button.rel = "noopener";
})();
  </script>
</body>
</html>`;
}

function sendConnectPage(res, page) {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.end(pageHtml(page));
}

module.exports = { sendConnectPage };
