import { useEffect, useRef } from "react";

/*
 * Google reCAPTCHA v2 ("No soy un robot" checkbox).
 * EmailJS checks the token server-side (template → Settings → reCAPTCHA V2), so a bot
 * that copies the EmailJS keys still cannot send without solving it.
 */
type Grecaptcha = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => number;
  reset: (id?: number) => void;
};
declare global {
  interface Window {
    grecaptcha?: Grecaptcha;
    __onRecaptchaLoad?: () => void;
  }
}

export const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

let loading: Promise<Grecaptcha> | null = null;
function loadRecaptcha(): Promise<Grecaptcha> {
  loading ??= new Promise((resolve) => {
    window.__onRecaptchaLoad = () => resolve(window.grecaptcha!);
    const s = document.createElement("script");
    s.src = "https://www.google.com/recaptcha/api.js?onload=__onRecaptchaLoad&render=explicit&hl=es";
    s.async = true;
    s.defer = true;
    document.head.appendChild(s);
  });
  return loading;
}

/** Renders the checkbox; calls onChange(token) when solved and onChange(null) when it expires. Change `resetKey` to clear it. */
export default function Recaptcha({
  onChange,
  resetKey,
  className,
}: {
  onChange: (token: string | null) => void;
  resetKey: number;
  className?: string;
}) {
  const el = useRef<HTMLDivElement>(null);
  const widget = useRef<number | null>(null);
  const callback = useRef(onChange);
  callback.current = onChange;

  useEffect(() => {
    if (!RECAPTCHA_SITE_KEY) return;
    let cancelled = false;
    loadRecaptcha().then((g) => {
      if (cancelled || !el.current || widget.current !== null) return;
      widget.current = g.render(el.current, {
        sitekey: RECAPTCHA_SITE_KEY,
        callback: (token: string) => callback.current(token),
        "expired-callback": () => callback.current(null),
        "error-callback": () => callback.current(null),
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (widget.current !== null) window.grecaptcha?.reset(widget.current);
    callback.current(null);
  }, [resetKey]);

  if (!RECAPTCHA_SITE_KEY) return null;
  return <div ref={el} className={className} />;
}
