import { useState } from 'react';
import type { CSSProperties } from 'react';
import { useReveal } from '../hooks/useReveal';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { SKILLS } from '../content/load';
import { SideOrnament, RuneRings } from './Ornaments';
import './Skills.css';

const CARDS = SKILLS.cards;
const TOOLS = SKILLS.marquee;
const N = CARDS.length;

export default function Skills() {
  const { ref, visible } = useReveal<HTMLElement>();
  const [hovered, setHovered] = useState<string | null>(null);
  const [flipped, setFlipped] = useState<string | null>(null);
  const compact = useMediaQuery('(max-width: 768px)');

  const ticker = [...TOOLS, ...TOOLS];
  const toggle = (id: string) => setFlipped((f) => (f === id ? null : id));

  return (
    <section
      id="skills"
      ref={ref}
      className={`skills reveal${visible ? ' reveal--in' : ''}`}
    >
      <SideOrnament side="left">
        <RuneRings size={20} spin={24} spinDir="ccw" opacity={0.6} />
      </SideOrnament>
      <SideOrnament side="right" label="Tarot" />

      <p className="eyebrow">{SKILLS.eyebrow}</p>
      <h2 className="section-heading">{SKILLS.heading}</h2>
      <p className="skills__hint">
        {compact ? 'Ketuk kartu untuk membaca ramalannya.' : SKILLS.hint}
      </p>

      {/* Full-bleed tool ticker — two rows, opposite directions */}
      <div className="skills__ticker-wrap">
        <div className="skills__ticker">
          {ticker.map((name, i) => (
            <div
              key={`a-${name}-${i}`}
              className="skills__ticker-bob"
              style={{ animationDelay: `${(i % TOOLS.length) * 0.28}s` }}
            >
              <div className="skills__chip">
                <span className="skills__chip-star">✦</span>
                <span className="skills__chip-name">{name}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="skills__ticker skills__ticker--rev">
          {ticker.map((name, i) => (
            <div
              key={`b-${name}-${i}`}
              className="skills__ticker-bob"
              style={{ animationDelay: `${(i % TOOLS.length) * 0.19}s` }}
            >
              <div className="skills__chip skills__chip--ghost">
                <span className="skills__chip-star">✦</span>
                <span className="skills__chip-name">{name}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="skills__ticker-fade skills__ticker-fade--l" />
        <div className="skills__ticker-fade skills__ticker-fade--r" />
      </div>

      {compact ? (
        /* -------- Mobile / small: upright grid, tap reveals a scrollable panel -------- */
        <div className="skills__grid">
          {CARDS.map((sk) => {
            const isOpen = flipped === sk.id;
            return (
              <div
                key={sk.id}
                className={`arcana arcana--flat${isOpen ? ' is-open' : ''}`}
                onClick={() => toggle(sk.id)}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggle(sk.id);
                  }
                }}
                aria-label={`${sk.title} — ${sk.desc}`}
              >
                <div className="arcana__face arcana__front">
                  <div className="arcana__art">
                    {sk.image ? <img src={sk.image} alt="" /> : <div className="arcana__art-fallback" />}
                  </div>
                  <div className="arcana__scrim" />
                  <div className="arcana__icon">{sk.icon}</div>
                  <div className="arcana__rule" />
                  <div className="arcana__title">{sk.title}</div>
                </div>
                <div className="arcana__panel" aria-hidden={!isOpen}>
                  <div className="arcana__back-title">{sk.title}</div>
                  <div className="arcana__desc">{sk.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* -------- Desktop: fanned tarot with 3D flip -------- */
        <div className="skills__fan">
          <span className="skills__fan-aura" aria-hidden="true" />
          {CARDS.map((sk, i) => {
            const angle = (i - (N - 1) / 2) * 11;
            const isFlipped = flipped === sk.id;
            const isHovered = hovered === sk.id;
            const isDimmed = hovered !== null && !isHovered;

            const wrapStyle: CSSProperties = {
              transform: `rotate(${angle}deg) translateY(${Math.abs(angle) * 2.6 + (isHovered ? -26 : 0)}px) scale(${isHovered ? 1.08 : 1})`,
              opacity: isDimmed ? 0.4 : 1,
              filter: isHovered ? 'drop-shadow(0 0 22px rgba(212,175,55,0.55))' : 'none',
              zIndex: isHovered ? 10 : 1,
            };
            const innerStyle: CSSProperties = {
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            };

            return (
              <div
                key={sk.id}
                className="arcana"
                style={wrapStyle}
                onMouseEnter={() => setHovered(sk.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => toggle(sk.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggle(sk.id);
                  }
                }}
                aria-label={`${sk.title} — ${sk.desc}`}
              >
                <div className="arcana__inner" style={innerStyle}>
                  <div className="arcana__face arcana__front">
                    <div className="arcana__art">
                      {sk.image ? <img src={sk.image} alt="" /> : <div className="arcana__art-fallback" />}
                    </div>
                    <div className="arcana__scrim" />
                    <div className="arcana__icon">{sk.icon}</div>
                    <div className="arcana__rule" />
                    <div className="arcana__title">{sk.title}</div>
                  </div>
                  <div className="arcana__face arcana__back">
                    <div className="arcana__back-title">{sk.title}</div>
                    <div className="arcana__desc">{sk.desc}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
