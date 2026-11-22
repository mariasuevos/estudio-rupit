import { Link } from "react-router";
import { PROJECT_LAYOUTS, type ProjectLayout } from "./index";
import styles from "./LayoutSwitch.module.css";

/** "Ver opción 2" button (phones only). Shows nothing when there is a single layout. */
export default function LayoutSwitch({ current }: { current: ProjectLayout }) {
  if (PROJECT_LAYOUTS.length < 2) return null;
  const i = PROJECT_LAYOUTS.indexOf(current);
  const next = PROJECT_LAYOUTS[(i + 1) % PROJECT_LAYOUTS.length];
  const to = next === PROJECT_LAYOUTS[0] ? "?" : `?opcion=${next.id}`;

  return (
    <Link to={{ search: to }} replace preventScrollReset className={`t-nav ${styles.button}`}>
      Ver {next.label}
    </Link>
  );
}
