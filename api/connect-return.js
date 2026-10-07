const { sendConnectPage } = require("./_connect-page");

// Stripe Connect onboarding return_url (/payments/connect/return).
// Stripe sends people here when they leave setup. It does NOT mean payouts are active:
// Stripe may still be verifying details, so the app checks the real status.
module.exports = function handler(req, res) {
  sendConnectPage(res, {
    title: "Setup submitted | Awnbeat",
    heading: "Setup submitted",
    body: "Your payout details were sent to Stripe. Head back to Awnbeat to check your status. Stripe may need some time to verify them or ask for a few more details.",
    hint: "Still in this window? Tap Done at the top to go back."
  });
};
