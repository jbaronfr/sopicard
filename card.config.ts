import { defineCardConfig } from "./src/lib/card-config";

/**
 * ┌────────────────────────────────────────────────────────────┐
 * │  THE ONLY FILE YOU NEED TO EDIT                            │
 * │  Everything on the card (text, links, colors, QR, vCard,  │
 * │  schema.org data, SEO meta) is generated from this config. │
 * └────────────────────────────────────────────────────────────┘
 */
export default defineCardConfig({
  // Canonical URL where this card will be hosted (used for canonical link,
  // Open Graph, QR code and schema.org). Change to your GitHub Pages URL.
  siteUrl: "https://example.com",

  person: {
    name: "Ada Lovelace",
    role: "Software Engineer",
    company: "Analytical Engines Ltd",
    location: "London, UK",
    bio: "I build delightful things for the web. Tap the card to flip it for contact links.",
    // avatar: { type: "image", src: "/avatar.jpg", alt: "Portrait of Ada Lovelace" }
    // Default is a generated monogram — drop a file in public/ and use the line above.
    avatar: { type: "monogram" },
  },

  contact: {
    // Split on purpose: the address is never present in the HTML source,
    // it is assembled at runtime when a visitor clicks "Email" / "Copy".
    email: { user: "ada", domain: "example.com" },
    phone: { countryCode: "44", number: "7700900123" },
  },

  links: [
    { kind: "email", label: "Email" },
    { kind: "phone", label: "Call" },
    { kind: "url", label: "Website", value: "https://example.com", icon: "globe" },
    { kind: "url", label: "GitHub", value: "https://github.com/example", icon: "github" },
    { kind: "url", label: "LinkedIn", value: "https://linkedin.com/in/example", icon: "linkedin" },
  ],

  theme: {
    accent: "#4f46e5", // indigo — any CSS color works
    darkAccent: "#818cf8",
    backgroundLight: "#eef0f6",
    backgroundDark: "#0d0d14",
  },

  // "site" = QR opens this page (safe). "vcard" = QR embeds the full contact.
  qrTarget: "site",

  lang: "en",
});
