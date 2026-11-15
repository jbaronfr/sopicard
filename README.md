# sopicard

A professional digital business card: two-sided, flip-animated, printable, and
deployable in one click as a GitHub template. Built with **SolidBase (SolidJS)** +
**Pico CSS**, fully driven by a single typed config file (`card.config.ts`).

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

```bash
npm install
npm run dev      # vite dev server
npm run build    # full SSG: prerenders every page into dist/client, no server bundle
npm run preview  # serve the built static site
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

| Tool                       | Config                | Enforces                                                                   |
| -------------------------- | --------------------- | -------------------------------------------------------------------------- |
| ESLint + typescript-eslint | `eslint.config.js`    | JS/TS correctness, unused imports, typed rules                             |
| eslint-plugin-solid        | `eslint.config.js`    | SolidJS reactivity & JSX (`no-destructure`, `prefer-for`, `reactivity`, …) |
| eslint-plugin-jsx-a11y     | `eslint.config.js`    | accessibility of the rendered markup                                       |
| Stylelint                  | `stylelint.config.js` | SCSS correctness (`stylelint-config-standard-scss`)                        |
| Prettier                   | `.prettierrc.json`    | consistent formatting (`format:check`)                                     |
| `tsc --noEmit`             | `tsconfig.json`       | type checking (`typecheck`)                                                |

`npm run lint:fix` auto-fixes everything that is fixable (ESLint `--fix`, Stylelint `--fix`,
Prettier `--write`).

## Features

- **Two sides, CSS flip** — click/tap or keyboard (`Tab` + `Enter`) flips the card with a
  pure-CSS 3D transform. With `prefers-reduced-motion`, it crossfades instead.
- **Adaptive, zero scrollbars** — on desktop the card keeps real ISO 7810 ID-1
  proportions (85.6 × 54) and floats centered like a physical card; in portrait it
  rotates and fills the screen. `100dvh` + `overflow: clip`, so no scrollbars ever.
- **Print-ready** — `@media print` + `@page { size: 85.6mm 54mm }` prints the front on
  page 1 and the back on page 2, colors exact. Add ~3 mm bleed in your printer driver if
  you print edge-to-edge.
- **Unscrapable contact links** — the HTML source never contains `mailto:`, `tel:` or raw
  link hrefs; they are assembled at runtime only when clicked. Each row also has a copy
  button. (Note: the JSON-LD block and the downloadable `contact.vcf` necessarily contain
  the contact data — that's what makes them work.)
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
├── vite.config.ts          ← SolidBase + build-time asset generation (QR, vCard, favicon, JSON-LD)
├── theme/Layout.tsx        ← minimal SolidBase theme (inlines the CSS)
├── src/
│   ├── Document.tsx        ← <head>: meta, OG, theme-color, JSON-LD
│   ├── app.tsx             ← router + SolidBaseRoot
│   ├── components/Card.tsx ← the flip card (front/back, links, QR, vCard)
│   ├── routes/index.tsx    ← the page
│   └── styles/global.css   ← Pico overrides, flip, responsive, print
└── .github/workflows/deploy.yml
```

## Customizing

Everything lives in `card.config.ts`: `siteUrl`, `person` (name/role/company/location/bio/
`avatar` — use `{ type: "image", src: "/avatar.jpg", alt: "…" }` with a file in `public/`
to use a photo instead of the generated monogram), `contact` (email/phone stored in parts),
`links`, `theme.accent`, and `qrTarget` (`"site"` or `"vcard"`).
