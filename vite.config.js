// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import path from "path";

export default defineConfig({
  optimizeDeps: {
    include: ["xlsx"],
  },
  // 👇 IMPORTANT: Change this if deploying to subfolder
  base: "/", // if deployed at https://mydomain.com/
  // base: "/myapp/", // if deployed at https://mydomain.com/myapp/
  plugins: [react()],
  build: {
    outDir: "dist", // default, but keep it explicit
    emptyOutDir: true, // cleans dist before build
    rollupOptions: {
      // Add Rollup config here if needed later
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 2000,
  },
});


// // vite.config.js
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "tailwindcss";
// import autoprefixer from "autoprefixer";
// import path from "path"; // Import path for alias configuration

// // https://vitejs.dev/config/
// export default defineConfig({
//   optimizeDeps: {
//     include: ['xlsx'],
//   },
//   base: "/",
//   plugins: [react()],
//   rollupOptions: {
//     // Specify any necessary Rollup plugins or options
//   },
//   css: {
//     postcss: {
//       plugins: [tailwindcss, autoprefixer],
//     },
//   },
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "src"), // Define alias for src folder
//     },
//   },
//   server: {
//     host: "0.0.0.0",
//     port: 2000,
//   },
// });

