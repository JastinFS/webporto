import { useEffect, useMemo, useRef } from 'react';
import type { CSSProperties } from 'react';
import { SITE } from '../content/load';
import { smoothScrollTo } from '../utils/scroll';
import './Hero.css';

interface HeroProps {
  onMysticEnter: () => void;
  onMysticLeave: () => void;
}

// Optional hero backdrop set from content/site.md ("heroImage"),
// otherwise the layered gradient in Hero.css shows through.
const HERO_BG = SITE.heroImage || undefined;

function TitleLines() {
  const rest = SITE.heroRest.trim().split(/\s+/);
  return (
    <>
      {SITE.heroFirst}
      <br />
      <span className="hero__title-gold">
        {rest.map((word, i) => (
          <span key={i}>
            {word}
            {i < rest.length - 1 && <br />}
          </span>
        ))}
      </span>
    </>
  );
}

export default function Hero({ onMysticEnter, onMysticLeave }: HeroProps) {
  const bgRef = useRef<HTMLDivElement>(null);
  const fogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        if (bgRef.current) bgRef.current.style.transform = `translate3d(0, ${y * 0.22}px, 0)`;
        if (fogRef.current) fogRef.current.style.transform = `translate3d(0, ${y * 0.38}px, 0)`;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const particles = useMemo<CSSProperties[]>(() => {
    const arr: CSSProperties[] = [];
    for (let i = 0; i < 26; i++) {
      const left = (i * 5.3) % 100;
      const size = 1.5 + (i % 4) * 0.9;
      const duration = 10 + (i % 6) * 2.5;
      const delay = -(i * 1.1);
      arr.push({
        position: 'absolute',
        left: `${left}%`,
        bottom: '0%',
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: 'rgba(212,175,55,0.5)',
        filter: 'blur(0.5px)',
        animation: `particleFloat ${duration}s linear infinite`,
        animationDelay: `${delay}s`,
        zIndex: 2,
        pointerEvents: 'none',
      });
    }
    return arr;
  }, []);

  return (
    <header
      id="hero"
      className="hero"
      onMouseEnter={onMysticEnter}
      onMouseLeave={onMysticLeave}
    >
      {/* Parallax backdrop */}
      <div ref={bgRef} className="hero__bg">
        {HERO_BG ? <img src={HERO_BG} alt="" className="hero__bg-img" /> : null}
      </div>

      {/* Drifting fog */}
      <div ref={fogRef} className="hero__fog" aria-hidden="true">
        <span className="hero__fog-blob hero__fog-blob--1" />
        <span className="hero__fog-blob hero__fog-blob--2" />
      </div>

      {/* Rising motes */}
      {particles.map((style, i) => (
        <span key={i} style={style} aria-hidden="true" />
      ))}

      {/* Rotating rune array */}
      <div className="hero__runes" aria-hidden="true">
        <div className="hero__rays" />
        <svg viewBox="0 0 400 400" className="hero__rune hero__rune--1">
          <circle cx="200" cy="200" r="188" fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.7" />
          <circle cx="200" cy="200" r="160" fill="none" stroke="#D4AF37" strokeWidth="0.7" opacity="0.55" />
          <g stroke="#D4AF37" strokeWidth="0.8" opacity="0.65">
            <line x1="200" y1="12" x2="200" y2="40" /><line x1="200" y1="360" x2="200" y2="388" />
            <line x1="12" y1="200" x2="40" y2="200" /><line x1="360" y1="200" x2="388" y2="200" />
            <line x1="61" y1="61" x2="80" y2="80" /><line x1="339" y1="61" x2="320" y2="80" />
            <line x1="61" y1="339" x2="80" y2="320" /><line x1="339" y1="339" x2="320" y2="320" />
          </g>
        </svg>
        <svg viewBox="0 0 400 400" className="hero__rune hero__rune--2">
          <circle cx="200" cy="200" r="188" fill="none" stroke="#E8DCC4" strokeWidth="0.8" opacity="0.5" strokeDasharray="2 10" />
          <polygon points="200,30 351,289 49,289" fill="none" stroke="#D4AF37" strokeWidth="0.8" opacity="0.5" />
          <polygon points="200,370 49,111 351,111" fill="none" stroke="#D4AF37" strokeWidth="0.8" opacity="0.5" />
        </svg>
        <svg viewBox="0 0 400 400" className="hero__rune hero__rune--3">
          <circle cx="200" cy="200" r="188" fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.6" />
          <circle cx="200" cy="200" r="150" fill="none" stroke="#D4AF37" strokeWidth="0.6" opacity="0.5" strokeDasharray="4 6" />
          <g stroke="#E8DCC4" strokeWidth="0.7" opacity="0.55">
            <line x1="200" y1="10" x2="200" y2="35" /><line x1="200" y1="365" x2="200" y2="390" />
            <line x1="10" y1="200" x2="35" y2="200" /><line x1="365" y1="200" x2="390" y2="200" />
          </g>
        </svg>
        <svg viewBox="0 0 400 400" className="hero__rune hero__rune--4">
          <circle cx="200" cy="200" r="188" fill="none" stroke="#D4AF37" strokeWidth="1.2" opacity="0.7" />
          <polygon points="200,40 340,300 60,300" fill="none" stroke="#D4AF37" strokeWidth="0.8" opacity="0.5" />
        </svg>
        <div className="hero__core" />
      </div>

      {/* Vignettes */}
      <div className="hero__veil" aria-hidden="true" />
      <div className="hero__spot" aria-hidden="true" />

      {/* Sonar pulses behind the name */}
      <div className="hero__pulse" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      {/* Title block */}
      <div className="hero__content">
        <p className="hero__eyebrow">{SITE.heroKicker}</p>
        <h1 className="hero__title" data-text>
          <TitleLines />
          <span className="hero__glitch hero__glitch--1" aria-hidden="true">
            <TitleLines />
          </span>
          <span className="hero__glitch hero__glitch--2" aria-hidden="true">
            <TitleLines />
          </span>
        </h1>
      </div>

      {/* Scroll cue */}
      <button className="hero__descend" onClick={() => smoothScrollTo('about')} aria-label="Turun ke bagian About">
        <span className="hero__descend-label">DESCEND</span>
        <span className="hero__descend-line" />
      </button>
    </header>
  );
}
