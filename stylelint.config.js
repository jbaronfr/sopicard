/** @type {import("stylelint").Config} */
export default {
  extends: [
    // error-catching rules (unknown properties, duplicates, invalid values, ...)
    "stylelint-config-recommended",
    // conventions + SCSS support on top of recommended
    "stylelint-config-standard-scss",
    // deterministic property ordering (applied last so it wins)
    "stylelint-config-clean-order",
  ],
  ignoreFiles: ["dist/**", "node_modules/**", "public/generated/**"],
  rules: {
    // Formatting is owned by Prettier (see .prettierrc.json); Stylelint here
    // enforces CSS/SCSS correctness, best practices and declaration order.
    "property-no-vendor-prefix": [
      true,
      // Deliberate: Safari needs -webkit-backface-visibility for the 3D flip,
      // and -webkit-print-color-adjust keeps printed card colors exact in WebKit.
      { ignoreProperties: ["/backface-visibility$/", "/print-color-adjust$/"] },
    ],
  },
};
