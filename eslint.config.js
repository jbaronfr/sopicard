import antfu from "@antfu/eslint-config";
import solid from "eslint-plugin-solid";
import sonarjs from "eslint-plugin-sonarjs";
import globals from "globals";

// antfu registers the "solid" plugin itself (`solid: true` below), and ESLint
// rejects a second `plugins` entry for the same name unless it is the exact
// same object — the plugin's own configs reference a different module instance
// (dual ESM/CJS build), so strip `plugins` here and let the rules resolve
// against antfu's registration.
const solidFlatTypescript = {
  name: "sopicard/solid-flat-typescript",
  ...solid.configs["flat/typescript"],
};
delete solidFlatTypescript.plugins;

/**
 * Lint phase for sopicard — frontend best practices:
 *  - @antfu/eslint-config base (JS/TS/JSX/Node/unicorn/perfectionist/...)
 *    with the SolidJS rules (`solid: true`) and jsx-a11y enabled (`jsx.a11y`)
 *  - eslint-plugin-sonarjs `recommended` preset (bug-catching / code-smell rules)
 *  - eslint-plugin-solid `flat/typescript` (v0.19, full rule set) on top of
 *    antfu's curated solid rules — the heart of this project
 *
 * Formatting is owned by Prettier (`npm run format`, see .prettierrc.json), so
 * antfu's own stylistic and formatter layers are disabled to avoid fighting it.
 *
 * Run with `npm run lint` (CI gate) or `npm run lint:js:fix` to auto-fix.
 */
export default antfu(
  {
    solid: true,
    jsx: { a11y: true },
    stylistic: false,
    formatters: false,
    // vitest rules for *.test.ts(x) files (see vitest.config.ts)
    test: true,
    ignores: ["public/generated/**"],
  },
  sonarjs.configs.recommended,
  solidFlatTypescript,
  {
    languageOptions: {
      // src/ runs in the browser, root config files run in Node.
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      // innerHTML is only ever used for trusted, build-time-generated markup
      // (inline icon paths, QR SVG, JSON-LD, inlined CSS — see vite.config.ts),
      // never for user input, so the rule is disabled project-wide.
      "solid/no-innerhtml": "off",
    },
  },
);
