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

export const siteSettings: SiteSettings = siteData;
export const home: { heroImage?: string; heroAlt?: string; heroHoverImage?: string; heroHoverAlt?: string } =
  homeData;

export const about: {
  heading?: string;
  intro?: string;
  closing?: string;
  nameLeft?: string;
  nameRight?: string;
  gallery?: Photo[];
} = aboutData;

export const services: {
  intro?: string;
  video?: string; // general page (/servicios, nothing selected); replaces `items` when set
  items?: PhotoItem[]; // general page (/servicios, nothing selected)
  categories?: (ServiceOption & { subcategories?: ServiceOption[] })[];
} = servicesData;

export const projects: { intro?: string; projects?: { title?: string; photos?: Photo[] }[] } = projectsData;

export const contact: {
  text?: string;
  submitLabel?: string;
  successMessage?: string;
  duplicateMessage?: string;
  captchaMessage?: string;
  errorMessage?: string;
  fields?: Record<string, { label?: string; hint?: string; placeholder?: string } | undefined>;
} = contactData;

const files = import.meta.glob<Page>("../content/pages/*.json", { eager: true, import: "default" });
export const pages: Record<string, Page> = Object.fromEntries(
  Object.entries(files).map(([path, page]) => [path.split("/").pop()!.replace(/\.json$/, ""), page]),
);
