import { useEffect, useState } from "react";
import type { Photo } from "../content";
import styles from "./Slideshow.module.css";

/**
 * Shows the photos one after another, in list order, looping forever.
 * Each photo stays `interval` ms and then cross-fades into the next one.
 * With a single photo it just shows it.
 */
export default function Slideshow({
  images,
  interval = 4000,
  className = "",
}: {
  images: Photo[];
  interval?: number;
  className?: string;
}) {
  const [current, setCurrent] = useState(0);
  const count = images.length;

  useEffect(() => {
    if (count < 2) return;
    const id = window.setInterval(() => setCurrent((i) => (i + 1) % count), interval);
    return () => window.clearInterval(id);
  }, [count, interval]);

  if (count === 0) return null;

  return (
    <div className={`${styles.slideshow} ${className}`}>
      {images.map((img, i) => (
        <img
          key={img.image + i}
          src={img.image}
          alt={i === current ? (img.alt ?? "") : ""}
          aria-hidden={i === current ? undefined : true}
          className={i === current ? styles.active : undefined}
        />
      ))}
    </div>
  );
}
