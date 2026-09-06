import { useEffect, useState } from 'react';
import { smoothScrollTo, scrollToTop } from '../utils/scroll';
import { useMagnetic } from '../hooks/useMagnetic';
import { SITE } from '../content/load';
import './Navbar.css';

const LINKS = [
  { id: 'about', label: 'ABOUT' },
  { id: 'skills', label: 'SKILLS' },
  { id: 'projects', label: 'PROJECTS' },
  { id: 'contact', label: 'CONTACT' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const ctaRef = useMagnetic<HTMLButtonElement>();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const ids = LINKS.map((l) => l.id);
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <nav className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
      <button className="nav__brand" onClick={scrollToTop} aria-label="Kembali ke atas">
        <span className="nav__mark">{SITE.monogram}</span>
        <span className="nav__name">{SITE.navName}</span>
      </button>

      <div className="nav__links">
        {LINKS.map((l) => (
          <button
            key={l.id}
            className={`nav__link${active === l.id ? ' nav__link--active' : ''}`}
            onClick={() => smoothScrollTo(l.id)}
          >
            {l.label}
          </button>
        ))}
      </div>

      <button ref={ctaRef} className="nav__cta" onClick={() => smoothScrollTo('projects')}>
        <span>VIEW MY WORK</span>
      </button>
    </nav>
  );
}
