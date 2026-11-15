import { useEffect, useRef } from "react";
import type { Photo } from "../content";
import styles from "./Lightbox.module.css";

/**
 * Full-screen view of one photo, with previous/next within the same set.
 * Round grey buttons: X (top-right) to close, arrows at the sides. Also Esc, ← → and a click outside the photo.
 */
export default function Lightbox({
  photos,
  index,
  onClose,
  onChange,
}: {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onChange: (index: number) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const count = photos.length;
  const prev = () => onChange((index - 1 + count) % count);
  const next = () => onChange((index + 1) % count);

  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      dialog?.close();
    };
  }, []);

  const photo = photos[index];
  if (!photo) return null;

  return (
    <dialog
      ref={ref}
      className={styles.lightbox}
      aria-label="Foto a pantalla completa"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") prev();
        if (e.key === "ArrowRight") next();
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <img src={photo.image} alt={photo.alt ?? ""} className={styles.image} />

      <button type="button" className={`${styles.round} ${styles.close}`} onClick={onClose} aria-label="Cerrar">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 6 L18 18 M18 6 L6 18" />
        </svg>
      </button>
      {count > 1 && (
        <>
          <button type="button" className={`${styles.round} ${styles.prev}`} onClick={prev} aria-label="Foto anterior">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M14.5 5.5 L8 12 L14.5 18.5" />
            </svg>
          </button>
          <button type="button" className={`${styles.round} ${styles.next}`} onClick={next} aria-label="Foto siguiente">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9.5 5.5 L16 12 L9.5 18.5" />
            </svg>
          </button>
        </>
      )}
    </dialog>
  );
}
