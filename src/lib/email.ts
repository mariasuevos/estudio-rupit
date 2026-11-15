import emailjs from "@emailjs/browser";

/*
 * Contact form e-mails are sent with EmailJS (https://www.emailjs.com), straight from the browser.
 * The recipient address is set in the EmailJS template ("To Email"), not here.
 * Keys come from environment variables (see .env.example); the public key is meant to be public.
 */
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

/*
 * Copy to the sender: the copy is EmailJS's Auto-Reply, which belongs to a template. So there are two
 * twin templates — one WITH Auto-Reply, one WITHOUT — and VITE_EMAILJS_SEND_COPY picks one:
 *   true (default) → VITE_EMAILJS_TEMPLATE_ID          (you + a copy to the sender: 2 e-mails)
 *   false          → VITE_EMAILJS_TEMPLATE_ID_NO_COPY  (only you: 1 e-mail, handy for testing)
 * Both templates keep reCAPTCHA, so neither can be abused to e-mail arbitrary addresses.
 */
export const sendCopy = (import.meta.env.VITE_EMAILJS_SEND_COPY ?? "true").trim().toLowerCase() !== "false";
const TEMPLATE_WITH_COPY = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const TEMPLATE_NO_COPY = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_NO_COPY;
const TEMPLATE_ID = sendCopy ? TEMPLATE_WITH_COPY : TEMPLATE_NO_COPY;

if (!sendCopy && !TEMPLATE_NO_COPY) {
  console.warn("VITE_EMAILJS_SEND_COPY=false pero falta VITE_EMAILJS_TEMPLATE_ID_NO_COPY: el formulario no enviará.");
}

export const emailConfigured = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);

/** Variables available in the EmailJS template: {{nombres}}, {{email}}, {{fecha}}, {{lugar}}, {{necesidad}}, {{dudas}} */
export type ContactMessage = {
  nombres: string;
  email: string;
  fecha: string;
  lugar: string;
  necesidad: string;
  dudas: string;
};

/** `captchaToken`: reCAPTCHA v2 answer, verified by EmailJS when the template has reCAPTCHA enabled. */
export async function sendContactEmail(message: ContactMessage, captchaToken?: string | null): Promise<void> {
  if (!emailConfigured) throw new Error("EmailJS no está configurado (faltan las variables VITE_EMAILJS_*).");
  const params: Record<string, unknown> = { ...message };
  if (captchaToken) params["g-recaptcha-response"] = captchaToken;
  await emailjs.send(SERVICE_ID!, TEMPLATE_ID!, params, { publicKey: PUBLIC_KEY! });
}
