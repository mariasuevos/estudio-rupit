# Code guide

How the estudio rupit website is built, where everything lives, and how to run it.
For the external services (TinaCMS, EmailJS, GitHub Pages, reCAPTCHA) see [SERVICES.md](SERVICES.md).

## Overview

- **Stack:** React 19 + TypeScript, bundled with Vite, routed with React Router, styled with CSS Modules.
- **Content:** JSON files in [`content/`](../content), edited through TinaCMS at `/admin`.
- **Output:** a fully static site (`dist/`). Content is imported at build time, so there is no backend and no
  runtime API. The only network calls from the browser are the contact form (EmailJS) and reCAPTCHA.
- **Hosting:** GitHub Pages, deployed by a GitHub Actions workflow on every push to `main`.

```
Editor saves in /admin ──► Tina Cloud commits JSON to GitHub ──► GitHub Actions builds ──► GitHub Pages
Developer pushes to main ─────────────────────────────────────┘
```

## Running it

### Requirements

- Node.js **26** (the version used by the deploy workflow) and npm.

### First time

```bash
npm install
cp .env.example .env   # then fill in the values you need (see below)
```

`.env` is git-ignored. You only need the variables for the parts you want to use:

| To use… | You need |
|---|---|
| The site and the local CMS editor | nothing |
| The contact form | `VITE_EMAILJS_*` |
| The "I'm not a robot" checkbox | `VITE_RECAPTCHA_SITE_KEY` |
| `npm run build` (production build with the Tina admin) | `TINA_CLIENT_ID`, `TINA_TOKEN` |

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Site + local TinaCMS server. Site: http://localhost:5173 · editor: http://localhost:5173/admin/index.html |
| `npm run dev:site` | Site only, without Tina (faster; content edits must be made in the JSON files) |
| `npm run build` | Builds the Tina admin and the static site into `dist/` (needs Tina Cloud credentials) |
| `npm run build:site` | Builds the static site only, without the admin (no credentials needed) |
| `npm run preview` | Serves the contents of `dist/` locally to check a build |
| `npm run typecheck` | Type-checks the project with TypeScript |

In local mode (`npm run dev`), saving in the editor writes straight to the files in `content/` and
`public/uploads/`; commit them with git as usual. In production, Tina Cloud commits them for you.

To test the build as it runs on GitHub Pages (in a sub-folder):

```bash
BASE_PATH=/estudio-rupit/ npm run build:site && npm run preview
```

## Project structure

```
.github/workflows/deploy.yml   Build + deploy to GitHub Pages (see SERVICES.md)
content/                       Editable content (JSON), managed by TinaCMS
public/
  brand/                       Web-sized logos used by the site
  uploads/                     Images and video managed by TinaCMS (the media library)
  admin/                       Generated Tina admin (git-ignored, do not edit)
src/
  main.tsx                     Entry point: mounts <App /> inside the router
  App.tsx                      Route table
  content.ts                   Loads every content/*.json file, with types
  env.d.ts                     Types for the VITE_* environment variables
  assets/                      Files bundled by Vite: fonts, logo marks used by the menu
  components/                  Reusable UI pieces
  lib/                         Logic with no UI
  pages/                       One component per route
  styles/                      Global CSS: tokens, fonts, typography, reset
tina/config.ts                 CMS schema (what editors can change)
index.html                     HTML shell; title and description are injected at build time
vite.config.ts                 Vite config + two small build plugins
.env.example                   Template for .env
```

The original brand files (full-size logos, fonts, style guide) are kept outside the repo, in
`../web-mar-brand-assets`.

### Routes

Defined in [`src/App.tsx`](../src/App.tsx). Every page except the home page is wrapped in `Layout`.

