import { useEffect, useRef } from 'react';
import { SKILLS } from '../content/load';

const CARDS = SKILLS.cards;
import './CursorTrail.css';

const ROT = [-9, 7, -5, 11, -6];
const COUNT = 5;

/**
 * Five arcana cards that chase the pointer while it is inside a
 * "mystic zone" (Hero / About). Pure imperative rAF animation —
 * no re-renders. Disabled for touch / coarse pointers.
 */
export default function CursorTrail({ active }: { active: boolean }) {
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const activeRef = useRef(active);
  const pos = useRef(Array.from({ length: COUNT }, () => ({ x: -200, y: -200 })));
  const target = useRef({ x: -200, y: -200 });

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const fine = window.matchMedia?.('(hover: hover) and (pointer: fine)').matches;
    if (!fine) return;

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    let raf = requestAnimationFrame(function tick() {
      let prevX = target.current.x;
      let prevY = target.current.y;
      for (let i = 0; i < COUNT; i++) {
        const p = pos.current[i];
        const ease = activeRef.current ? 0.2 - i * 0.015 : 0.06;
        p.x += (prevX - p.x) * ease;
        p.y += (prevY - p.y) * ease;
        const el = refs.current[i];
        if (el) {
          const opacity = activeRef.current ? Math.max(0, 0.95 - i * 0.16) : 0;
          el.style.transform = `translate3d(${p.x - 32}px, ${p.y - 46}px, 0) rotate(${ROT[i]}deg)`;
          el.style.opacity = String(opacity);
        }
        prevX = p.x;
        prevY = p.y;
      }
      raf = requestAnimationFrame(tick);
    });

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {Array.from({ length: COUNT }, (_, i) => (
        <div
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className="trail-card"
          aria-hidden="true"
        >
          <span className="trail-card__icon">{CARDS[i]?.icon}</span>
          <span className="trail-card__rule" />
          <span className="trail-card__title">{CARDS[i]?.title}</span>
        </div>
      ))}
    </>
  );
}
