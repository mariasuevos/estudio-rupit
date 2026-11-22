import { useLayoutEffect } from "react";

/**
 * Pages that fit on one screen must not scroll at all (not even a little, not even the phone's "bounce").
 *
 * - --app-height: the height actually visible (window.innerHeight). CSS units like 100svh are not exact
 *   on some phones (e.g. Pixel with Chrome draws under the navigation bar), so the page is sized with this.
 * - html.fits-screen: added while the page's content fits in that height; it locks scrolling (global.css).
 *   Pages that don't fit (proyectos, contacto, very small phones) scroll normally.
 *
 * Re-checked when the page changes (`key`), the window resizes (rotation, browser bars) or content changes size.
 */
export function useFitScreen(key: string) {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const update = () => {
      root.style.setProperty("--app-height", `${window.innerHeight}px`);
      root.classList.remove("fits-screen");
      root.classList.toggle("fits-screen", root.scrollHeight <= window.innerHeight + 1);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(document.body);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
      root.classList.remove("fits-screen");
    };
  }, [key]);
}
