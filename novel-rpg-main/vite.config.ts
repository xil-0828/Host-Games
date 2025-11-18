import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/novel-rpg/",
  build: {
    outDir: "../public/novel-rpg",
    emptyOutDir: true,
  }
});
