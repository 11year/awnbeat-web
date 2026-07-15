const { fetchPublicEvent, isUuid } = require("./_supabase");

const SITE_ORIGIN = "https://awnbeat.com";
const FALLBACK_DESCRIPTION = "Join this Awnbeat event and get outside with people nearby.";
const FALLBACK_IMAGE = "https://framerusercontent.com/images/BC7nZss1KAilfDrwMJia6FQnEw.png";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeJson(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
}

function cleanText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function absoluteUrl(value) {
  const text = cleanText(value);
  if (!text) return "";

  try {
    return new URL(text, SITE_ORIGIN).toString();
  } catch {
    return "";
  }
}

function formatDateTime(event) {
  if (!event?.start_time) return "";

  const start = new Date(event.start_time);
  if (Number.isNaN(start.getTime())) return "";

  const formatter = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: event.timezone || undefined
  });

  return formatter.format(start);
}

function formatLocation(event) {
  const parts = [];
  const location = cleanText(event?.location);
  const address = cleanText(event?.address);
  const city = cleanText(event?.city);
  const state = cleanText(event?.state);

  if (location && location !== address) parts.push(location);
  if (city) parts.push(city);
  if (state) parts.push(state);

  return parts.join(", ");
}

function formatPrice(event) {
  if (!event || event.is_free !== false) return "Free";

  const currency = event.currency || "USD";
  const amount = typeof event.price_cents === "number" ? event.price_cents / 100 : Number(event.price || 0);

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency
    }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}

function eventMeta(event, eventId) {
  const canonicalUrl = `${SITE_ORIGIN}/events/${encodeURIComponent(eventId)}`;
  const title = event ? cleanText(event.title) || "Awnbeat event" : "Event unavailable";
  const description = event ? cleanText(event.description) || FALLBACK_DESCRIPTION : "This Awnbeat event is not available.";
  const image = absoluteUrl(event?.image_url) || FALLBACK_IMAGE;

  return {
    canonicalUrl,
    title,
    description,
    image
  };
}

function unavailableHtml(eventId) {
  const meta = eventMeta(null, eventId);

  return pageShell({
    meta,
    event: null,
    body: `
      <main class="event-shell">
        <section class="unavailable-state" aria-labelledby="unavailable-title">
          <div class="brand-mark">
            <img src="/logo.png" alt="" aria-hidden="true">
          </div>
          <p class="eyebrow">Awnbeat</p>
          <h1 id="unavailable-title">Event unavailable</h1>
          <p>This event may be private, unpublished, or no longer available.</p>
        </section>
      </main>
    `
  });
}

function eventHtml(event, eventId) {
  const meta = eventMeta(event, eventId);
  const when = formatDateTime(event);
  const where = formatLocation(event);
  const price = formatPrice(event);
  const eventType = cleanText(event.event_type || "event");
  const attendeeCount = Number.isFinite(event.attendee_count) ? event.attendee_count : 0;
  const capacity = Number.isFinite(event.capacity) ? event.capacity : null;
  const spots = capacity ? `${Math.max(capacity - attendeeCount, 0)} spots left` : `${attendeeCount} going`;

  return pageShell({
    meta,
    event,
    body: `
      <main class="event-shell">
        <article class="event-card">
          <header class="event-hero">
            ${
              meta.image
                ? `<img class="event-image" src="${escapeHtml(meta.image)}" alt="">`
                : `<div class="event-image event-image-fallback"><img src="/logo.png" alt=""></div>`
            }
            <div class="event-brand">
              <img src="/logo.png" alt="" aria-hidden="true">
              <span>Awnbeat</span>
            </div>
          </header>

          <section class="event-content">
            <p class="eyebrow">${escapeHtml(eventType)}</p>
            <h1>${escapeHtml(event.title)}</h1>
            ${event.description ? `<p class="description">${escapeHtml(event.description)}</p>` : ""}

            <div class="event-facts" aria-label="Event details">
              ${when ? `<div><span>When</span><strong>${escapeHtml(when)}</strong></div>` : ""}
              ${where ? `<div><span>Where</span><strong>${escapeHtml(where)}</strong></div>` : ""}
              <div><span>Price</span><strong>${escapeHtml(price)}</strong></div>
              <div><span>RSVP</span><strong>${escapeHtml(spots)}</strong></div>
            </div>

            <section class="join-panel" aria-labelledby="join-title">
              <div>
                <p class="eyebrow">Join as a guest</p>
                <h2 id="join-title">Save your spot</h2>
              </div>

              <form id="join-form" novalidate>
                <label>
                  <span>Name</span>
                  <input name="name" autocomplete="name" required>
                </label>
                <label>
                  <span>Phone number</span>
                  <input name="phone" type="tel" autocomplete="tel" inputmode="tel" required>
                </label>
                <label>
                  <span>Notes</span>
                  <textarea name="notes" rows="3" placeholder="Optional"></textarea>
                </label>
                <button type="submit">Join</button>
                <p id="form-message" class="form-message" role="status" aria-live="polite"></p>
              </form>
            </section>
          </section>
        </article>
      </main>
    `
  });
}

