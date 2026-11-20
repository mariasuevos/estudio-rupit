import { about } from "../content";
import Slideshow from "../components/Slideshow";
import { paragraphs } from "../lib/text";
import styles from "./AboutPage.module.css";

/**
 * "sobre rupit": text column on the left (heading + paragraphs at the top,
 * closing line + the two names at the bottom), square photo on the right
 * that changes every few seconds.
 */
export default function AboutPage() {
  return (
    <article className={styles.about}>
      <h1 className="visually-hidden">sobre rupit</h1>

      <div className={styles.text}>
        <div className={`t-lead ${styles.intro}`}>
          {about.heading && <h2 className={styles.heading}>{about.heading}</h2>}
          {paragraphs(about.intro).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div>
          {about.closing && <p className={styles.closing}>{about.closing}</p>}
          {(about.nameLeft || about.nameRight) && (
            <div className={styles.names}>
              {about.nameLeft && <p className={`t-name ${styles.name}`}>{about.nameLeft}</p>}
              {about.nameRight && <p className={`t-name ${styles.name}`}>{about.nameRight}</p>}
            </div>
          )}
        </div>
      </div>

      <Slideshow images={about.gallery ?? []} className={styles.photo} />
    </article>
  );
}
