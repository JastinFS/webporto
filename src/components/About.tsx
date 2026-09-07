import { useRef } from 'react';
import type { CSSProperties, MouseEvent } from 'react';
import { useReveal } from '../hooks/useReveal';
import { useTypewriter } from '../hooks/useTypewriter';
import { useCountUp } from '../hooks/useCountUp';
import { ABOUT, SITE } from '../content/load';
import { SideOrnament, RuneTriangle } from './Ornaments';
import './About.css';

function StatCard({ value, label, visible, i }: { value: string; label: string; visible: boolean; i: number }) {
  const shown = useCountUp(value, visible);
  return (
    <div className="stat-card" style={{ '--i': i } as CSSProperties}>
      <div className="stat-card__value">{shown}</div>
      <div className="stat-card__label">{label}</div>
    </div>
  );
}

export default function About({
  onMysticEnter,
  onMysticLeave,
}: {
  onMysticEnter: () => void;
  onMysticLeave: () => void;
}) {
  const { ref, visible } = useReveal<HTMLElement>();
  const typed = useTypewriter(ABOUT.summaryText, visible, 55);
  const portrait = ABOUT.portrait;
  const frameRef = useRef<HTMLDivElement>(null);

  const onPortraitMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = frameRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${px * 10}deg) rotateX(${-py * 10}deg) translateY(-4px)`;
  };
  const onPortraitLeave = () => {
    if (frameRef.current) frameRef.current.style.transform = '';
  };

  return (
    <section
      id="about"
      ref={ref}
      className={`about reveal${visible ? ' reveal--in' : ''}`}
      onMouseEnter={onMysticEnter}
      onMouseLeave={onMysticLeave}
    >
      <SideOrnament side="left" label="Prologue" />
      <SideOrnament side="right">
        <RuneTriangle size={20} opacity={0.6} />
      </SideOrnament>

      <div className="about__grid">
        <div className="about__portrait-wrap">
          <div
            className="about__portrait-frame"
            ref={frameRef}
            onMouseMove={onPortraitMove}
            onMouseLeave={onPortraitLeave}
          >
            <div className="about__portrait">
              {portrait ? (
                <img src={portrait} alt={`Potret ${SITE.name}`} className="img-reveal" loading="lazy" decoding="async" />
              ) : (
                <div className="about__portrait-fallback img-reveal" aria-hidden="true" />
              )}
            </div>
            <span className="about__portrait-glow" aria-hidden="true" />
          </div>
        </div>

        <div className="about__body">
          <p className="eyebrow">{ABOUT.eyebrow}</p>
          <h2 className="section-heading">{ABOUT.heading}</h2>
          <p className="about__text">
            {typed}
            {typed.length < ABOUT.summaryText.length && <span className="about__caret" />}
          </p>
          {SITE.cvFile && (
            <a className="about__cv" href={SITE.cvFile} target="_blank" rel="noreferrer">
              <span>Download CV</span>
            </a>
          )}
        </div>
      </div>

      <div className="about__stats stagger">
        {ABOUT.stats.map((s, i) => (
          <StatCard key={s.label} value={s.value} label={s.label} visible={visible} i={i} />
        ))}
      </div>

      <div className="about__ledger">
        <div className="about__ledger-col">
          <h3 className="about__ledger-title">Education</h3>
          <div className="about__entry">
            <div className="about__entry-role">{ABOUT.education.degree}</div>
            <div className="about__entry-org">{ABOUT.education.school}</div>
            <div className="about__entry-meta">{ABOUT.education.detail}</div>
          </div>
        </div>
        <div className="about__ledger-col">
          <h3 className="about__ledger-title">Experience</h3>
          {ABOUT.experience.map((x) => (
            <div className="about__entry" key={x.role + x.org}>
              <div className="about__entry-role">{x.role}</div>
              <div className="about__entry-org">
                {x.org} · <span>{x.period}</span>
              </div>
              <div className="about__entry-meta">{x.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
