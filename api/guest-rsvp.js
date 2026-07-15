const { fetchPublicEvent, isUuid, upsertGuestRsvp } = require("./_supabase");

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

function normalizePhone(value) {
  const raw = String(value || "").trim();
  const digits = raw.replace(/\D/g, "");

  if (!digits) return null;
  if (raw.startsWith("+") && digits.length >= 8 && digits.length <= 15) return `+${digits}`;
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (digits.length >= 8 && digits.length <= 15) return `+${digits}`;

  return null;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    if (req.body && typeof req.body === "object") {
      resolve(req.body);
      return;
    }

    if (typeof req.body === "string") {
      try {
        resolve(JSON.parse(req.body));
      } catch {
        reject(new Error("Please submit valid JSON"));
      }
      return;
    }

    let data = "";

    req.on("data", chunk => {
      data += chunk;
      if (data.length > 32 * 1024) {
        reject(new Error("Request body is too large"));
        req.destroy();
      }
    });

    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        reject(new Error("Please submit valid JSON"));
      }
    });

    req.on("error", reject);
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  try {
    const body = await readBody(req);
    const eventId = String(body.eventId || "").trim();
    const name = String(body.name || "").trim().replace(/\s+/g, " ");
    const phoneE164 = normalizePhone(body.phone);
    const notes = String(body.notes || "").trim();

    if (!isUuid(eventId)) {
      return sendJson(res, 400, { error: "Invalid event link" });
    }

    if (!name) {
      return sendJson(res, 400, { error: "Name is required" });
    }

    if (!phoneE164) {
      return sendJson(res, 400, { error: "Enter a valid phone number" });
    }

    const event = await fetchPublicEvent(eventId);
    if (!event) {
      return sendJson(res, 404, { error: "Event unavailable" });
    }

    const rsvp = await upsertGuestRsvp({
      eventId,
      name,
      phoneE164,
      notes: notes || null
    });

    return sendJson(res, 200, { ok: true, rsvp });
  } catch (error) {
    return sendJson(res, 500, {
      error: "We could not save your RSVP. Please try again.",
      detail: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};
