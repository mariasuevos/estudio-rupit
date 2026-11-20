# estudio rupit — web

Static React site (Vite + TypeScript) with TinaCMS for content editing.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Site + Tina local server. Site: http://localhost:5173, editor: http://localhost:5173/admin/index.html |
| `npm run dev:site` | Site only, without Tina |
| `npm run build` | Tina admin + static site to `dist/` (needs Tina Cloud env vars) |
| `npm run build:site` | Static site only, no admin |

## Structure

```
public/brand/           Web-sized logos used by the site (originals: ../web-mar-brand-assets, outside the repo)
public/uploads/         Images managed by TinaCMS
src/assets/fonts/       Self-hosted fonts (Josefin Sans; Agenda One goes here when available)
src/styles/
  tokens.css            Brand colors, fonts, spacing, sizes  ← change the look here
  fonts.css             @font-face declarations
  typography.css        Text styles from the style guide (.t-name, .t-accent, .t-body, .t-nav)
  global.css            Base styles + utilities (.measure, .visually-hidden)
src/components/         LogoNav (the logo is the menu), Layout, Footer, PageIntro, Slideshow, PhotoList,
                        Carousel (endless drifting row), Lightbox (full-screen photo)
src/lib/                text.ts (slugify, paragraphs), email.ts (EmailJS)
src/pages/              Home (hero), AboutPage (/sobre-rupit), ServicesPage (/servicios/…), ProjectsPage (/proyectos), ContentPage (any page in content/pages)
content/                Editable content (JSON), managed by TinaCMS
  site.json             Site settings + menu (4 items: moon, dot 1, dot 2, dot 3)
  home.json             Home hero photo
  sobre-rupit.json      "sobre rupit": intro text, hover gallery, blocks
  servicios.json        "servicios": categories → optional sub-options → photo lists
                        URLs: /servicios/<categoria>[/<opcion>] (generated from the names)
  proyectos.json        "proyectos": one carousel per project (photos in public/uploads/proyectos/)
  contacto.json         "contacto": text, button, form messages and each form field's label/hint/placeholder
  pages/*.json          One page per file; file name = URL (pages/servicios.json → /servicios)
tina/config.ts          CMS schema
```

## Brand rules

- Colors: morado `#4d4045` (text) and beige `#e8debc` (accents) on white.
- Josefin Sans regular → navigation and names (uppercase, tracking 60 = `0.06em`).
- Agenda One italic → subtitles; Agenda One light → body text.
  Until Agenda One files are added, Josefin Sans italic / light is used ("plan b"). See `src/styles/fonts.css`.
- Components only use CSS variables from `tokens.css` and the `.t-*` text classes; no hard-coded values.
- The logo is the menu (`LogoNav`): each mark links to a section.
  - Home: horizontal, white, with wordmark; on hover the rest disappears (`--nav-fade-opacity-hero`).
  - Inner pages: the symbol turned vertical (top → bottom: dot, dot, dot, moon); the current section is solid,
    the rest faded (`--nav-fade-opacity`); on hover the name shows to the right.
- `.t-lead` is the large italic text (intro and story blocks).
- Footer (all pages except home): full-screen, vertical wordmark, contact (`.t-contact`), legal links (`.t-legal`),
  beige block on the right. Its texts are in Site settings → Pie de página; sizes in the `--footer-*` tokens.
- Photos in `public/uploads/provisional-*.jpg` are low-res crops of the Figma mockups: replace them.

## Publishing (GitHub Pages) and editing with Tina Cloud

`.github/workflows/deploy.yml` builds the site and publishes it to GitHub Pages on every push to `main`
(including the commits Tina makes when someone saves in `/admin`).

1. **GitHub → repo → Settings → Pages → Source: "GitHub Actions".**
2. **https://app.tina.io**: create a project from the GitHub repo (branch `main`).
   Site URLs: `https://mariasuevos.github.io/estudio-rupit` and `http://localhost:5173`.
   Copy the Client ID and create a read-only token. Invite the editors.
3. **GitHub → repo → Settings → Secrets and variables → Actions**:
   - Secrets: `TINA_CLIENT_ID`, `TINA_TOKEN`, `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`,
     `VITE_EMAILJS_TEMPLATE_ID_NO_COPY`, `VITE_EMAILJS_PUBLIC_KEY`, `VITE_RECAPTCHA_SITE_KEY`.
   - Variable: `VITE_EMAILJS_SEND_COPY` (`true`/`false`).
4. Push to `main` (or Actions → "Deploy to GitHub Pages" → Run workflow).
   Site: https://mariasuevos.github.io/estudio-rupit/ · editor: https://mariasuevos.github.io/estudio-rupit/admin/

### Sub-folder / custom domain

The site works in a sub-folder thanks to `BASE_PATH` (set in the workflow, `/estudio-rupit/`): Vite, the router,
Tina's admin and media paths (`src/content.ts → withBase`) all use it. For a custom domain: set the domain in
Settings → Pages, change `BASE_PATH` to `/` in the workflow, and update the Site URL in Tina Cloud.
Code must use `asset("/…")` for files in `public/` (content paths from Tina are handled automatically).

## Routing on static hosts

The build copies `index.html` into a folder per page (`dist/servicios/index.html`, …) and to `404.html`,
so every URL works on any static host without extra rewrite rules.

## Contact form (EmailJS)

The form on `/contacto` sends an e-mail through [EmailJS](https://www.emailjs.com) (free plan: 200 e-mails/month).

1. Create an EmailJS account → **Email Services** → add Gmail (or another) and connect the account that sends.
2. **Email Templates** → new template:
   - **To Email**: the address that receives the requests.
   - **Reply To**: `{{email}}` (so you can answer the couple directly).
   - **Subject**: `Nueva solicitud: {{nombres}}`
   - **Content**: use the variables `{{nombres}}`, `{{email}}`, `{{fecha}}`, `{{lugar}}`, `{{necesidad}}`, `{{dudas}}`.
3. **Account → General**: copy the *Public Key*. In **Account → Security**, restrict it to your domain.
4. Put the three IDs in `.env` (local) and in your host's environment variables:
   `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY` (see `.env.example`), then rebuild.
5. Copy to the sender (optional): `VITE_EMAILJS_TEMPLATE_ID` is a template **with** Auto-Reply; duplicate it **without**
   Auto-Reply and put its ID in `VITE_EMAILJS_TEMPLATE_ID_NO_COPY`. `VITE_EMAILJS_SEND_COPY=false` uses the one without
   (1 e-mail per test instead of 2). Keep reCAPTCHA enabled in both.

### Anti-spam

- **reCAPTCHA v2** ("No soy un robot"): create a *v2 → "I'm not a robot" checkbox* key at https://www.google.com/recaptcha/admin
  (domains: your domain + `localhost`). Site key → `VITE_RECAPTCHA_SITE_KEY`; secret key → EmailJS template → Settings →
  *Enable reCAPTCHA V2 verification*. Without `VITE_RECAPTCHA_SITE_KEY` the checkbox is not shown.
- Built into the form: honeypot field, submissions in under 3 s ignored, max length per field, duplicate requests blocked.
- In EmailJS → Account → Security: allowed domains, rate limit, and keep "non-browser applications" disabled.
