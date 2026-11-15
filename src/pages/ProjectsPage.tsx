import { useState } from "react";
import { projects } from "../content";
import PageIntro from "../components/PageIntro";
import Carousel from "../components/Carousel";
import Lightbox from "../components/Lightbox";
import styles from "./ProjectsPage.module.css";

/** "proyectos": one endless carousel per project; clicking a photo opens it full screen. */
export default function ProjectsPage() {
  const list = projects.projects ?? [];
  const [open, setOpen] = useState<{ project: number; photo: number } | null>(null);

  return (
    <article className={styles.page}>
      <h1 className="visually-hidden">proyectos</h1>
      <PageIntro text={projects.intro} />

      <div className={styles.projects}>
        {list.map((project, p) => (
          <section key={p} className={styles.project} aria-label={project.title}>
            <Carousel
              photos={project.photos ?? []}
              offset={(p * 0.37) % 1}
              onOpen={(photo) => setOpen({ project: p, photo })}
            />
            {project.title && <h2 className={`t-caption ${styles.caption}`}>{project.title}</h2>}
          </section>
        ))}
      </div>

      {open && (
        <Lightbox
          photos={list[open.project]?.photos ?? []}
          index={open.photo}
          onChange={(photo) => setOpen({ ...open, photo })}
          onClose={() => setOpen(null)}
        />
      )}
    </article>
  );
}