| URL | Page component | Content file |
|---|---|---|
| `/` | [`Home`](../src/pages/Home.tsx) | `content/home.json` |
| `/sobre-rupit` | [`AboutPage`](../src/pages/AboutPage.tsx) | `content/sobre-rupit.json` |
| `/servicios`, `/servicios/:category`, `/servicios/:category/:sub` | [`ServicesPage`](../src/pages/ServicesPage.tsx) | `content/servicios.json` |
| `/proyectos` | [`ProjectsPage`](../src/pages/ProjectsPage.tsx) | `content/proyectos.json` |
| `/contacto` | [`ContactPage`](../src/pages/ContactPage.tsx) | `content/contacto.json` |
| `/:slug` (e.g. `/aviso-legal`) | [`ContentPage`](../src/pages/ContentPage.tsx) | `content/pages/<slug>.json` |

Menu and footer texts for every page come from `content/site.json`.

### Content (`content/`)

| File | What it holds |
|---|---|
| `site.json` | Site title and description, the 4 menu links (moon, dot, dot, dot), footer (Instagram, e-mail, tagline, legal links) |
| `home.json` | Home hero photo and the photo shown while hovering the menu |
| `sobre-rupit.json` | Heading, intro text, closing line, the two names, the slideshow photos |
| `servicios.json` | Intro text, general video (or photos), categories → optional sub-options → photo lists |
| `proyectos.json` | Intro text and one carousel per project (title, description, photos) |
| `contacto.json` | Page text, button text, form messages, and each form field's label / hint / placeholder |
| `pages/*.json` | Generic pages (legal texts). **The file name is the URL**: `pages/aviso-legal.json` → `/aviso-legal` |

