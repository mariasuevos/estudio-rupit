import { Link, Outlet, useLocation } from "react-router";
import { siteSettings } from "../content";
import { serviceViewFromPath } from "../lib/services";
import { useFitScreen } from "../lib/useFitScreen";
import LogoNav from "./LogoNav";
import Footer from "./Footer";
import styles from "./Layout.module.css";

/** Pages whose whole background (footer included) is beige instead of white. */
const BEIGE_PAGES = ["/contacto"];

/**
 * Layout for inner pages: vertical menu + page + footer (the home page has none of them).
 * Phones: the contact details move from the footer to the top-right (with a link home),
 * except on beige pages (contacto), which keep the full footer. The services list is beige on phones.
 */
export default function Layout() {
  const { pathname } = useLocation();
  const path = pathname.replace(/\/$/, "");
  const beige = BEIGE_PAGES.includes(path);
  const beigeOnPhones = serviceViewFromPath(path) === "list";
  const f = siteSettings.footer ?? {};
  const handle = f.instagram?.replace(/^@/, "");
  useFitScreen(pathname);

  return (
    <div className={`${styles.layout} ${beige ? styles.beige : beigeOnPhones ? styles.beigeMobile : ""}`}>
      <header className={styles.menu}>
        <LogoNav variant="vertical" />
      </header>

      {!beige && (
        <div className={`${styles.mobileInfo} t-contact`}>
          <Link to="/" className={`t-name ${styles.home}`}>
            {f.homeLabel || "Inicio"}
          </Link>
          {handle && (
            <a href={`https://www.instagram.com/${handle}/`} target="_blank" rel="noreferrer">
              @{handle}
            </a>
          )}
          {f.email && <a href={`mailto:${f.email}`}>{f.email}</a>}
          {f.tagline && <p className={styles.tagline}>{f.tagline}</p>}
        </div>
      )}

      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer compactOnPhones={!beige} />
    </div>
  );
}
