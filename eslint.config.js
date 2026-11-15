import js from "@eslint/js";
import globals from "globals";
import jsxA11y from "eslint-plugin-jsx-a11y";
import solid from "eslint-plugin-solid";
import tseslint from "typescript-eslint";

/**
 * Lint phase for sopicard — frontend best practices:
 *  - eslint recommended + typescript-eslint (typed rules)
 *  - eslint-plugin-solid (SolidJS reactivity / JSX correctness)
 *  - eslint-plugin-jsx-a11y (accessibility of the rendered markup)
 *
 * Run with `npm run lint` (CI gate) or `npm run lint:js:fix` to auto-fix.
 */
export default tseslint.config(
  {
    ignores: ["dist/**", "public/generated/**", "node_modules/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  solid.configs["flat/typescript"],
  jsxA11y.flatConfigs.recommended,
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
