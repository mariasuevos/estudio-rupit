import { Fragment } from "react";
import { Link } from "react-router";
import { siteSettings } from "../content";
import styles from "./Footer.module.css";

/** Footer for every page except the home page. `showHome` = beige "HOME" square (hidden on beige pages). */
export default function Footer({ showHome = true }: { showHome?: boolean }) {
  const f = siteSettings.footer ?? {};
  const handle = f.instagram?.replace(/^@/, "");

  return (
    <footer className={styles.footer}>
      <Link to="/" className={styles.wordmarkLink} aria-label={`${siteSettings.title} — inicio`}>
        <img
          className={styles.wordmark}
          src="/brand/logo-texto-morado-vertical.png"
          alt=""
          width={119}
          height={800}
        />
      </Link>

      <div className={`${styles.contact} t-contact`}>
        {handle && (
          <a href={`https://www.instagram.com/${handle}/`} target="_blank" rel="noreferrer">
            @{handle}
          </a>
        )}
        {f.email && <a href={`mailto:${f.email}`}>{f.email}</a>}
        {f.tagline && <p className={styles.tagline}>{f.tagline}</p>}
      </div>

      {f.legalLinks && f.legalLinks.length > 0 && (
        <nav aria-label="Legal" className={`${styles.legal} t-legal`}>
          {f.legalLinks.map((l, i) => (
            <Fragment key={l.href}>
              {i > 0 && <span aria-hidden="true"> · </span>}
              <Link to={l.href}>{l.label}</Link>
            </Fragment>
          ))}
        </nav>
      )}

      {showHome && (
        <Link to="/" className={`${styles.home} t-name`}>
          {f.homeLabel || "Home"}
        </Link>
      )}
    </footer>
  );
}
