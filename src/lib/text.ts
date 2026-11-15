/** "Detalles para invitados" → "detalles-para-invitados" (used for service URLs). */
export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " y ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Splits CMS text into paragraphs (separated by a blank line). */
export const paragraphs = (text?: string) => (text ?? "").split(/\n\s*\n/).filter(Boolean);
