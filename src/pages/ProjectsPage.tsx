import { useState } from "react";
import { useSearchParams } from "react-router";
import { useProjects } from "../content";
import PageIntro from "../components/PageIntro";
import Carousel from "../components/Carousel";
import Lightbox from "../components/Lightbox";
import { projectLayout } from "./projectLayouts";
import LayoutSwitch from "./projectLayouts/LayoutSwitch";
import styles from "./ProjectsPage.module.css";

/**
 * "proyectos": one endless carousel per project; clicking a photo opens it full screen.
 * Phones: no intro; title and description under each carousel. Sizes come from the chosen layout
 * (./projectLayouts: "opción 1", "opción 2"…), switched with ?opcion= and the button at the top.
 */
export default function ProjectsPage() {
  const projects = useProjects();
  const list = projects.projects ?? [];
  const [open, setOpen] = useState<{ project: number; photo: number } | null>(null);
  const [params] = useSearchParams();
  const layout = projectLayout(params.get("opcion"));

  return (
    <article className={`${styles.page} ${layout.className}`}>
      <h1 className="visually-hidden">proyectos</h1>
      <div className={styles.intro}>
        <PageIntro text={projects.intro} />
      </div>

      <LayoutSwitch current={layout} />

      <div className={styles.projects}>
        {list.map((project, p) => (
          <section key={p} className={styles.project} aria-label={project.title}>
            <Carousel
              photos={project.photos ?? []}
              offset={(p * 0.37) % 1}
              onOpen={(photo) => setOpen({ project: p, photo })}
            />
            {project.title && <h2 className={`t-caption ${styles.caption}`}>{project.title}</h2>}
            {project.description && <p className={styles.description}>{project.description}</p>}
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
