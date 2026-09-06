import { useRef } from 'react';
import type { CSSProperties, MouseEvent } from 'react';
import type { Project } from '../content/load';
import { useTypewriter } from '../hooks/useTypewriter';

const TITLE_CPS = 13;
const DESC_CPS = 22;
const STAGGER = 400;

export default function ProjectCard({
  project,
  index,
  reveal,
  thumb,
  onOpen,
}: {
  project: Project;
  index: number;
  reveal: boolean;
  thumb?: string;
  onOpen: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const cardTitle = project.short || project.title;
  const titleDelay = index * STAGGER;
  const titleDur = (cardTitle.length / TITLE_CPS) * 1000;
  const typedTitle = useTypewriter(cardTitle, reveal, TITLE_CPS, titleDelay);
  const typedDesc = useTypewriter(project.excerpt, reveal, DESC_CPS, titleDelay + titleDur);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${px * 9}deg) rotateX(${-py * 9}deg) translateY(-6px) scale(1.02)`;
    el.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
  };
  const onLeave = () => {
    const el = cardRef.current;
    if (el) el.style.transform = 'perspective(900px) rotateY(0) rotateX(0) translateY(0) scale(1)';
  };

  return (
    <div
      ref={cardRef}
      className="project-card"
      style={{ '--i': index } as CSSProperties}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen();
        }
      }}
      aria-label={`Buka detail proyek: ${cardTitle}`}
    >
      <span className="project-card__spot" aria-hidden="true" />
      <span className="project-card__corner project-card__corner--tl" />
      <span className="project-card__corner project-card__corner--tr" />
      <span className="project-card__corner project-card__corner--bl" />
      <span className="project-card__corner project-card__corner--br" />

      <div className="project-card__thumb">
        {thumb ? (
          <img src={thumb} alt={cardTitle} loading="lazy" className="img-reveal" />
        ) : (
          <div className="project-card__thumb-fallback img-reveal" aria-hidden="true" />
        )}
        <span className="project-card__thumb-sheen" aria-hidden="true" />
      </div>

      <div className="project-card__title">{typedTitle || ' '}</div>
      <div className="project-card__desc">{typedDesc || ' '}</div>
      {project.tags.length > 0 && (
        <div className="project-card__tags">
          {project.tags.slice(0, 3).map((t) => (
            <span key={t} className="project-card__tag">{t}</span>
          ))}
        </div>
      )}
      <span className="project-card__open">Reveal &rarr;</span>
    </div>
  );
}
