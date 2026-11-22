import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import compression from "vite-plugin-compression";

export default defineConfig({
  plugins: [
    react(),
    compression({
      algorithm: "gzip",
      ext: ".gz",
      threshold: 1024, // compresses files larger than 1kb
      deleteOriginFile: false, // keeps both original and .gz files
    }),
  ],
  server: { port: 5173 },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("jspdf") || id.includes("html-to-image") || id.includes("html2canvas")) {
              return "pdf-generator";
            }
            if (id.includes("three")) {
              return "three-vendor";
            }
            if (id.includes("lucide-react")) {
              return "lucide-icons";
            }
            if (id.includes("react-router-dom") || id.includes("react-router")) {
              return "react-router";
            }
            if (id.includes("sonner") || id.includes("axios")) {
              return "utils-vendor";
            }
          }
        },
      },
    },
  },
});
