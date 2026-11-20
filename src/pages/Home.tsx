import { home, siteSettings } from "../content";
import LogoNav from "../components/LogoNav";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <main className={styles.hero}>
      {home.heroImage && <img className={styles.image} src={home.heroImage} alt={home.heroAlt ?? ""} />}
      {home.heroHoverImage && (
        <img
          className={`${styles.image} ${styles.hoverImage}`}
          src={home.heroHoverImage}
          alt={home.heroHoverAlt ?? ""}
        />
      )}
      <h1 className="visually-hidden">{siteSettings.title}</h1>
      <div className={styles.logo}>
        <LogoNav variant="hero" />
      </div>
    </main>
  );
}
