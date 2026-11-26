import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"

// GitHub Pages serves project sites from `/<repo>/`, so the site is built with
// that base and deployed at https://<owner>.github.io/<repo>/.
// Tailwind is only needed to compile the optional Daisy stylesheet. Importing
// that CSS is not enough: Vite's CSS minifier leaves `@theme` and `@plugin`
// unexpanded. `site.css` has no Tailwind directives, so the default chunk stays
// free of it.
export default defineConfig({
  plugins: [tailwindcss()],
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
