import type { Plugin } from "vite";
import solid from "@solidjs/vite-plugin";
import { defineConfig } from "vitest/config";
import { mockCard } from "./src/test/mock-card.js";

/**
 * Standalone vitest config — deliberately NOT vite.config.ts. That file
 * generates QR/vCard/favicon assets at config-load time and wires the whole
 * SolidBase pipeline, none of which tests need. Here we only mount the Solid
 * transform plus a stub of the app's virtual module.
 *
 * @solidjs/vite-plugin detects vitest and injects the Solid setup itself
 * (including auto-detecting @testing-library/jest-dom into setupFiles).
 */
function sopicardVirtualStub(): Plugin {
  return {
    name: "virtual:sopicard",
    resolveId(id) {
      return id === "virtual:sopicard" ? id : undefined;
    },
    load(id) {
      return id === "virtual:sopicard" ? `export default ${JSON.stringify(mockCard)};` : undefined;
    },
  };
}

export default defineConfig({
  plugins: [sopicardVirtualStub(), solid()],
  resolve: {
    // Documented Solid-in-vitest setup: resolve the browser/dev builds of
    // the runtime when running components under jsdom.
    conditions: ["development", "browser"],
  },
  test: {
    environment: "jsdom",
    // @solidjs/testing-library registers its automatic cleanup through the
    // global afterEach, which vitest only injects with globals enabled.
    globals: true,
  },
});
