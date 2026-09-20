// Public fallback deliberately fetches no private entity metadata.
const allowedKinds = new Set(["communities", "groups", "posts", "profile", "chats"]);
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
  res.setHeader("Content-Security-Policy", "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'");
  return res.status(200).send(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Open in Awnbeat</title><style>body{margin:0;background:#10241c;color:#fff;font:18px system-ui;display:grid;place-items:center;min-height:100svh}main{max-width:32rem;padding:2rem;text-align:center}h1{font-size:2rem}p{line-height:1.6}a{display:block;margin:1rem 0;padding:1rem;border-radius:1rem;background:#c8f197;color:#10241c;text-decoration:none;font-weight:650}a.secondary{background:transparent;color:#fff;border:1px solid #718078}</style></head><body><main><h1>Open in Awnbeat</h1><p>Open the app and sign in to view this content. Private content is available only to people who have access.</p><a href="${url}">Open Awnbeat</a><a class="secondary" href="https://apps.apple.com/us/app/awnbeat/id6789319121">Get Awnbeat</a><a class="secondary" href="/">Back to home</a></main></body></html>`);
};
