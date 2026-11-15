/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EMAILJS_SERVICE_ID?: string;
  readonly VITE_EMAILJS_TEMPLATE_ID?: string;
  readonly VITE_EMAILJS_TEMPLATE_ID_NO_COPY?: string;
  readonly VITE_EMAILJS_PUBLIC_KEY?: string;
  readonly VITE_EMAILJS_SEND_COPY?: string;
  readonly VITE_RECAPTCHA_SITE_KEY?: string;
}
