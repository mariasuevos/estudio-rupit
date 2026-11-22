import { about } from "../content";
import Slideshow from "../components/Slideshow";
import { paragraphs } from "../lib/text";
import styles from "./AboutPage.module.css";

/**
 * "sobre rupit": text column on the left (heading + paragraphs at the top,
 * closing line + the two names at the bottom), square photo on the right
 * that changes every few seconds.
 * Phones: wide photo on top, then the text centred, with the two names side by side.
 */
export default function AboutPage() {
  return (
    <article className={styles.about}>
      <h1 className="visually-hidden">sobre rupit</h1>

      <div className={styles.text}>
        <div className={`t-lead ${styles.intro}`}>
          {about.heading && <h2 className={styles.heading}>{about.heading}</h2>}
          {paragraphs(about.intro).map((p, i) => (
            // Phones: the 1st and 2nd paragraphs go under the left and right names
            <p key={i} className={i === 0 ? styles.underLeft : i === 1 ? styles.underRight : undefined}>
              {p}
            </p>
          ))}
        </div>

        <div className={styles.bottom}>
          {about.closing && <p className={styles.closing}>{about.closing}</p>}
          {(about.nameLeft || about.nameRight) && (
            <div className={styles.names}>
              {about.nameLeft && <p className={`t-name ${styles.name} ${styles.nameLeft}`}>{about.nameLeft}</p>}
              {about.nameRight && <p className={`t-name ${styles.name} ${styles.nameRight}`}>{about.nameRight}</p>}
            </div>
          )}
        </div>
      </div>

      <Slideshow images={about.gallery ?? []} className={styles.photo} />
    </article>
  );
}
