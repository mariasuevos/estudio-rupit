import { Link, useParams } from "react-router";
import { services } from "../content";
import { slugify } from "../lib/text";
import PhotoList from "../components/PhotoList";
import styles from "./ServicesPage.module.css";

/*
 * /servicios                         → general page: nothing selected, the general video (or photo list)
 * /servicios/:category               → that category's photos; if it has sub-options (Papelería, Escenografía),
 *                                      they unfold but none is selected and the general video stays
 * /servicios/:category/:sub          → a sub-option
 * Every category and sub-option has its own independent photo list (edited in TinaCMS → Servicios).
 * The general video starts at the very top of the page; categories and photo lists start below the menu.
 */
export default function ServicesPage() {
  const params = useParams();
  const categories = services.categories ?? [];
  const category = params.category ? categories.find((c) => slugify(c.title) === params.category) : undefined;
  const subs = category?.subcategories ?? [];
  const sub = params.sub ? subs.find((s) => slugify(s.title) === params.sub) : undefined;
  const notFound = (params.category && !category) || (params.sub && !sub);

  const catPath = (title: string) => `/servicios/${slugify(title)}`;
  // A sub-option's photos; else the category's (if it has no sub-options); else the general photos
  const source = sub ?? (category && subs.length === 0 ? category : services);
  const items = notFound ? [] : (source.items ?? []);
  const video = !notFound && source === services ? services.video : undefined;

  return (
    <article className={styles.page}>
      <h1 className="visually-hidden">servicios{category ? ` · ${category.title}` : ""}{sub ? ` · ${sub.title}` : ""}</h1>

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

        <div className={`${styles.photos} ${video ? styles.hasVideo : ""}`}>
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
