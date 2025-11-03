import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// ✅ Modern Tailwind v4-compatible Vite config
export default defineConfig({
  plugins: [react(),tailwindcss()],
  

});
