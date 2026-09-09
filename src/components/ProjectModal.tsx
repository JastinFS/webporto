import { useCallback, useEffect, useRef } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { createPortal } from 'react-dom';
import type { Project } from '../content/load';
import { useScrollLock } from '../hooks/useScrollLock';
import './ProjectModal.css';

export default function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useScrollLock();

  useEffect(() => {
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab') {
        const panel = panelRef.current;
        if (!panel) return;
        const items = panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      returnFocusRef.current?.focus?.();
    };
  }, [onClose]);

  const stop = useCallback((e: ReactMouseEvent) => e.stopPropagation(), []);

  const base = project.gallery.map((src, i) => ({
    key: `${project.slug}-${i}`,
    src,
    alt: `${project.title} — gambar ${i + 1}`,
  }));
  const loop = base.length ? [...base, ...base.map((g) => ({ ...g, key: `${g.key}-dup` }))] : [];
  const duration = Math.max(8, project.gallery.length * 4);

  return createPortal(
    <div className="pmodal" onClick={onClose} role="dialog" aria-modal="true" aria-label={project.title}>
      <div className="pmodal__panel" ref={panelRef} onClick={stop} data-lenis-prevent>
        <button ref={closeRef} className="pmodal__close" onClick={onClose} aria-label="Tutup">
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
