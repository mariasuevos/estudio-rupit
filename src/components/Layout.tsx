import { Outlet, useLocation } from "react-router";
import LogoNav from "./LogoNav";
import Footer from "./Footer";
import styles from "./Layout.module.css";

/** Pages whose whole background (footer included) is beige instead of white. */
const BEIGE_PAGES = ["/contacto"];

/** Layout for inner pages: vertical menu + page + footer (the home page has none of them). */
export default function Layout() {
  const { pathname } = useLocation();
  const beige = BEIGE_PAGES.includes(pathname.replace(/\/$/, ""));

  return (
    <div className={beige ? styles.beige : undefined}>
      <header className={styles.menu}>
        <LogoNav variant="vertical" />
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer showHome={!beige} />
    </div>
  );
}
