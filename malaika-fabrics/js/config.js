/**
 * MALAIKA FABRICS — Store Configuration
 * =========================================
 * This is the owner-editable configuration file.
 * Update WHATSAPP_NUMBER to your official WhatsApp business number.
 * 
 * Format: Country code + number, no spaces, no +, no dashes.
 * Example: Pakistan (+92) 300 1234567 → "923001234567"
 */

const CONFIG = {

  // ── WhatsApp Number (UPDATE THIS) ──────────────────────────
  // Replace with your actual WhatsApp Business number.
  // Format: country code + number (no +, no spaces, no dashes)
  WHATSAPP_NUMBER: "923488153311",  // ← OWNER: Update this number

  // ── Store Info ─────────────────────────────────────────────
  STORE_NAME:     "Malaika Fabrics",
  STORE_TAGLINE:  "",  // No tagline currently
  STORE_CURRENCY: "PKR",
  STORE_CURRENCY_SYMBOL: "Rs.",

  // ── Contact Info ───────────────────────────────────────────
  STORE_EMAIL:    "hello@malaikafabrics.com",
  STORE_PHONE:    "+92 348 815 3311",
  STORE_ADDRESS:  "Pakistan",

  WHATSAPP_NUMBER_DISPLAY: "03488153311",
  WHATSAPP_NUMBER_LINK: "923488153311",
  WHATSAPP_MESSAGE: "Hi Malaika Fabrics, I’m interested in your collection and would like more information.",

  // ── Intro Settings ─────────────────────────────────────────
  INTRO_DURATION_MS: 1800,
  INTRO_ENABLED:     true,

  // ── Social Links ───────────────────────────────────────────
  SOCIAL: {
    instagram: "https://instagram.com/malaikafabrics",
    facebook:  "https://facebook.com/malaikafabrics",
    whatsapp:  "https://wa.me/923488153311",
  },

  // ── Supabase Configuration ─────────────────────────────────
  SUPABASE_URL: "https://utqnvqfxvdjlbbxtxipq.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_A3J8YA18pDMPugwjL_1Xwg_Ykd_J6fA"
};

// Export for use across modules
window.MF_CONFIG = CONFIG;
