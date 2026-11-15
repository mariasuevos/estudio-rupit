import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { copyFileSync, mkdirSync, readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { slugify } from "./src/lib/text";

/**
 * The site is a single-page app. So that /sobre-rupit, /servicios… also work when
 * opened directly on any static host, copy index.html into one folder per page.
 */
function staticRoutes(): Plugin {
  return {
    name: "static-routes",
    apply: "build",
    closeBundle() {
      const out = resolve("dist");
      const site = JSON.parse(readFileSync(resolve("content/site.json"), "utf8"));
      const navSlugs: string[] = (site.nav ?? [])
        .map((n: { href: string }) => n.href)
        .filter((h: string) => h.startsWith("/") && h.length > 1)
        .map((h: string) => h.slice(1));
      const pageSlugs = readdirSync(resolve("content/pages"))
        .filter((f) => f.endsWith(".json"))
        .map((f) => f.replace(/\.json$/, ""));
      const services = JSON.parse(readFileSync(resolve("content/servicios.json"), "utf8"));
      const serviceSlugs: string[] = (services.categories ?? []).flatMap(
        (c: { title: string; subcategories?: { title: string }[] }) => [
          `servicios/${slugify(c.title)}`,
          ...(c.subcategories ?? []).map((s) => `servicios/${slugify(c.title)}/${slugify(s.title)}`),
        ],
      );
      for (const slug of new Set([...navSlugs, ...pageSlugs, ...serviceSlugs])) {
        mkdirSync(resolve(out, slug), { recursive: true });
        copyFileSync(resolve(out, "index.html"), resolve(out, slug, "index.html"));
      }
      copyFileSync(resolve(out, "index.html"), resolve(out, "404.html"));
    },
  };
}

/** Site title and description (TinaCMS → Ajustes del sitio) in <head>, for search engines and link previews. */
function siteMeta(): Plugin {
  const escape = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  return {
    name: "site-meta",
    transformIndexHtml(html) {
      const site = JSON.parse(readFileSync(resolve("content/site.json"), "utf8"));
      const title = escape(site.title || "estudio rupit");
      const description = escape(site.description || "");
      return html
        .replace(/<title>.*<\/title>/, `<title>${title}</title>`)
        .replace("</title>", `</title>\n    <meta property="og:title" content="${title}" />`)
        .replace(
          "</head>",
          description
            ? `  <meta name="description" content="${description}" />\n    <meta property="og:description" content="${description}" />\n  </head>`
            : "</head>",
        );
    },
  };
}

export default defineConfig({
  plugins: [react(), staticRoutes(), siteMeta()],
});
