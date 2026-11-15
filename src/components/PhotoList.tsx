import type { PhotoItem } from "../content";
import styles from "./PhotoList.module.css";

/** Vertical list of photos, each with a small uppercase caption underneath. */
export default function PhotoList({ items }: { items: PhotoItem[] }) {
  return (
    <div className={styles.list}>
      {items.map((item, i) =>
        item.image ? (
          <figure key={i} className={styles.item}>
            <img src={item.image} alt={item.alt ?? item.caption ?? ""} loading={i < 2 ? "eager" : "lazy"} />
            {item.caption && <figcaption className="t-caption">{item.caption}</figcaption>}
          </figure>
        ) : null,
      )}
    </div>
  );
}
