/*
 * Content is stored as JSON in /content and edited by admins through TinaCMS (/admin).
 * It is bundled at build time, so the site stays fully static.
 * content/pages/*.json: one page per file; the file name is the URL (/aviso-legal …).
 *
 * Pages read their content through the use…() hooks below. On the public site they return the bundled
 * JSON; inside the /admin visual editor, Tina replaces it live with what is being typed (useTina).
 */
import { createContext, createElement, useContext, useMemo, type ReactNode } from "react";
import { useTina } from "tinacms/dist/react";
import {
  AboutDocument,
  ContactDocument,
  HomeDocument,
  PageDocument,
  ProjectsDocument,
  ServicesDocument,
  SettingsDocument,
} from "../tina/__generated__/types";
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
export type ServiceOption = { title: string; description?: string; items?: PhotoItem[] };

export type SiteSettings = {
  title: string;
  description?: string;
  nav?: NavItem[];
  footer?: { instagram?: string; email?: string; tagline?: string; legalLinks?: NavItem[]; homeLabel?: string };
};
export type Page = { title: string; subtitle?: string; body?: string; image?: string; imageAlt?: string };

export type Home = { heroImage?: string; heroAlt?: string; heroHoverImage?: string; heroHoverAlt?: string };
export type About = {
  heading?: string;
  intro?: string;
  closing?: string;
  nameLeft?: string;
  nameRight?: string;
  gallery?: Photo[];
};
export type Services = {
  intro?: string;
  video?: string; // general page (/servicios, nothing selected); replaces `items` when set
  items?: PhotoItem[]; // general page (/servicios, nothing selected)
  categories?: (ServiceOption & { subcategories?: ServiceOption[] })[];
};
export type Projects = { intro?: string; projects?: { title?: string; description?: string; photos?: Photo[] }[] };
export type Contact = {
  text?: string;
  submitLabel?: string;
  successMessage?: string;
  duplicateMessage?: string;
  captchaMessage?: string;
  errorMessage?: string;
  fields?: Record<string, { label?: string; hint?: string; placeholder?: string } | undefined>;
};

/** Bundled content, for code outside React components (the live versions are the hooks below). */
export const services: Services = withBase(servicesData);

const pageFiles = import.meta.glob("../content/pages/*.json", { eager: true, import: "default" });
const rawPages: Record<string, unknown> = Object.fromEntries(
  Object.entries(pageFiles).map(([path, page]) => [path.split("/").pop()!.replace(/\.json$/, ""), page]),
);

/**
 * Content of one Tina document: the bundled JSON, or the live edits while in the /admin visual editor.
 * `key` is the GraphQL field the query returns (= the collection name in tina/config.ts).
 */
function useLive<T>(key: string, query: string, relativePath: string, bundled: unknown): T {
  // Both objects must keep their identity between renders: useTina resets its data whenever `data`
  // changes, which would overwrite the live edits with the bundled JSON (and re-render forever).
  const variables = useMemo(() => ({ relativePath }), [relativePath]);
  const initial = useMemo(() => ({ [key]: bundled }), [key, bundled]);
  const { data } = useTina<Record<string, unknown>>({ query, variables, data: initial });
  return useMemo(() => withBase((data[key] ?? undefined) as T), [data, key]);
}

export const useHome = () => useLive<Home>("home", HomeDocument, "home.json", homeData);
export const useAbout = () => useLive<About>("about", AboutDocument, "sobre-rupit.json", aboutData);
export const useServices = () => useLive<Services>("services", ServicesDocument, "servicios.json", servicesData);
export const useProjects = () => useLive<Projects>("projects", ProjectsDocument, "proyectos.json", projectsData);
export const useContact = () => useLive<Contact>("contact", ContactDocument, "contacto.json", contactData);
/** A page from content/pages (undefined if there is no file with that name). */
export const usePage = (slug: string) => useLive<Page | undefined>("page", PageDocument, `${slug}.json`, rawPages[slug]);

/** Site settings are used by many components at once, so they are read once (in the provider) and shared. */
const SettingsContext = createContext<SiteSettings>(withBase(siteData));
export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const settings = useLive<SiteSettings>("settings", SettingsDocument, "site.json", siteData);
  return createElement(SettingsContext.Provider, { value: settings }, children);
}
export const useSiteSettings = () => useContext(SettingsContext);
