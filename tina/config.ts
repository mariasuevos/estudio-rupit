import { defineConfig } from "tinacms";

// Set by Tina Cloud in production; local mode needs none of them.
const branch =
  process.env.TINA_BRANCH ||
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

/** A list of photos with a caption, reused by every service option. */
const photoListField = {
  type: "object" as const,
  name: "items",
  label: "Fotos",
  list: true,
  ui: { itemProps: (item: { caption?: string }) => ({ label: item?.caption || "Foto" }) },
  fields: [
    { type: "image" as const, name: "image", label: "Foto", required: true },
    { type: "string" as const, name: "caption", label: "Pie de foto" },
    { type: "string" as const, name: "alt", label: "Descripción de la foto (accesibilidad)" },
  ],
};

/** Text shown above a service option's photos on phones. */
const serviceDescriptionField = {
  type: "string" as const,
  name: "description",
  label: "Texto (se ve en móvil, encima de las fotos)",
  description: "En mayúsculas y cursiva. Separa los párrafos con una línea en blanco.",
  ui: { component: "textarea" as const },
};

export default defineConfig({
  branch,
  clientId: process.env.TINA_CLIENT_ID || null,
  token: process.env.TINA_TOKEN || null,

  build: {
    outputFolder: "admin", // admin UI served at /admin
    basePath: (process.env.BASE_PATH || "").replace(/^\/|\/$/g, ""), // "estudio-rupit" on GitHub Pages
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public",
    },
  },

  schema: {
    collections: [
      {
        name: "settings",
        label: "Ajustes del sitio",
        path: "content",
        format: "json",
        match: { include: "site" },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: "string", name: "title", label: "Nombre del sitio", isTitle: true, required: true },
          { type: "string", name: "description", label: "Descripción", ui: { component: "textarea" } },
          {
            type: "object",
            name: "nav",
            label: "Navegación",
            description:
              "4 enlaces. Inicio: media luna, punto, punto, punto (izq. → dcha.). Páginas interiores: punto, punto, punto, media luna (arriba → abajo).",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.label }) },
            fields: [
              { type: "string", name: "label", label: "Texto", required: true },
              { type: "string", name: "href", label: "Enlace", required: true },
            ],
          },
          {
            type: "object",
            name: "footer",
            label: "Pie de página",
            fields: [
              { type: "string", name: "instagram", label: "Instagram", description: "Usuario, p. ej. @estudio.rupit" },
              { type: "string", name: "email", label: "Email" },
              {
                type: "string",
                name: "homeLabel",
                label: "Texto del enlace a inicio (móvil, arriba a la derecha)",
                description: "P. ej. Inicio",
              },
              {
                type: "string",
                name: "tagline",
                label: "Descripción",
                description: "Los saltos de línea se respetan.",
                ui: { component: "textarea" },
              },
              {
                type: "object",
                name: "legalLinks",
                label: "Enlaces legales",
                list: true,
                ui: { itemProps: (item) => ({ label: item?.label }) },
                fields: [
                  { type: "string", name: "label", label: "Texto", required: true },
                  {
                    type: "string",
                    name: "href",
                    label: "Enlace",
                    description: "Las páginas legales están en Páginas (p. ej. /aviso-legal).",
                    required: true,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: "home",
        label: "Inicio",
        path: "content",
        format: "json",
        match: { include: "home" },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: "image", name: "heroImage", label: "Foto de portada" },
          { type: "string", name: "heroAlt", label: "Descripción de la foto (accesibilidad)" },
          {
            type: "image",
            name: "heroHoverImage",
            label: "Foto al pasar el ratón por el menú",
            description: "Sustituye a la foto de portada mientras el ratón está sobre la media luna o un punto del logo.",
          },
          { type: "string", name: "heroHoverAlt", label: "Descripción de la foto al pasar el ratón (accesibilidad)" },
        ],
      },
      {
        name: "about",
        label: "Sobre rupit",
        path: "content",
        format: "json",
        match: { include: "sobre-rupit" },
        ui: { allowedActions: { create: false, delete: false }, router: () => "/sobre-rupit" },
        fields: [
          { type: "string", name: "heading", label: "Titular (cursiva, en mayúsculas)", ui: { component: "textarea" } },
          {
            type: "string",
            name: "intro",
            label: "Texto (cursiva)",
            description: "Separa los párrafos con una línea en blanco.",
            ui: { component: "textarea" },
          },
          { type: "string", name: "closing", label: "Frase final (sobre los nombres)" },
          { type: "string", name: "nameLeft", label: "Nombre izquierda" },
          { type: "string", name: "nameRight", label: "Nombre derecha" },
          {
            type: "object",
            name: "gallery",
            label: "Fotos (van pasando solas)",
            description: "Se muestran en este orden, una tras otra, cada pocos segundos. Puedes añadir todas las que quieras.",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.alt || item?.image }) },
            fields: [
              { type: "image", name: "image", label: "Foto", required: true },
              { type: "string", name: "alt", label: "Descripción de la foto (accesibilidad)" },
            ],
          },
        ],
      },
      {
        name: "services",
        label: "Servicios",
        path: "content",
        format: "json",
        match: { include: "servicios" },
        ui: { allowedActions: { create: false, delete: false }, router: () => "/servicios" },
        fields: [
          {
            type: "string",
            name: "intro",
            label: "Texto de entrada (cursiva, arriba a la derecha)",
            ui: { component: "textarea" },
          },
          {
            type: "image",
            name: "video",
            label: "Vídeo de la página general",
            description:
              "Se ve al entrar en servicios, antes de elegir ninguna categoría (archivo .mp4). Si lo quitas, se muestran las fotos de abajo.",
          },
          {
            ...photoListField,
            label: "Fotos de la página general (si no hay vídeo)",
            description: "Se ven al entrar en servicios, antes de elegir ninguna categoría, solo si no hay vídeo.",
          },
          {
            type: "object",
            name: "categories",
            label: "Categorías (menú de la izquierda)",
            description:
              "Cada categoría tiene su propia lista de fotos. Si tiene opciones desplegables, al pulsarla se despliegan a su derecha y se siguen viendo las fotos de la página general hasta elegir una opción.",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.title }) },
            fields: [
              { type: "string", name: "title", label: "Nombre", required: true },
              serviceDescriptionField,
              photoListField,
              {
                type: "object",
                name: "subcategories",
                label: "Opciones desplegables (p. ej. las de Papelería o Escenografía)",
                list: true,
                ui: { itemProps: (item) => ({ label: item?.title }) },
                fields: [
                  { type: "string", name: "title", label: "Nombre", required: true },
                  serviceDescriptionField,
                  photoListField,
                ],
              },
            ],
          },
        ],
      },
      {
        name: "projects",
        label: "Proyectos",
        path: "content",
        format: "json",
        match: { include: "proyectos" },
        ui: { allowedActions: { create: false, delete: false }, router: () => "/proyectos" },
        fields: [
          {
            type: "string",
            name: "intro",
            label: "Texto de entrada (cursiva, arriba a la derecha)",
            ui: { component: "textarea" },
          },
          {
            type: "object",
            name: "projects",
            label: "Proyectos (un carrusel cada uno)",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.title }) },
            fields: [
              { type: "string", name: "title", label: "Nombre (pie del carrusel)" },
              {
                type: "string",
                name: "description",
                label: "Descripción (se ve en móvil, bajo el nombre)",
                ui: { component: "textarea" },
              },
              {
                type: "object",
                name: "photos",
                label: "Fotos del carrusel",
                list: true,
                ui: { itemProps: (item) => ({ label: item?.alt || item?.image?.split("/").pop() }) },
                fields: [
                  { type: "image", name: "image", label: "Foto", required: true },
                  { type: "string", name: "alt", label: "Descripción de la foto (accesibilidad)" },
                ],
              },
            ],
          },
        ],
      },
      {
        name: "contact",
        label: "Contacto",
        path: "content",
        format: "json",
        match: { include: "contacto" },
        ui: { allowedActions: { create: false, delete: false }, router: () => "/contacto" },
        fields: [
          {
            type: "string",
            name: "text",
            label: "Texto (abajo a la izquierda, mayúsculas en cursiva)",
            description: "Separa los párrafos con una línea en blanco.",
            ui: { component: "textarea" },
          },
          { type: "string", name: "submitLabel", label: "Texto del botón" },
          { type: "string", name: "successMessage", label: "Mensaje al enviar correctamente" },
          { type: "string", name: "duplicateMessage", label: "Mensaje si se envía otra vez lo mismo" },
          { type: "string", name: "captchaMessage", label: "Mensaje si no se marca «No soy un robot»" },
          { type: "string", name: "errorMessage", label: "Mensaje si falla el envío" },
          {
            type: "object",
            name: "fields",
            label: "Campos del formulario",
            description: "Textos de cada campo. Los campos en sí no se pueden añadir ni quitar (los usa el e-mail).",
            fields: [
              ["nombres", "Nombres"],
              ["email", "E-mail"],
              ["fecha", "Fecha prevista"],
              ["lugar", "Lugar"],
              ["necesidad", "¿Para qué nos necesitáis?"],
              ["dudas", "Cualquier otra duda"],
            ].map(([name, label]) => ({
              type: "object" as const,
              name,
              label,
              fields: [
                { type: "string" as const, name: "label", label: "Título" },
                { type: "string" as const, name: "hint", label: "Aclaración (pequeña, junto al título)" },
                { type: "string" as const, name: "placeholder", label: "Texto de ejemplo dentro del campo" },
              ],
            })),
          },
        ],
      },
      {
        name: "page",
        label: "Páginas",
        path: "content/pages",
        format: "json",
        ui: {
          // The file name is the page URL: content/pages/servicios.json → /servicios
          router: ({ document }) => `/${document._sys.filename}`,
        },
        fields: [
          { type: "string", name: "title", label: "Título (nombre)", isTitle: true, required: true },
          { type: "string", name: "subtitle", label: "Subtítulo (cursiva)" },
          {
            type: "string",
            name: "body",
            label: "Texto",
            description: "Separa los párrafos con una línea en blanco.",
            ui: { component: "textarea" },
          },
          { type: "image", name: "image", label: "Imagen" },
          { type: "string", name: "imageAlt", label: "Descripción de la imagen (accesibilidad)" },
        ],
      },
    ],
  },
});
