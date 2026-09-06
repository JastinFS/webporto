import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import './IntroLoader.css';

const KEY = 'js-intro-seen';

export default function IntroLoader({ onDone }: { onDone?: () => void }) {
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState<'run' | 'open' | 'gone'>(() =>
    typeof sessionStorage !== 'undefined' && sessionStorage.getItem(KEY) ? 'gone' : 'run',
  );
  const [pct, setPct] = useState(0);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    if (phase === 'gone') {
      doneRef.current?.();
      return;
    }
    document.body.style.overflow = 'hidden';

    const total = reduced ? 300 : 1700;
    const start = performance.now();
    let raf = requestAnimationFrame(function tick(now) {
      const t = Math.min(1, (now - start) / total);
      setPct(Math.round(t * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setPhase('open');
        setTimeout(() => {
          setPhase('gone');
          document.body.style.overflow = '';
          try {
            sessionStorage.setItem(KEY, '1');
          } catch {
            /* ignore */
          }
          doneRef.current?.();
        }, reduced ? 120 : 900);
      }
    });
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (phase === 'gone') return null;

  return (
    <div className={`intro intro--${phase}`} aria-hidden="true">
      <div className="intro__panel intro__panel--t" />
      <div className="intro__panel intro__panel--b" />
      <div className="intro__core">
        <svg viewBox="0 0 200 200" className="intro__sigil">
          <circle className="intro__draw" cx="100" cy="100" r="92" pathLength={1} />
          <circle className="intro__draw intro__draw--d2" cx="100" cy="100" r="70" pathLength={1} />
          <polygon
            className="intro__draw intro__draw--d3"
            points="100,20 168,140 32,140"
            pathLength={1}
          />
          <polygon
            className="intro__draw intro__draw--d4"
            points="100,180 32,60 168,60"
            pathLength={1}
          />
        </svg>
        <div className="intro__mono">JS</div>
        <div className="intro__pct">{pct.toString().padStart(3, '0')}</div>
      </div>
    </div>
  );
}
