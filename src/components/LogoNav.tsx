import { Link, useLocation } from "react-router";
import { asset, useSiteSettings } from "../content";
import moon from "../assets/brand/moon.png";
import moonVertical from "../assets/brand/moon-vertical.png";
import styles from "./LogoNav.module.css";

/*
 * The logo IS the menu: the half-moon and the three dots are each a link
 * (Site settings → Navigation). Hovering one fades/hides the rest and shows
 * that section's name.
 *
 * Mark positions are measured in pixels of the original logo file
 * (web-mar-brand-assets/versiones logotipo, 8118 × 600 once trimmed) and converted to %.
 *
 *   variant="hero"      horizontal, white, with the "estudio rupit" wordmark (home page).
 *                       Menu order left → right: moon, dot, dot, dot.
 *   variant="vertical"  the symbol turned 90°, plum (inner pages).
 *                       Menu order top → bottom: dot, dot, dot, moon.
 *                       The current section is solid and the rest faded.
 */
const MARKS = [
  { x: 4600, y: 167, w: 235, h: 165, shape: "moon" },
  { x: 6024, y: 171, w: 254, h: 254, shape: "dot" },
  { x: 6613, y: 171, w: 254, h: 254, shape: "dot" },
  { x: 7863, y: 171, w: 254, h: 254, shape: "dot" },
] as const;
const SYMBOL = { x: 4600, y: 167, w: 3518, h: 262 }; // bounding box of the 4 marks

type Box = { x: number; y: number; w: number; h: number };
type Variant = "hero" | "vertical";

/** Mark box inside the menu frame; "vertical" rotates the symbol 90° counter-clockwise. */
function markBox(m: Box, variant: Variant): Box {
  if (variant === "hero") return { x: m.x - SYMBOL.x, y: m.y - SYMBOL.y, w: m.w, h: m.h };
  return { x: m.y - SYMBOL.y, y: SYMBOL.x + SYMBOL.w - (m.x + m.w), w: m.h, h: m.w };
}

const pct = (b: Box, frame: { w: number; h: number }) => ({
  left: `${(b.x / frame.w) * 100}%`,
  top: `${(b.y / frame.h) * 100}%`,
  width: `${(b.w / frame.w) * 100}%`,
  height: `${(b.h / frame.h) * 100}%`,
});

export default function LogoNav({ variant }: { variant: Variant }) {
  const { pathname } = useLocation();
  const siteSettings = useSiteSettings();
  const nav = (siteSettings.nav ?? []).slice(0, MARKS.length);
  const frame = variant === "hero" ? { w: SYMBOL.w, h: SYMBOL.h } : { w: SYMBOL.h, h: SYMBOL.w };
  const moonMask = `url(${variant === "hero" ? moon : moonVertical})`;

  return (
    <nav aria-label="Principal" className={`${styles.nav} ${styles[variant]}`}>
      {variant === "hero" && (
        <Link to="/" className={styles.wordmark}>
          <img src={asset("/brand/logo-texto-blanco.png")} alt={siteSettings.title} />
        </Link>
      )}
      <ul role="list" className={styles.symbol} style={{ aspectRatio: `${frame.w} / ${frame.h}` }}>
        {MARKS.map((_, i) => {
          // Menu item i sits on: hero → mark i; vertical → mark 3-i (top dot first, moon last)
          const mark = MARKS[variant === "hero" ? i : MARKS.length - 1 - i];
          const item = nav[i];
          const shape = (
            <span
              className={styles[mark.shape]}
              style={mark.shape === "moon" ? { maskImage: moonMask, WebkitMaskImage: moonMask } : undefined}
              aria-hidden="true"
            />
          );
          return (
            <li key={i} className={styles.mark} style={pct(markBox(mark, variant), frame)}>
              {item ? (
                <Link
                  to={item.href}
                  className={styles.link}
                  aria-current={pathname === item.href || pathname.startsWith(item.href + "/") ? "page" : undefined}
                >
                  {shape}
                  <span className={`t-nav ${styles.label}`}>{item.label}</span>
                </Link>
              ) : (
                shape
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
