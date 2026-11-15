/** @type {import("stylelint").Config} */
export default {
  extends: ["stylelint-config-standard-scss"],
  ignoreFiles: ["dist/**", "node_modules/**", "public/generated/**"],
  rules: {
    // Formatting is owned by Prettier (see .prettierrc.json); Stylelint here
    // enforces CSS/SCSS correctness and best practices.
    "property-no-vendor-prefix": [
      true,
      // Deliberate: Safari needs -webkit-backface-visibility for the 3D flip,
      // and -webkit-print-color-adjust keeps printed card colors exact in WebKit.
      { ignoreProperties: ["/backface-visibility$/", "/print-color-adjust$/"] },
    ],
  },
};
