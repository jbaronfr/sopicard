import type card from "virtual:sopicard";

/**
 * Shape-complete fake card data for tests — typed against the real
 * `virtual:sopicard` module, so any change to the pipeline's output shape
 * fails typecheck here too. Deliberately contains no real contact info.
 */
export const mockCard: typeof card = {
  siteUrl: "https://card.example.com",
  lang: "en",
  name: "Test Person",
  role: "Software Engineer",
  company: "Test Corp",
  location: "Test City",
  bio: "A person who tests cards.",
  initials: "TP",
  accent: "#4f46e5",
  darkAccent: "#818cf8",
  bgLight: "#eef0f6",
  bgDark: "#0d0d14",
  avatar: { type: "monogram" },
  qrSvg:
    '<svg viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h21v21H0z" fill="currentColor"/></svg>',
  qrLabel: "QR code linking to https://card.example.com",
  links: [
    { kind: "email", label: "Email", icon: "mail", user: "test", domain: "example.com" },
    { kind: "phone", label: "Call", icon: "phone", cc: "44", number: "7700900123" },
    { kind: "url", label: "Website", value: "https://example.com", icon: "globe" },
  ],
  jsonLd: "{}",
};
