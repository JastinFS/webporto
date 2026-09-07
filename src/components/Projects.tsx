import { Suspense, lazy, useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import { PROJECTS } from '../content/load';
import type { Project } from '../content/load';
import { SideOrnament, RuneTick } from './Ornaments';
import ProjectCard from './ProjectCard';
import './Projects.css';

// Modal + its markdown renderer only load when a project is opened.
const ProjectModal = lazy(() => import('./ProjectModal'));

export default function Projects() {
  const { ref, visible } = useReveal<HTMLElement>();
  const [active, setActive] = useState<Project | null>(null);

  return (
    <section
      id="projects"
      ref={ref}
      className={`projects reveal${visible ? ' reveal--in' : ''}`}
    >
      <SideOrnament side="left" label="Archive" />
      <SideOrnament side="right">
        <RuneTick size={20} spin={26} spinDir="cw" opacity={0.55} />
      </SideOrnament>

      <div className="projects__grain" aria-hidden="true" />

      <div className="projects__head">
        <p className="eyebrow">Chronicles of Work</p>
        <h2 className="section-heading">Projects</h2>
      </div>

      <div className="projects__grid">
        {PROJECTS.map((p, i) => (
          <ProjectCard
            key={p.slug}
            project={p}
            index={i}
            reveal={visible}
            thumb={p.cover || undefined}
            onOpen={() => setActive(p)}
          />
        ))}
      </div>

      {active && (
        <Suspense fallback={null}>
          <ProjectModal project={active} onClose={() => setActive(null)} />
        </Suspense>
      )}
    </section>
  );
}
