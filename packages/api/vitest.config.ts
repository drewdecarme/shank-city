import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["@flare-city/test/setup"],
  },
});
