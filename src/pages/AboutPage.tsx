import { about } from "../content";
import HoverGallery from "../components/HoverGallery";
import { paragraphs } from "../lib/text";
import styles from "./AboutPage.module.css";

/** "sobre rupit": full-screen intro with hover gallery, then one block per person/story. */
export default function AboutPage() {
  return (
    <article>
      <h1 className="visually-hidden">sobre rupit</h1>

      <section className={styles.intro}>
        <HoverGallery images={about.gallery ?? []} className={styles.gallery} />
        <div className={`t-lead ${styles.introText}`}>
          {paragraphs(about.intro).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      {about.blocks?.map((block, i) => (
        <section key={i} className={styles.block}>
          {block.image && <img className={styles.blockImage} src={block.image} alt={block.imageAlt ?? ""} loading="lazy" />}
          {(block.titleLeft || block.titleRight) && (
            <div className={styles.names}>
              <h2 className="t-name">{block.titleLeft}</h2>
              <h2 className="t-name">{block.titleRight}</h2>
            </div>
          )}
          <div className={`t-lead ${styles.blockText}`}>
            {paragraphs(block.text).map((p, j) => (
              <p key={j}>{p}</p>
            ))}
          </div>
        </section>
      ))}
    </article>
  );
}
