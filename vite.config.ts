import type { Plugin } from "vite";
import type { CardLink } from "./src/lib/card-config";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { createSolidBase, defineTheme } from "@kobalte/solidbase/config";
import solid from "@solidjs/vite-plugin";
import QRCode from "qrcode";
import { defineConfig } from "vite";
import cardConfig from "./card.config";

/* ------------------------------------------------------------------ */
/*  Derive static assets from card.config.ts at config-load time.      */
/*  Everything computed here is baked into the prerendered HTML, so    */
/*  the page ships zero build-time secrets and near-zero client JS.    */
/* ------------------------------------------------------------------ */

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const genDir = path.join(rootDir, "public", "generated");
fs.mkdirSync(genDir, { recursive: true });

// strip trailing slashes without a backtracking-prone regex
let siteUrl = cardConfig.siteUrl;
while (siteUrl.endsWith("/")) siteUrl = siteUrl.slice(0, -1);
const { person, contact, theme } = cardConfig;
const accent = theme?.accent ?? "#4f46e5";
const darkAccent = theme?.darkAccent ?? accent;
const bgLight = theme?.backgroundLight ?? "#eef0f6";
const bgDark = theme?.backgroundDark ?? "#0d0d14";
const lang = cardConfig.lang ?? "en";

const companySuffix = person.company ? ` at ${person.company}` : "";
const personLine = `${person.name}, ${person.role}${companySuffix}`;

const email = contact.email ? `${contact.email.user}@${contact.email.domain}` : undefined;
const phoneE164 = contact.phone
  ? `+${contact.phone.countryCode}${contact.phone.number}`
  : undefined;

if ((cardConfig.links ?? []).some((l) => l.kind === "email") && !email) {
  throw new Error('card.config.ts: a link of kind "email" requires contact.email');
}
if ((cardConfig.links ?? []).some((l) => l.kind === "phone") && !phoneE164) {
  throw new Error('card.config.ts: a link of kind "phone" requires contact.phone');
}

const initials = person.name
  .split(/\s+/)
  .map((w) => w[0]?.toUpperCase() ?? "")
  .slice(0, 2)
  .join("");

/* --- vCard (RFC 6350) ------------------------------------------------ */
const escV = (s: string) =>
  s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
const vcfLines = [
  "BEGIN:VCARD",
  "VERSION:4.0",
  `N:${escV(person.name)};;;;`,
  `FN:${escV(person.name)}`,
  person.role ? `TITLE:${escV(person.role)}` : null,
  person.company ? `ORG:${escV(person.company)}` : null,
  email ? `EMAIL;TYPE=INTERNET:${escV(email)}` : null,
  phoneE164 ? `TEL;TYPE=CELL:${phoneE164}` : null,
  `URL:${siteUrl}`,
  person.location ? `ADR;TYPE=WORK:;;;${escV(person.location)};;;` : null,
  person.bio ? `NOTE:${escV(person.bio)}` : null,
  `UID:${siteUrl}#person`,
  `REV:${new Date().toISOString()}`,
  "END:VCARD",
].filter(Boolean);
const vcf = `${vcfLines.join("\r\n")}\r\n`;
fs.writeFileSync(path.join(genDir, "contact.vcf"), vcf, "utf8");

/* --- QR code (inline SVG, generated at build time) ------------------- */
const qrText = cardConfig.qrTarget === "vcard" ? vcf : siteUrl;
const qrSvg = await QRCode.toString(qrText, {
  type: "svg",
  margin: 0,
  errorCorrectionLevel: "M",
  color: { dark: "#111827", light: "#00000000" },
});

