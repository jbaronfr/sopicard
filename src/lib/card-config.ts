/**
 * Types for card.config.ts — the single file users edit to customize their card.
 * Pure types + a define helper, no runtime deps, so vite.config.ts can import it in Node.
 */

/** Email is stored in two parts and only assembled at runtime in the browser,
 *  so the prerendered HTML never contains a harvestable `mailto:` address. */
export interface EmailParts {
  user: string;
  domain: string;
}

/** Phone is stored as country code + digits and only assembled at runtime,
 *  so the prerendered HTML never contains a harvestable `tel:` number. */
export interface PhoneParts {
  /** Country calling code without "+", e.g. "33" */
  countryCode: string;
  /** Digits only, no spaces or punctuation, e.g. "612345678" */
  number: string;
}

export type CardLink =
  | { kind: "email"; label?: string; icon?: string }
  | { kind: "phone"; label?: string; icon?: string }
  | { kind: "url"; label: string; value: string; icon?: string };

export interface CardConfig {
  /** Canonical public URL of the deployed card, e.g. "https://card.example.com" or "https://you.github.io/sopicard". No trailing slash. */
  siteUrl: string;
  person: {
    name: string;
    role: string;
    company?: string;
    location?: string;
    bio?: string;
    /** "monogram" (default, generated from initials + accent, zero requests) or a photo in public/. */
    avatar?: { type: "monogram" } | { type: "image"; src: string; alt: string };
  };
  contact: {
    email?: EmailParts;
    phone?: PhoneParts;
  };
  /** Rows on the back of the card. email/phone kinds read from `contact`. */
  links?: CardLink[];
  theme?: {
    /** Accent color, any CSS color. Applied to buttons, avatar, focus rings, QR frame. */
    accent?: string;
    darkAccent?: string;
    backgroundLight?: string;
    backgroundDark?: string;
  };
  /** What the QR code on the back encodes: "site" (default, safe to print) or "vcard" (embeds contact data). */
  qrTarget?: "site" | "vcard";
  lang?: string;
}

export function defineCardConfig(config: CardConfig): CardConfig {
  return config;
}
