import { Link, useParams } from "react-router";
import { services } from "../content";
import { slugify, paragraphs } from "../lib/text";
import { resolveService } from "../lib/services";
import PhotoList from "../components/PhotoList";
import styles from "./ServicesPage.module.css";

/*
 * /servicios                         → general page: nothing selected, the general video (or photo list)
 * /servicios/:category               → that category's photos; if it has sub-options (Papelería, Escenografía),
 *                                      they unfold but none is selected and the general video stays
 * /servicios/:category/:sub          → a sub-option
 * Every category and sub-option has its own independent photo list (edited in TinaCMS → Servicios).
 * The general video starts at the very top of the page; categories and photo lists start below the menu.
 *
 * Phones: /servicios shows every category with all its options (beige page, see Layout);
 * any other page shows only that category's or option's text and photos — also a category with
 * sub-options, which on desktop unfolds them instead.
 */
export default function ServicesPage() {
  const params = useParams();
  const { categories, category, subs, sub, selected, mobileSource, notFound, view } = resolveService(
    params.category,
    params.sub,
  );

  const catPath = (title: string) => `/servicios/${slugify(title)}`;
  // A sub-option's photos; else the category's (if it has no sub-options); else the general photos
  const source = selected ?? services;
  const items = notFound ? [] : (source.items ?? []);
  const video = !notFound && source === services ? services.video : undefined;

  return (
    <article className={`${styles.page} ${view === "list" ? styles.listView : styles.detailView}`}>
      <h1 className="visually-hidden">servicios{category ? ` · ${category.title}` : ""}{sub ? ` · ${sub.title}` : ""}</h1>

      {/* Phones only: every category and option, zigzagging around a vertical line */}
      <nav aria-label="Servicios" className={styles.mobileList}>
        <ul role="list">
          {categories.map((c) => (
            <li key={c.title} className={styles.mobileCategory}>
              <Link to={catPath(c.title)} className={`t-name ${styles.mobileTitle}`}>
                {c.title}
              </Link>
              {(c.subcategories?.length ?? 0) > 0 && (
                <ul role="list" className={styles.mobileSubs}>
                  {c.subcategories!.map((s) => (
                    <li key={s.title}>
                      <Link to={`${catPath(c.title)}/${slugify(s.title)}`} className="t-lead">
                        {s.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.grid}>
        <nav aria-label="Servicios" className={styles.categories}>
          <ul role="list">
            {categories.map((c) => (
              <li key={c.title}>
                <Link
                  to={catPath(c.title)}
                  className="t-name"
                  aria-current={c === category ? "true" : undefined}
                >
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={category?.title ?? "Opciones"} className={styles.subcategories}>
          {category && subs.length > 0 && (
            <ul role="list">
              {subs.map((s) => (
                <li key={s.title}>
                  <Link
                    to={`${catPath(category.title)}/${slugify(s.title)}`}
                    className={`t-lead ${styles.subLink}`}
                    aria-current={s === sub ? "page" : undefined}
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </nav>

        {/* Phones: a category with sub-options shows its own text and photos (desktop: the general video) */}
        {!notFound && !selected && mobileSource && (
          <div className={`${styles.photos} ${styles.mobileOnly}`}>
            <Description text={mobileSource.description} />
            <PhotoList key={params.category} items={mobileSource.items ?? []} />
          </div>
        )}

        <div className={`${styles.photos} ${video ? styles.hasVideo : ""} ${mobileSource && !selected ? styles.desktopOnly : ""}`}>
          <Description text={selected?.description} />
          {notFound ? (
            <p className="t-lead">No encontrado.</p>
          ) : video ? (
            <video className={styles.video} src={video} autoPlay muted loop playsInline aria-hidden="true" />
          ) : (
            <PhotoList key={params.category + "/" + params.sub} items={items} />
          )}
        </div>
      </div>
    </article>
  );
}

/** Uppercase italic text above the photos (phones only). */
function Description({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <div className={styles.description}>
      {paragraphs(text).map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}
