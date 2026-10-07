const { sendConnectPage } = require("./_connect-page");

// Stripe Connect onboarding refresh_url (/payments/connect/refresh).
// Stripe sends people here when a setup link has expired or was already used.
module.exports = function handler(req, res) {
  sendConnectPage(res, {
    title: "Link expired | Awnbeat",
    heading: "Link expired",
    body: "This setup link expired or was already used. Head back to Awnbeat and tap Start Setup or Continue Setup to get a fresh link.",
    hint: "Still in this window? Tap Done at the top to go back."
  });
};
