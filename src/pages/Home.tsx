import { home, siteSettings } from "../content";
import LogoNav from "../components/LogoNav";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <main className={styles.hero}>
      {home.heroImage && <img className={styles.image} src={home.heroImage} alt={home.heroAlt ?? ""} />}
      <h1 className="visually-hidden">{siteSettings.title}</h1>
      <div className={styles.logo}>
        <LogoNav variant="hero" />
      </div>
    </main>
  );
}