function pageShell({ meta, event, body }) {
  const title = `${meta.title}${event ? " | Awnbeat" : ""}`;

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(meta.description)}">
  <link rel="canonical" href="${escapeHtml(meta.canonicalUrl)}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Awnbeat">
  <meta property="og:title" content="${escapeHtml(meta.title)}">
  <meta property="og:description" content="${escapeHtml(meta.description)}">
  <meta property="og:image" content="${escapeHtml(meta.image)}">
  <meta property="og:url" content="${escapeHtml(meta.canonicalUrl)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(meta.title)}">
  <meta name="twitter:description" content="${escapeHtml(meta.description)}">
  <meta name="twitter:image" content="${escapeHtml(meta.image)}">
  <style>
    @font-face {
      font-family: "Chopin";
      src: url("/fonts/Chopin-TrialVF-RomanVF-BF65b1d690f1fee.ttf") format("truetype");
      font-weight: 100 900;
      font-style: normal;
      font-display: swap;
    }

    :root {
      --ink: #1f241f;
      --muted: #687164;
      --line: rgba(31, 36, 31, 0.12);
      --green: #8cd9a6;
      --orange: #fa9959;
      --blue: #7acceb;
      --paper: rgba(255, 255, 255, 0.88);
    }

    * { box-sizing: border-box; letter-spacing: 0; }
    html { background: #fbfdf9; }
    body {
      min-height: 100vh;
      margin: 0;
      color: var(--ink);
      font-family: "Chopin", Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background:
        linear-gradient(180deg, rgba(140,217,166,0.18), rgba(250,153,89,0.10) 46%, rgba(122,204,235,0.16)),
        #fbfdf9;
    }

    body::before {
      position: fixed;
      inset: 0;
      z-index: -1;
      pointer-events: none;
      content: "";
      background-image: url("/logo.png"), url("/logo.png");
      background-repeat: repeat;
      background-size: 180px 180px;
      background-position: 0 0, 90px 90px;
      opacity: 0.035;
    }

    .event-shell {
      width: 100%;
      max-width: 480px;
      min-height: 100vh;
      margin: 0 auto;
      padding: 0 0 max(24px, env(safe-area-inset-bottom));
    }

    .event-card {
      min-height: 100vh;
      background: var(--paper);
      box-shadow: 0 24px 80px rgba(31, 36, 31, 0.12);
    }

    .event-hero {
      position: relative;
      min-height: 280px;
      background: #eef5ed;
      overflow: hidden;
    }

    .event-image {
      display: block;
      width: 100%;
      height: 320px;
      object-fit: cover;
    }

    .event-image-fallback {
      display: grid;
      place-items: center;
      height: 320px;
      background: linear-gradient(145deg, rgba(140,217,166,0.38), rgba(250,153,89,0.24), rgba(122,204,235,0.30));
    }

    .event-image-fallback img {
      width: 86px;
      opacity: 0.72;
    }

    .event-brand {
      position: absolute;
      left: 18px;
      top: max(18px, env(safe-area-inset-top));
      display: inline-flex;
      align-items: center;
      gap: 9px;
      padding: 9px 12px;
      border: 1px solid rgba(255, 255, 255, 0.54);
      border-radius: 999px;
      color: #fff;
      background: rgba(31, 36, 31, 0.28);
      backdrop-filter: blur(18px);
      font-size: 15px;
    }

    .event-brand img {
      width: 22px;
      height: 22px;
      object-fit: contain;
    }

    .event-content {
      display: grid;
      gap: 22px;
      padding: 26px 22px 32px;
    }

    .eyebrow {
      margin: 0;
      color: #4f7d5d;
      font-size: 13px;
      line-height: 1.2;
      text-transform: uppercase;
    }

    h1, h2, p { margin-top: 0; }
    h1 {
      margin-bottom: 0;
      font-size: clamp(36px, 12vw, 56px);
      font-weight: 250;
      line-height: 0.92;
    }

    h2 {
      margin-bottom: 0;
      font-size: 28px;
      font-weight: 250;
      line-height: 1;
    }

    .description {
      margin-bottom: 0;
      color: var(--muted);
      font-size: 18px;
      line-height: 1.45;
      white-space: pre-wrap;
    }

    .event-facts {
      display: grid;
      gap: 10px;
    }

    .event-facts div {
      display: grid;
      gap: 4px;
      padding: 14px 0;
      border-top: 1px solid var(--line);
    }

    .event-facts span,
    label span {
      color: var(--muted);
      font-size: 13px;
      line-height: 1.2;
    }

    .event-facts strong {
      font-size: 18px;
      font-weight: 360;
      line-height: 1.25;
    }

    .join-panel {
      display: grid;
      gap: 18px;
      padding: 20px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.74);
    }

    form {
      display: grid;
      gap: 14px;
    }

    label {
      display: grid;
      gap: 7px;
    }

    input,
    textarea {
      width: 100%;
      border: 1px solid rgba(31, 36, 31, 0.18);
      border-radius: 8px;
      padding: 14px 13px;
      color: var(--ink);
      background: #fff;
      font: inherit;
      font-size: 16px;
      outline: none;
    }

    textarea {
      min-height: 92px;
      resize: vertical;
    }

    input:focus,
    textarea:focus {
      border-color: #67ad7b;
      box-shadow: 0 0 0 3px rgba(140, 217, 166, 0.28);
    }

    button {
      min-height: 54px;
      border: 0;
      border-radius: 8px;
      padding: 0 18px;
      color: #1f241f;
      background: linear-gradient(90deg, var(--green), var(--blue));
      font: inherit;
      font-size: 19px;
      cursor: pointer;
    }

    button:disabled {
      cursor: wait;
      opacity: 0.72;
    }

    .form-message {
      min-height: 22px;
      margin: 0;
      color: var(--muted);
      font-size: 15px;
      line-height: 1.4;
    }

    .form-message.error { color: #9d3527; }
    .form-message.success { color: #2f7350; }

    .unavailable-state {
      display: grid;
      align-content: center;
      justify-items: start;
      min-height: 100vh;
      padding: 34px 24px;
      background: rgba(255, 255, 255, 0.78);
    }

    .unavailable-state .brand-mark {
      display: grid;
      place-items: center;
      width: 64px;
      height: 64px;
      margin-bottom: 22px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: #fff;
    }

    .brand-mark img {
      width: 38px;
      height: 38px;
      object-fit: contain;
    }

    .unavailable-state p:last-child {
      max-width: 320px;
      margin-bottom: 0;
      color: var(--muted);
      font-size: 18px;
      line-height: 1.45;
    }
  </style>
</head>
<body>
${body}
  <script>
    window.__AWNBEAT_EVENT__ = ${escapeJson(event)};

    const form = document.getElementById("join-form");
    const message = document.getElementById("form-message");

    if (form && message && window.__AWNBEAT_EVENT__) {
      form.addEventListener("submit", async event => {
        event.preventDefault();
        const button = form.querySelector("button");
        const formData = new FormData(form);
        const payload = {
          eventId: window.__AWNBEAT_EVENT__.id,
          name: formData.get("name"),
          phone: formData.get("phone"),
          notes: formData.get("notes")
        };

        message.className = "form-message";
        message.textContent = "";
        button.disabled = true;
        button.textContent = "Joining...";

        try {
          const response = await fetch("/api/guest-rsvp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          const result = await response.json().catch(() => ({}));

          if (!response.ok || !result.ok) {
            throw new Error(result.error || "Please check your details and try again.");
          }

          form.reset();
          message.className = "form-message success";
          message.textContent = "You are going. We saved your RSVP.";
        } catch (error) {
          message.className = "form-message error";
          message.textContent = error.message || "We could not save your RSVP. Please try again.";
        } finally {
          button.disabled = false;
          button.textContent = "Join";
        }
      });
    }
  </script>
</body>
</html>`;
}

module.exports = async function handler(req, res) {
  const rawEventId = String(req.query?.eventId || "").trim();
  const eventId = rawEventId.split("/")[0];

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=3600");

  if (!eventId) {
    res.statusCode = 404;
    res.end(unavailableHtml(""));
    return;
  }

  try {
    const event = await fetchPublicEvent(eventId);

    if (!event) {
      res.statusCode = 404;
      res.end(unavailableHtml(eventId));
      return;
    }

    const canonicalId = isUuid(eventId) ? eventId : event.id;
    res.statusCode = 200;
    res.end(eventHtml(event, canonicalId));
  } catch {
    res.statusCode = 500;
    res.end(unavailableHtml(eventId));
  }
};
