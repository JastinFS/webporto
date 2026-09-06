import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Project } from '../content/load';
import './ProjectModal.css';

export default function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const base = project.gallery.map((src, i) => ({
    key: `${project.slug}-${i}`,
    src,
    alt: `${project.title} — gambar ${i + 1}`,
  }));
  const loop = base.length ? [...base, ...base.map((g) => ({ ...g, key: `${g.key}-dup` }))] : [];
  const duration = Math.max(8, project.gallery.length * 4);

  return createPortal(
    <div className="pmodal" onClick={onClose} role="dialog" aria-modal="true" aria-label={project.title}>
      <div className="pmodal__panel" onClick={(e) => e.stopPropagation()}>
        <button className="pmodal__close" onClick={onClose} aria-label="Tutup">
          ×
        </button>

        {project.category && <div className="pmodal__kicker">{project.category}</div>}
        <h3 className="pmodal__title">{project.title}</h3>

        {project.tags.length > 0 && (
          <div className="pmodal__tags">
            {project.tags.map((t) => (
              <span key={t} className="pmodal__tag">{t}</span>
            ))}
          </div>
        )}

        <div
          className="pmodal__body"
          dangerouslySetInnerHTML={{ __html: project.bodyHtml }}
        />

        {(project.repo || project.demo) && (
          <div className="pmodal__links">
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noreferrer" className="pmodal__link">
                Live Demo &rarr;
              </a>
            )}
            {project.repo && (
              <a href={project.repo} target="_blank" rel="noreferrer" className="pmodal__link pmodal__link--ghost">
                Source Code &rarr;
              </a>
            )}
          </div>
        )}

        {loop.length > 0 && (
          <div className="pmodal__gallery-mask">
            <div
              className="pmodal__gallery"
              style={{ animationDuration: `${duration}s` }}
              onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = 'paused')}
              onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = 'running')}
            >
              {loop.map((g) => (
                <div className="pmodal__frame" key={g.key}>
                  <img src={g.src} alt={g.alt} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