[`src/content.ts`](../src/content.ts) imports these files and exports them typed (`siteSettings`, `home`,
`about`, `services`, `projects`, `contact`, `pages`). Components always read content from there, never from
the JSON directly. It also rewrites media paths for the sub-folder (see [Base path](#base-path-sub-folder)).

Service URLs are generated from the names with `slugify` ([`src/lib/text.ts`](../src/lib/text.ts)):
"Detalles para invitados" → `/servicios/detalles-para-invitados`. Renaming a category in the CMS changes its URL.

Text fields that allow several paragraphs separate them with a blank line; `paragraphs()` in the same file
splits them.

### Components (`src/components/`)

| Component | Purpose |
|---|---|
| `LogoNav` | **The logo is the menu.** Each mark (moon + 3 dots) is a link. `variant="hero"`: horizontal, white, with wordmark (home). `variant="vertical"`: symbol rotated, plum, current section solid and the rest faded (inner pages). Mark positions are measured in pixels of the original logo file. |
| `Layout` | Shell of the inner pages: vertical menu + page + footer. On phones it moves the contact details to the top-right. Pages listed in `BEIGE_PAGES` get a beige background. |
| `Footer` | Full-screen footer with vertical wordmark, contact and legal links (not on the home page). |
| `PageIntro` | Italic intro text at the top-right (servicios, proyectos). |
| `Slideshow` | Photos that cross-fade one after another (sobre rupit). |
| `PhotoList` | Vertical list of photos with captions (servicios). |
| `Carousel` | Endless row of photos drifting left (proyectos). |
| `Lightbox` | Full-screen photo viewer with previous/next, Esc and arrow keys. |
| `Recaptcha` | Google reCAPTCHA v2 checkbox. Renders nothing if no site key is set. |

### Logic (`src/lib/`)

| File | Purpose |
|---|---|
| `text.ts` | `slugify()` (names → URLs) and `paragraphs()` |
| `services.ts` | `resolveService()`: works out what `/servicios/...` shows on desktop and on phones (selected option, list vs. detail view, not found) |
| `email.ts` | Sends the contact form through EmailJS; picks the template with or without copy to the sender |
| `useFitScreen.ts` | Pages that fit on one screen get exactly the visible height and no scrolling at all (fixes Chrome on Android drawing under the navigation bar). Sets `--app-height` and the `html.fits-screen` class. |

### Pages (`src/pages/`)

Each page has a `.tsx` file and a `.module.css` file next to it. Some notes:

- **ServicesPage**: on desktop, categories with sub-options unfold them and keep showing the general video until
  one is picked. On phones `/servicios` is a beige list of every category and option, and each other URL shows only
  that option's text and photos. The comment at the top of the file describes every case.
- **ProjectsPage / `projectLayouts/`**: there are two phone layouts being compared (`option1`, `option2`). The first
  is the default; `/proyectos?opcion=2` shows the other, and a button switches between them. To keep only one,
  delete the other `.module.css` file and its line in [`projectLayouts/index.ts`](../src/pages/projectLayouts/index.ts);
  the button disappears by itself.
- **ContactPage**: the form fields are fixed in code (`FIELDS`), because their names are the variables used in the
  e-mail template. Their texts come from `contacto.json`. Anti-spam measures are described in
  [SERVICES.md](SERVICES.md#anti-spam-measures).

### Styles (`src/styles/`)

| File | Purpose |
|---|---|
| `tokens.css` | **Single source of truth for the look**: brand colors, fonts, type scale, spacing, sizes. Change values here. |
| `fonts.css` | `@font-face` declarations (self-hosted Josefin Sans; instructions to add Agenda One) |
| `typography.css` | Text styles from the style guide: `.t-name`, `.t-accent`, `.t-body`, `.t-nav`, `.t-lead`, `.t-caption`… |
| `global.css` | Base styles and utilities (`.measure`, `.visually-hidden`, `fits-screen` scroll lock) |
| `reset.css` | CSS reset |

Rules: components only use CSS variables from `tokens.css` and the `.t-*` classes, never hard-coded colors, fonts
or sizes. Component styles use CSS Modules (`styles.xxx`), so class names never clash.

### Brand rules

- Colors: plum `#4d4045` (text) and beige `#e8debc` (accents) on white.
- Josefin Sans regular → navigation and names (uppercase, tracking 60 = `0.06em`).
- Agenda One italic → subtitles; Agenda One light → body text. Until the Agenda One files are added, Josefin Sans
  italic / light is used ("plan b"). See the steps at the top of `src/styles/fonts.css`.
- Photos named `public/uploads/provisional-*` are low-res crops of the mockups and must be replaced.

## Build details (`vite.config.ts`)

Two small plugins run during the build:

- **`staticRoutes`**: the site is a single-page app, so after building it copies `index.html` into one folder per
  page (`dist/sobre-rupit/index.html`, `dist/servicios/papeleria/index.html`, …) and to `dist/404.html`. Every URL
  then works when opened directly on any static host, without rewrite rules. The list of pages is read from the menu
  in `site.json`, the files in `content/pages/` and the categories in `servicios.json`.
- **`siteMeta`**: writes the site title and description (TinaCMS → *Ajustes del sitio*) into `<head>`, for search
  engines and link previews.

### Base path (sub-folder)

On GitHub Pages the site is served from `/estudio-rupit/`, not from `/`. The `BASE_PATH` environment variable
(set in the deploy workflow) tells every part about it:

- Vite (`base`), the router (`basename` in `main.tsx`) and the Tina admin (`build.basePath` in `tina/config.ts`).
- Media paths saved by Tina (`/uploads/…`) are prefixed automatically in `src/content.ts` (`withBase`).
- **In code, files in `public/` must be referenced with `asset("/…")`**, e.g. `asset("/brand/logo.png")`, never as
  a bare `"/brand/logo.png"`.

Without `BASE_PATH` (local development) the base is `/`.

## Common tasks

| I want to… | Where |
|---|---|
| Change a text or photo | The CMS at `/admin`, or the JSON in `content/` |
| Add a legal / generic page | CMS → *Páginas* → new (or add `content/pages/<url>.json`); link it from the footer in *Ajustes del sitio* |
| Add an editable field | Add it to the schema in `tina/config.ts`, to the type in `src/content.ts`, then use it in the page |
| Change a color, font or size | `src/styles/tokens.css` |
| Add a new route | `src/App.tsx` + a component in `src/pages/` (and a menu link in `site.json` so the build creates its folder) |
| Change the form fields | `FIELDS` in `ContactPage.tsx`, `ContactMessage` in `src/lib/email.ts`, the `fields` list in `tina/config.ts` and the EmailJS template |
