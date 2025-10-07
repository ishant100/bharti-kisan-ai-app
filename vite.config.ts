// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(async ({ mode }) => {
  const plugins = [react()];

  if (mode === "development") {
    try {
     
      const mod: any = await import("lovable-tagger");
      const tagger =
        (mod && mod.componentTagger) ||
        (mod && typeof mod.default === "function" ? mod.default : null);

      if (typeof tagger === "function") {
        plugins.push(tagger());
      } else {
        console.warn(
          "[vite] lovable-tagger found but no componentTagger() export; skipping."
        );
      }
    } catch (err) {
      // Don’t fail dev server if the package isn’t installed
      console.warn(
        "[vite] lovable-tagger not available (dev-only). Skipping. Reason:",
        (err as Error).message
      );
    }
  }

  return {
    server: {
      host: true,
      port: 8080,
      strictPort: true,
      proxy: {
        "/api": { target: "http://localhost:8787", changeOrigin: true },
      },
      hmr: { clientPort: 8080 },
    },
    plugins,
    resolve: {
      alias: { "@": path.resolve(__dirname, "./src") },
    },
  };
});
