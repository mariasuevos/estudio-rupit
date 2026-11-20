/*
 * Content is stored as JSON in /content and edited by admins through TinaCMS (/admin).
 * It is bundled at build time, so the site stays fully static.
 * content/pages/*.json: one page per file; the file name is the URL (/aviso-legal …).
 */
import siteData from "../content/site.json";
import homeData from "../content/home.json";
import aboutData from "../content/sobre-rupit.json";
import servicesData from "../content/servicios.json";
import projectsData from "../content/proyectos.json";
import contactData from "../content/contacto.json";

/**
 * The site can live in a sub-folder (GitHub Pages: /estudio-rupit/). Media paths saved by Tina
 * ("/uploads/…") are made relative to that folder here, so components can use them as they are.
 */
const withBase = <T,>(data: T): T => {
  const fix = (v: unknown): unknown =>
    typeof v === "string" && v.startsWith("/uploads/")
      ? asset(v)
      : Array.isArray(v)
        ? v.map(fix)
        : v && typeof v === "object"
          ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, fix(x)]))
          : v;
  return fix(data) as T;
};

/** "/brand/logo.png" → "/estudio-rupit/brand/logo.png" when the site is in a sub-folder. */
export const asset = (path: string) => import.meta.env.BASE_URL + path.replace(/^\//, "");

export type NavItem = { label: string; href: string };
export type Photo = { image: string; alt?: string };
export type PhotoItem = Partial<Photo> & { caption?: string };
export type ServiceOption = { title: string; items?: PhotoItem[] };

export type SiteSettings = {
  title: string;
  description?: string;
  nav?: NavItem[];
  footer?: { instagram?: string; email?: string; tagline?: string; legalLinks?: NavItem[] };
};
export type Page = { title: string; subtitle?: string; body?: string; image?: string; imageAlt?: string };

export const siteSettings: SiteSettings = withBase(siteData);
export const home: { heroImage?: string; heroAlt?: string; heroHoverImage?: string; heroHoverAlt?: string } =
  withBase(homeData);

export const about: {
  heading?: string;
  intro?: string;
  closing?: string;
  nameLeft?: string;
  nameRight?: string;
  gallery?: Photo[];
} = withBase(aboutData);

export const services: {
  intro?: string;
  video?: string; // general page (/servicios, nothing selected); replaces `items` when set
  items?: PhotoItem[]; // general page (/servicios, nothing selected)
  categories?: (ServiceOption & { subcategories?: ServiceOption[] })[];
} = withBase(servicesData);

export const projects: { intro?: string; projects?: { title?: string; photos?: Photo[] }[] } = withBase(projectsData);

export const contact: {
  text?: string;
  submitLabel?: string;
  successMessage?: string;
  duplicateMessage?: string;
  captchaMessage?: string;
  errorMessage?: string;
  fields?: Record<string, { label?: string; hint?: string; placeholder?: string } | undefined>;
} = withBase(contactData);

const files = import.meta.glob<Page>("../content/pages/*.json", { eager: true, import: "default" });
export const pages: Record<string, Page> = Object.fromEntries(
  Object.entries(files).map(([path, page]) => [path.split("/").pop()!.replace(/\.json$/, ""), withBase(page)]),
);
