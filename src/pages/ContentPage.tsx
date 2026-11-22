import { useParams } from "react-router";
import { usePage } from "../content";
import { paragraphs } from "../lib/text";
import styles from "./ContentPage.module.css";

/** Generic page for every file in content/pages (route = file name). */
export default function ContentPage() {
  const { slug = "" } = useParams();
  const page = usePage(slug);

  if (!page) {
    return (
      <section className={styles.page}>
        <h1 className="t-name">Página no encontrada</h1>
      </section>
    );
  }

  return (
    <section className={`${styles.page} ${styles.grid}`}>
      <div className="measure">
        <header className={styles.intro}>
          <h1 className="t-name">{page.title}</h1>
          {page.subtitle && <p className={`t-accent ${styles.subtitle}`}>{page.subtitle}</p>}
        </header>
        <div className="t-body">
          {paragraphs(page.body).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>

      {page.image && (
        <figure className={styles.media}>
          <img src={page.image} alt={page.imageAlt ?? ""} loading="lazy" />
        </figure>
      )}
    </section>
  );
}
