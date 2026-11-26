import { defineConfig } from "vite"

// GitHub Pages serves project sites from `/<repo>/`, so the site is built with
// that base and deployed at https://<owner>.github.io/<repo>/.
export default defineConfig({
  base: "/effect-ui-sdk/",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    target: "es2022"
  },
  server: {
    port: 5173
  }
})
