import React from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [React()],
  test: {
    environment: "jsdom",
    include: ["__test__/**/*.test.tsx"],
  },
  resolve: {
    alias: {
      "@": __dirname, // This points "@" to your project root
    },
  },
})
