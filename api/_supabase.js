const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://fbdlbirgrrikprhqvclz.supabase.co";

const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZiZGxiaXJncnJpa3ByaHF2Y2x6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMTk4NzQsImV4cCI6MjA5NjU5NTg3NH0.lgSzIGS928b5NS_FKCfFVOw12Du1RCQqr53JGxKUDHI";

const EVENT_COLUMNS = [
  "id",
  "title",
  "description",
  "image_url",
  "start_time",
  "end_time",
  "timezone",
  "address",
  "city",
  "state",
  "is_free",
  "price_cents",
  "currency",
  "capacity",
  "attendee_count",
  "visibility",
  "status",
  "event_type",
  "public_link_url",
  "public_link_slug"
].join(",");

function supabaseHeaders(extra = {}) {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    ...extra
  };
}

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value || "");
}

async function fetchPublicEvent(eventId) {
  const trimmedEventId = String(eventId || "").trim();

  if (!trimmedEventId) return null;

  const params = new URLSearchParams({
    select: EVENT_COLUMNS,
    visibility: "eq.public",
    status: "eq.published",
    limit: "1"
  });

  if (isUuid(trimmedEventId)) {
    params.set("id", `eq.${trimmedEventId}`);
  } else {
    params.set("public_link_slug", `eq.${trimmedEventId}`);
  }

  const response = await fetch(`${SUPABASE_URL}/rest/v1/events?${params.toString()}`, {
    headers: supabaseHeaders({ Accept: "application/json" })
  });

  if (!response.ok) {
    throw new Error(`Event lookup failed with ${response.status}`);
  }

  const rows = await response.json();
  return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
}

async function upsertGuestRsvp({ eventId, name, phoneE164, notes }) {
  const payload = {
    event_id: eventId,
    name,
    phone_e164: phoneE164,
    status: "going",
    guest_count: 0,
    notes: notes || null
  };

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/guest_event_rsvps?on_conflict=event_id,phone_e164`,
    {
      method: "POST",
      headers: supabaseHeaders({
        "Content-Type": "application/json",
        Accept: "application/json",
        Prefer: "resolution=merge-duplicates,return=representation"
      }),
      body: JSON.stringify(payload)
    }
  );

  const text = await response.text();
  let body = null;

  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = { message: text };
    }
  }

  if (!response.ok) {
    const message = body?.message || body?.hint || `Guest RSVP failed with ${response.status}`;
    throw new Error(message);
  }

  return Array.isArray(body) ? body[0] : body;
}

module.exports = {
  fetchPublicEvent,
  isUuid,
  upsertGuestRsvp
};
