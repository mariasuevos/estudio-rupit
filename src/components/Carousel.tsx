import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Photo } from "../content";
import styles from "./Carousel.module.css";

/**
 * Row of photos that drifts slowly to the left in an endless loop.
 * The photo set is repeated enough times to always fill the screen; the track moves by
 * exactly one set and starts again, so the loop is seamless. It never stops.
 * Clicking a photo calls onOpen(index) (used to show it full screen).
 */
export default function Carousel({
  photos,
  onOpen,
  offset = 0,
}: {
  photos: Photo[];
  onOpen: (index: number) => void;
  /** 0–1: how far into the loop this carousel starts, so rows are not in sync */
  offset?: number;
}) {
  const setRef = useRef<HTMLDivElement>(null);
  const [setWidth, setSetWidth] = useState(0);
  const [copies, setCopies] = useState(2);

  useEffect(() => {
    const el = setRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.offsetWidth;
      setSetWidth(w);
      if (w > 0) setCopies(Math.max(2, Math.ceil(window.innerWidth / w) + 1));
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  if (photos.length === 0) return null;

  const style = {
    "--set-width": `${setWidth}px`,
    // speed is constant (px per second) whatever the number of photos
    "--duration": `calc(${setWidth}s / var(--carousel-speed))`,
    "--delay": `calc(${-offset * setWidth}s / var(--carousel-speed))`,
  } as CSSProperties;

  return (
    <div className={styles.carousel}>
      <div className={`${styles.track} ${setWidth > 0 ? styles.running : ""}`} style={style}>
        {Array.from({ length: copies }, (_, copy) => (
          <div key={copy} ref={copy === 0 ? setRef : undefined} className={styles.set} aria-hidden={copy > 0 || undefined}>
            {photos.map((p, i) => (
              <button
                key={i}
                type="button"
                className={styles.photo}
                onClick={() => onOpen(i)}
                tabIndex={copy > 0 ? -1 : undefined}
                aria-label={`Ver foto ${i + 1} a pantalla completa`}
              >
                <img src={p.image} alt={copy > 0 ? "" : (p.alt ?? "")} loading={copy === 0 ? "eager" : "lazy"} draggable={false} />
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
