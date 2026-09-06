import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

/**
 * Reveals `text` character-by-character at `cps` characters per second
 * once `start` becomes true. Time-based (like the prototype) so the
 * speed is independent of frame rate.
 */
export function useTypewriter(text: string, start: boolean, cps = 40, delayMs = 0) {
  const reduced = usePrefersReducedMotion();
  const [out, setOut] = useState('');
  const rafRef = useRef<number>();

  useEffect(() => {
    if (!start) {
      setOut('');
      return;
    }
    if (reduced) {
      setOut(text);
      return;
    }
    const begin = performance.now() + delayMs;
    const tick = (now: number) => {
      const elapsed = now - begin;
      if (elapsed <= 0) {
        setOut('');
      } else {
        const chars = Math.ceil((elapsed / 1000) * cps);
        setOut(text.slice(0, chars));
        if (chars >= text.length) return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [text, start, cps, delayMs, reduced]);

  return out;
}
