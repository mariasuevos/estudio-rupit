import { services as bundledServices, type Services } from "../content";
import { slugify } from "./text";

/**
 * What /servicios[/:category[/:sub]] shows.
 *   selected     → desktop: the option whose photos are shown (a sub-option, or a category without any);
 *                  undefined = the general video/photos (also while a category's sub-options are unfolded).
 *   mobileSource → phones: the category or sub-option whose text and photos are shown.
 *   view         → phones: "list" (/servicios: beige page listing every category and option) or "detail".
 */
export function resolveService(categorySlug?: string, subSlug?: string, services: Services = bundledServices) {
  const categories = services.categories ?? [];
  const category = categorySlug ? categories.find((c) => slugify(c.title) === categorySlug) : undefined;
  const subs = category?.subcategories ?? [];
  const sub = subSlug ? subs.find((s) => slugify(s.title) === subSlug) : undefined;
  const notFound = Boolean((categorySlug && !category) || (subSlug && !sub));
  const selected = sub ?? (category && subs.length === 0 ? category : undefined);
  const mobileSource = sub ?? category;
  const view = notFound || category ? "detail" : "list";
  return { categories, category, subs, sub, selected, mobileSource, notFound, view } as const;
}

/** Same as above from a pathname ("/servicios/papeleria"); undefined if it is not a services page. */
export function serviceViewFromPath(pathname: string) {
  const [first, cat, sub] = pathname.split("/").filter(Boolean);
  if (first !== "servicios") return undefined;
  return resolveService(cat, sub).view;
}
