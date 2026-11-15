import { useRef, useState, type FormEvent } from "react";
import { contact } from "../content";
import { paragraphs } from "../lib/text";
import { sendContactEmail, type ContactMessage } from "../lib/email";
import Recaptcha, { RECAPTCHA_SITE_KEY } from "../components/Recaptcha";
import styles from "./ContactPage.module.css";

/** Behaviour of each field. Their texts (label, hint, placeholder) are edited in TinaCMS → Contacto. */
type Field = {
  name: keyof ContactMessage;
  type?: "text" | "email";
  autoComplete?: string;
  rows?: number;
  required?: boolean;
  maxLength: number;
};

const FIELDS: Field[] = [
  { name: "nombres", autoComplete: "name", required: true, maxLength: 120 },
  { name: "email", type: "email", autoComplete: "email", required: true, maxLength: 120 },
  { name: "fecha", maxLength: 80 },
  { name: "lugar", maxLength: 150 },
  { name: "necesidad", rows: 4, maxLength: 3000 },
  { name: "dudas", rows: 3, maxLength: 3000 },
];

type Status = "idle" | "sending" | "sent" | "duplicate" | "captcha" | "error";

/** Bots fill forms instantly; people take longer. Faster submissions are silently ignored. */
const MIN_FILL_MS = 3000;

/*
 * Duplicate protection: a request identical to one already sent from this browser is not sent again
 * (double clicks, re-submitting the same data, or after reloading the page).
 */
const SENT_KEY = "contact:sent";

/** Same data → same key: trimmed, collapsed spaces, case-insensitive. */
const fingerprint = (m: ContactMessage) =>
  FIELDS.map((f) => m[f.name].replace(/\s+/g, " ").trim().toLowerCase()).join("\u241F");

function readSent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(SENT_KEY) ?? "[]");
  } catch {
    return [];
  }
}
function saveSent(keys: string[]) {
  try {
    localStorage.setItem(SENT_KEY, JSON.stringify(keys.slice(-20)));
  } catch {
    /* storage unavailable: the in-memory list still blocks repeats on this visit */
  }
}

const MESSAGES: Partial<Record<Status, string>> = {
  sent: contact.successMessage || "¡Gracias! Os responderemos muy pronto.",
  duplicate: contact.duplicateMessage || "Ya hemos recibido esta misma solicitud. Os responderemos muy pronto.",
  captcha: contact.captchaMessage || "Marca la casilla «No soy un robot» para enviar.",
  error: contact.errorMessage || "No se ha podido enviar. Inténtalo de nuevo o escríbenos directamente por e-mail.",
};

/** "contacto": form on the right (sent by e-mail via EmailJS), text below on the left. */
export default function ContactPage() {
  const [status, setStatus] = useState<Status>("idle");
  const sending = useRef(false); // blocks fast repeated clicks before React re-renders
  const sent = useRef(readSent());
  const openedAt = useRef(Date.now());
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaReset, setCaptchaReset] = useState(0);
  const [lengths, setLengths] = useState<Partial<Record<keyof ContactMessage, number>>>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending.current) return;
    const form = e.currentTarget;
    const data = new FormData(form);
    if (data.get("website")) return; // honeypot: filled only by bots
    if (Date.now() - openedAt.current < MIN_FILL_MS) return; // too fast to be a person
    const message = Object.fromEntries(FIELDS.map((f) => [f.name, String(data.get(f.name) ?? "").trim()])) as ContactMessage;

    const key = fingerprint(message);
    if (sent.current.includes(key)) {
      setStatus("duplicate");
      return;
    }

    if (RECAPTCHA_SITE_KEY && !captchaToken) {
      setStatus("captcha");
      return;
    }

    sending.current = true;
    setStatus("sending");
    try {
      await sendContactEmail(message, captchaToken);
      sent.current.push(key);
      saveSent(sent.current);
      setStatus("sent");
      form.reset();
      setLengths({});
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      sending.current = false;
      setCaptchaReset((n) => n + 1); // a reCAPTCHA answer can only be used once
    }
  }

  const text = paragraphs(contact.text);

  return (
    <article className={styles.page}>
      <h1 className="visually-hidden">contacto</h1>

      <form className={styles.form} onSubmit={onSubmit}>
        {FIELDS.map((f) => {
          const count = lengths[f.name] ?? 0;
          const text = contact.fields?.[f.name] ?? {};
          const props = {
            name: f.name,
            placeholder: text.placeholder,
            required: f.required,
            maxLength: f.maxLength,
            "aria-describedby": `${f.name}-left`,
            className: styles.input,
            onInput: (e: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
              const length = e.currentTarget.value.length;
              setLengths((l) => ({ ...l, [f.name]: length }));
            },
          };
          return (
            <label key={f.name} className={styles.field} data-filled={count > 0 || undefined}>
              <span className={`t-name ${styles.label}`}>
                {text.label || f.name}
                {text.hint && <span className={styles.hint}> {text.hint}</span>}
              </span>
              {f.rows ? (
                <textarea {...props} rows={f.rows} />
              ) : (
                <input {...props} type={f.type ?? "text"} autoComplete={f.autoComplete ?? "off"} />
              )}
              <span
                id={`${f.name}-left`}
                className={styles.counter}
                data-full={count >= f.maxLength || undefined}
                aria-label={`${count} de ${f.maxLength} caracteres`}
              >
                {count}/{f.maxLength}
              </span>
            </label>
          );
        })}

        {/* Honeypot: hidden from people, bots fill it in */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className={styles.honeypot} />

        <Recaptcha
          className={styles.captcha}
          resetKey={captchaReset}
          onChange={(token) => {
            setCaptchaToken(token);
            if (token) setStatus((s) => (s === "captcha" ? "idle" : s));
          }}
        />

        <button type="submit" className={`t-nav ${styles.submit}`} disabled={status === "sending"}>
          {status === "sending" ? "Enviando…" : contact.submitLabel || "Enviar"}
        </button>

        <p className={`t-lead ${styles.status}`} role="status" aria-live="polite">
          {MESSAGES[status]}
        </p>
      </form>

      {text.length > 0 && (
        <div className={`t-contact ${styles.text}`}>
          {text.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}
    </article>
  );
}
