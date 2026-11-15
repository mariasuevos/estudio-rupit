import { useRef, useState } from "react";
import type { Photo } from "../content";
import styles from "./HoverGallery.module.css";

/**
 * The first photo is the resting one. While the mouse is over the gallery it shows
 * another photo, and when the mouse leaves it goes back to the first.
 * With more than two photos, each new hover shows the next one (2nd, 3rd, … then 2nd again).
 * On touch screens, a tap switches between the first photo and the next one.
 * Photos cross-fade.
 */
export default function HoverGallery({ images, className = "" }: { images: Photo[]; className?: string }) {
  const [current, setCurrent] = useState(0);
  const lastHover = useRef(0); // last "hover" photo shown (index ≥ 1)
  const pointer = useRef<string>("mouse");
  if (images.length === 0) return null;

  const showNextHoverPhoto = () => {
    if (images.length < 2) return;
    lastHover.current = (lastHover.current % (images.length - 1)) + 1;
    setCurrent(lastHover.current);
  };
  const showRestPhoto = () => setCurrent(0);

  return (
    <div
      className={`${styles.gallery} ${className}`}
      onPointerEnter={(e) => e.pointerType === "mouse" && showNextHoverPhoto()}
      onPointerLeave={(e) => e.pointerType === "mouse" && showRestPhoto()}
      onPointerDown={(e) => (pointer.current = e.pointerType)}
      onClick={() => {
        if (pointer.current === "mouse") return;
        if (current === 0) showNextHoverPhoto();
        else showRestPhoto();
      }}
    >
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
