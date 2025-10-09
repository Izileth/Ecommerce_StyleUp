import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  resolve: {
    alias: {
      '@reduxjs/toolkit': 'node_modules/@reduxjs/toolkit'
    }
  },
  server: {
    port: 4949,
    open: true
  }
});
