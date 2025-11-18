import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/novel-rpg/",
  plugins: [react()], // ←これが絶対必要
  build: {
    outDir: "../public/novel-rpg",
    emptyOutDir: true,
  },
});
