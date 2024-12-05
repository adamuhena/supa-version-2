// vite.config.js
import { defineConfig } from "file:///Users/j3phy/Documents/GitHub/supa-version-2/node_modules/vite/dist/node/index.js";
import react from "file:///Users/j3phy/Documents/GitHub/supa-version-2/node_modules/@vitejs/plugin-react/dist/index.mjs";
import tailwindcss from "file:///Users/j3phy/Documents/GitHub/supa-version-2/node_modules/tailwindcss/lib/index.js";
import autoprefixer from "file:///Users/j3phy/Documents/GitHub/supa-version-2/node_modules/autoprefixer/lib/autoprefixer.js";
import path from "path";
var __vite_injected_original_dirname = "/Users/j3phy/Documents/GitHub/supa-version-2";
var vite_config_default = defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer]
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "src")
      // Define alias for src folder
    }
  },
  server: {
    host: "0.0.0.0",
    port: 2e3
  }
});
export {
  vite_config_default as default
};