/* --- favicon + og:image (generated monogram card) -------------------- */
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${accent}"/><stop offset="1" stop-color="${darkAccent}"/></linearGradient></defs><rect width="64" height="64" rx="14" fill="url(#g)"/><text x="32" y="42" font-family="system-ui,sans-serif" font-size="28" font-weight="700" fill="#fff" text-anchor="middle">${initials}</text></svg>`;
fs.writeFileSync(path.join(genDir, "favicon.svg"), faviconSvg, "utf8");

const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${accent}"/><stop offset="1" stop-color="${darkAccent}"/></linearGradient></defs><rect width="1200" height="630" fill="${bgDark}"/><rect x="90" y="105" width="1020" height="420" rx="36" fill="#16161d" stroke="url(#g)" stroke-width="6"/><circle cx="240" cy="315" r="90" fill="url(#g)"/><text x="240" y="338" font-family="system-ui,sans-serif" font-size="72" font-weight="700" fill="#fff" text-anchor="middle">${initials}</text><text x="380" y="290" font-family="system-ui,sans-serif" font-size="56" font-weight="700" fill="#f2f2f5">${person.name}</text><text x="380" y="360" font-family="system-ui,sans-serif" font-size="34" fill="#a1a1ae">${[person.role, person.company].filter(Boolean).join(" · ")}</text></svg>`;
fs.writeFileSync(path.join(genDir, "og.svg"), ogSvg, "utf8");

/* --- normalized links for the client (no raw mailto:/tel: in HTML) --- */
const DEFAULT_ICONS: Record<string, string> = { email: "mail", phone: "phone", url: "globe" };
const DEFAULT_LABELS: Record<string, string> = { email: "Email", phone: "Call", url: "Link" };
interface NormalizedLink {
  kind: CardLink["kind"];
  label: string;
  icon: string;
  user?: string;
  domain?: string;
  cc?: string;
  number?: string;
  value?: string;
}
const links: NormalizedLink[] = (cardConfig.links ?? []).map((l) => ({
  kind: l.kind,
  label: l.label ?? DEFAULT_LABELS[l.kind],
  icon: l.icon ?? DEFAULT_ICONS[l.kind],
  user: l.kind === "email" ? contact.email!.user : undefined,
  domain: l.kind === "email" ? contact.email!.domain : undefined,
  cc: l.kind === "phone" ? contact.phone!.countryCode : undefined,
  number: l.kind === "phone" ? contact.phone!.number : undefined,
  value: l.kind === "url" ? l.value : undefined,
}));

/* --- schema.org JSON-LD ---------------------------------------------- */
const jsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfilePage",
      "@id": `${siteUrl}#page`,
      url: siteUrl,
      name: `${person.name} — ${person.role}`,
      description: person.bio ?? personLine,
      inLanguage: lang,
      mainEntity: { "@id": `${siteUrl}#person` },
    },
    {
      "@type": "Person",
      "@id": `${siteUrl}#person`,
      name: person.name,
      jobTitle: person.role,
      ...(person.company
        ? { worksFor: { "@type": "Organization", name: person.company, url: siteUrl } }
        : {}),
      ...(person.location
        ? { address: { "@type": "PostalAddress", addressLocality: person.location } }
        : {}),
      url: siteUrl,
      image: `${siteUrl}/generated/og.svg`,
      ...(email ? { email: `mailto:${email}` } : {}),
      ...(phoneE164 ? { telephone: phoneE164 } : {}),
      ...(person.bio ? { description: person.bio } : {}),
      sameAs: links.filter((l) => l.kind === "url").map((l) => l.value),
    },
  ],
});

/* --- data exposed to the app as virtual:sopicard ---------------------- */
const cardData = {
  siteUrl,
  lang,
  name: person.name,
  role: person.role,
  company: person.company ?? null,
  location: person.location ?? null,
  bio: person.bio ?? null,
  initials,
  accent,
  darkAccent,
  bgLight,
  bgDark,
  avatar: person.avatar ?? { type: "monogram" as const },
  qrSvg,
  qrLabel:
    cardConfig.qrTarget === "vcard"
      ? "QR code containing the vCard contact"
      : `QR code linking to ${siteUrl}`,
  links,
  jsonLd,
};

function sopicardVirtual(): Plugin {
  return {
    name: "virtual:sopicard",
    resolveId(id) {
      if (id === "virtual:sopicard") return id;
    },
    load(id) {
      if (id === "virtual:sopicard") return `export default ${JSON.stringify(cardData)};`;
    },
  };
}

/**
 * The prerender step needs the SSR bundle at build time, but the deployable
 * artifact is 100% static. This hook runs after SolidBase's prerender
 * (plugins run in array order) and deletes the server output, leaving only
 * `dist/client` — pure client-side SSG, no server to deploy or run.
 */
function stripServerBundle(): Plugin {
  return {
    name: "sopicard:strip-server",
    apply: "build",
    buildApp: {
      order: "post",
      async handler(builder) {
        const ssr = builder.environments.ssr;
        if (!ssr) return;
        const serverOut = path.resolve(process.cwd(), ssr.config.build.outDir);
        fs.rmSync(serverOut, { recursive: true, force: true });
        // vite manifest is only consumed by the server bundle
        fs.rmSync(path.join(process.cwd(), "dist/client/.vite"), { recursive: true, force: true });
        builder.environments.client.logger.info(
          `[sopicard] removed server bundle — dist/client is a pure static site`,
        );
      },
    },
  };
}

/* ------------------------------------------------------------------ */

const cardTheme = defineTheme({
  componentsPath: import.meta.resolve("./theme"),
});
const solidBase = createSolidBase(cardTheme);

export default defineConfig({
  // For GitHub Pages project sites (https://user.github.io/<repo>), set BASE_URL=/<repo>/
  base: process.env.BASE_URL ?? "/",
  plugins: [
    sopicardVirtual(),
    solidBase.plugin({
      title: `${person.name} — ${person.role}`,
      description: person.bio ?? `${personLine}. Digital business card.`,
      siteUrl,
      lang,
      robots: true,
      sitemap: false,
      llms: false,
      prerender: true, // full SSG into dist/client
    }),
    solid(solidBase.startConfig()),
    stripServerBundle(),
  ],
});
