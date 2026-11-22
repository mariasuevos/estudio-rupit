/*
 * Phone layouts for "proyectos" that can be compared on the live site (desktop is the same in all of them).
 *
 * Each layout is one CSS file that only sets variables (see ProjectsPage.module.css → "Phones").
 * The first one is shown by default; /proyectos?opcion=<id> shows another.
 * While there is more than one, a button at the top switches to the next one.
 *
 * To keep only one: delete the other's .module.css file and its line below.
 * With a single layout left, the button disappears by itself.
 */
import option1 from "./option1.module.css";
import option2 from "./option2.module.css";

export type ProjectLayout = { id: string; label: string; className: string };

export const PROJECT_LAYOUTS: ProjectLayout[] = [
  { id: "1", label: "opción 1", className: option1.layout }, // one project per screen, tall photos
  { id: "2", label: "opción 2", className: option2.layout }, // compact: shorter photos, two projects per screen
];

/** The layout for a ?opcion= value (the first one if missing or unknown). */
export const projectLayout = (id: string | null) => PROJECT_LAYOUTS.find((l) => l.id === id) ?? PROJECT_LAYOUTS[0];
