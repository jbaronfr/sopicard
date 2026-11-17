# sopicard

A professional digital business card: two-sided, flip-animated, printable, and
deployable in one click as a GitHub template. Built with **SolidBase (SolidJS)** +
**Pico CSS**, fully driven by a single typed config file (`card.config.ts`).

![Mistral](https://builtwithvibes.io/badge/light/mistral)
![stack](https://img.shields.io/badge/stack-SolidBase%20%2B%20Pico%20CSS-4f46e5)

## Use this template

Click **Use this template** on GitHub, or open:

```
https://github.com/new?template_name=sopicard&template_owner=YOUR_GITHUB_USERNAME
```

(For the button/URL to work, the repository owner must enable _Settings → Template
repository_.)

Then:

1. Edit **`card.config.ts`** — name, role, links, colors, QR target. That's the whole
   customization surface; types give you autocomplete.
2. Commit to `main`. The included GitHub Actions workflow builds the static site and
   deploys it to GitHub Pages (enable _Settings → Pages → Build and deployment →
   GitHub Actions_).
3. Your card is live at `https://<you>.github.io/<repo>/`.

## Run locally

Requires Node 24+ (its bundled npm 11 matches the committed lockfile; older Node lines
ship npm 10, whose stricter peer resolution rejects it); CI builds with Node 24.

```bash
npm install
npm run dev      # vite dev server
npm run build    # full SSG: prerenders every page into dist/client, no server bundle
npm run preview  # serve the built static site
npm test         # component tests (vitest; watch mode locally, single run in CI)
npm run lint     # lint phase: ESLint + Stylelint + Prettier + tsc (also runs in CI before deploy)
npm run lint:fix # auto-fix everything fixable
```

`npm run build` produces a **pure static site**: SolidBase prerenders all routes into
`dist/client`, then the server bundle used for rendering is deleted — there is no server
to deploy, run, or keep warm. `dist/client` can be hosted anywhere (GitHub Pages, Netlify,
Cloudflare Pages, S3…).

For a GitHub Pages _project_ site, build with `BASE_URL=/<repo>/ npm run build`.

## Linting

`npm run lint` is the lint phase — it runs in CI before every deploy and locally on demand.
It enforces frontend best practices with:

| Tool                          | Config                | Enforces                                                                   |
| ----------------------------- | --------------------- | -------------------------------------------------------------------------- |
| ESLint (@antfu/eslint-config) | `eslint.config.js`    | JS/TS correctness, unused imports, typed rules, unicorn, import ordering   |
| eslint-plugin-solid           | `eslint.config.js`    | SolidJS reactivity & JSX (`no-destructure`, `prefer-for`, `reactivity`, …) |
| eslint-plugin-jsx-a11y        | `eslint.config.js`    | accessibility of the rendered markup                                       |
| eslint-plugin-sonarjs         | `eslint.config.js`    | bug-catching / code-smell rules (`recommended` preset)                     |
| Stylelint                     | `stylelint.config.js` | SCSS correctness (`standard-scss`) + property order (`clean-order`)        |
| Prettier                      | `.prettierrc.json`    | consistent formatting (`format:check`)                                     |
| `tsc --noEmit`                | `tsconfig.json`       | type checking (`typecheck`)                                                |

`npm run lint:fix` auto-fixes everything that is fixable (ESLint `--fix`, Stylelint `--fix`,
Prettier `--write`).

## Testing

`npm test` runs the component tests with **vitest** and **@solidjs/testing-library**
(the official stack from the Solid testing guide — `@solidjs/vite-plugin` injects the
Solid/vitest wiring automatically; watch mode locally, single run in CI). The suite lives
in `src/components/Card.test.tsx` and locks in the behaviour that matters most here: the
flip interaction (`inert` moving between faces, focus transfer to the revealed face), the
copy-to-clipboard flow, the vCard download link, the print window (rows swap to real
clickable anchors on `beforeprint` and back on `afterprint`), and the anti-scraping
guarantee — the idle DOM must never contain `mailto:`, `tel:` or the raw address. Tests
run against a shape-typed fake card (`src/test/mock-card.ts`), so they never touch your
real contact data.

## Features

- **Two sides, CSS flip** — click/tap, horizontal swipe, or keyboard (`Tab` + `Enter`)
  flips the card with a pure-CSS 3D transform. With `prefers-reduced-motion`, the flip is
  instant (no animation).
- **Adaptive, zero scrollbars** — on desktop the card keeps real ISO 7810 ID-1
  proportions (85.6 × 54) and floats centered like a physical card; in portrait it
  rotates and fills the screen. The scene width is capped against `100dvh`, so the card
  always fits — no scrollbars ever.
- **Print-ready** — `@media print` + `@page { size: 171.2mm 54mm; margin: 0 }` prints both
  sides on one page: a strip of exactly 2 × ISO 7810 ID-1 cards, front left, back right,
  cut along the dashed middle line. All print sizing is absolute mm and colors stay exact
  (`print-color-adjust: exact`). Use the print dialog's "pages per sheet" to tile several
  strips on an A4 sheet, or pick 171.2 × 54 mm paper to print one strip at 100%.
- **Unscrapable contact links** — the prerendered HTML and the idle DOM never contain
  `mailto:`, `tel:` or the raw address; they are assembled at runtime only when clicked —
  or during the print window, where rows swap to real anchors so the printed PDF gets
  clickable links. Each row also has a copy button. (Note: the JSON-LD block and the
  downloadable `contact.vcf` necessarily contain the contact data — that's what makes
  them work.)
- **QR code + Save contact** — the QR is generated at build time as inline SVG (no
  requests); "Save contact" downloads a vCard generated from the same config.
- **schema.org everywhere** — microdata (`itemscope`/`itemprop`) on the HTML tags plus a
  full JSON-LD `@graph` (`ProfilePage` → `Person` with `worksFor`, `address`, `sameAs`,
  contact points).
- **Lighthouse / a11y oriented** — verified 100/100/100/100 (performance, accessibility,
  best-practices, SEO) with headless Chrome. Stylesheet inlined into the HTML (no render-blocking
  requests), system font stack, zero images by default (generated SVG monogram), semantic
  landmarks, `aria-pressed` flip buttons, visible focus rings, `role="status"` for copy
  feedback, dark mode via `prefers-color-scheme`, `color-scheme` + `theme-color` meta.
- **Auto light/dark + accent** — accent and background colors come from the config and are
  injected as CSS variables; light/dark follows the OS.

## Project structure

```
├── card.config.ts          ← the only file you edit
├── vite.config.ts          ← SolidBase + build-time assets (QR, vCard, favicon, OG image, JSON-LD)
├── vitest.config.ts        ← standalone test config (stubs virtual:sopicard)
├── theme/Layout.tsx        ← minimal SolidBase theme (inlines the CSS)
├── src/
│   ├── Document.tsx        ← <head>: meta, OG + Twitter, theme-color, JSON-LD
│   ├── app.tsx             ← router + SolidBaseRoot
│   ├── lib/card-config.ts  ← types for card.config.ts (autocomplete)
│   ├── components/Card.tsx ← the flip card (front/back, links, QR, vCard)
│   │   └── Card.test.tsx   ← component tests
│   ├── routes/index.tsx    ← the page
│   ├── test/mock-card.ts   ← shape-typed fake card for tests
│   └── styles/
│       ├── global.scss     ← Pico + accent mapping, flip, responsive
│       └── print.scss      ← @media print: one-page 2-up ID-1 strip (inlined after global)
├── public/
│   ├── robots.txt          ← hand-maintained (SolidBase's generated one is disabled)
│   └── generated/          ← build output: contact.vcf, favicon.svg, og.svg (gitignored)
└── .github/workflows/deploy.yml
```

## Customizing

Everything lives in `card.config.ts`: `siteUrl`, `person` (name/role/company/location/bio/
`avatar` — use `{ type: "image", src: "/avatar.jpg", alt: "…" }` with a file in `public/`
to use a photo instead of the generated monogram), `contact` (email/phone stored in parts),
`links`, `theme` (`accent`, `darkAccent`, `backgroundLight`, `backgroundDark` — any CSS
colors, injected as CSS variables), `qrTarget` (`"site"` or `"vcard"`), and `lang` (the
page language — feeds `<html lang>`, `og:locale` and the JSON-LD).
