import { useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import { SKILLS } from '../content/load';
import { SideOrnament, RuneRings } from './Ornaments';
import ArcanaFrame from './ArcanaFrame';
import './Skills.css';

const CARDS = SKILLS.cards;
const TOOLS = SKILLS.marquee;

export default function Skills() {
  const { ref, visible } = useReveal<HTMLElement>();
  const [flipped, setFlipped] = useState<string | null>(null);

  const ticker = [...TOOLS, ...TOOLS];
  const toggle = (id: string) => setFlipped((f) => (f === id ? null : id));

  return (
    <section id="skills" ref={ref} className={`skills reveal${visible ? ' reveal--in' : ''}`}>
      <SideOrnament side="left">
        <RuneRings size={20} spin={24} spinDir="ccw" opacity={0.6} />
      </SideOrnament>
      <SideOrnament side="right" label="Tarot" />

      <p className="eyebrow">{SKILLS.eyebrow}</p>
      <h2 className="section-heading">{SKILLS.heading}</h2>
      <p className="skills__hint">Ketuk kartu untuk membaliknya dan membaca ramalannya.</p>

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

      {/* Tarot grid — ornate framed cards that flip on tap */}
      <div className="skills__grid">
        {CARDS.map((sk, index) => {
          const isFlipped = flipped === sk.id;
          return (
            <div
              key={sk.id}
              className={`arcana arcana--tarot has-frame${isFlipped ? ' is-flipped' : ''}`}
              onClick={() => toggle(sk.id)}
              role="button"
              tabIndex={0}
              aria-pressed={isFlipped}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggle(sk.id);
                }
              }}
              aria-label={`${sk.title} — ${sk.desc}`}
            >
              <div className="arcana__inner">
                <div className="arcana__face arcana__front">
                  <div className="arcana__art">
                    {sk.image ? <img src={sk.image} alt="" /> : <div className="arcana__art-fallback" />}
                  </div>
                  <div className="arcana__scrim" />
                  <div className="arcana__icon">{sk.icon}</div>
                  <ArcanaFrame index={index} title={sk.title} />
                </div>
                <div className="arcana__face arcana__back">
                  <div className="arcana__back-inner">
                    <div className="arcana__back-title">{sk.title}</div>
                    <div className="arcana__desc">{sk.desc}</div>
                  </div>
                  <ArcanaFrame index={index} title={sk.title} back />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
