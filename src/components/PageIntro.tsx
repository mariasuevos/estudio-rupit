import { paragraphs } from "../lib/text";
import styles from "./PageIntro.module.css";

/** Italic intro text at the top-right of a page (servicios, proyectos). */
export default function PageIntro({ text }: { text?: string }) {
  return (
    <header className={`t-lead ${styles.intro}`}>
      {paragraphs(text).map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </header>
  );
}
