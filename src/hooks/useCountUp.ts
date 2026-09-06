import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

/**
 * Counts from 0 up to the numeric part of `target` when `start` flips true,
 * preserving any prefix/suffix and decimal places ("3.23", "10+", "2026").
 */
export function useCountUp(target: string, start: boolean, durationMs = 1400) {
  const reduced = usePrefersReducedMotion();
  const [display, setDisplay] = useState(reduced ? target : formatFrom(target, 0));

  useEffect(() => {
    if (!start) return;
    if (reduced) {
      setDisplay(target);
      return;
    }
    const m = target.match(/^(\D*)([\d.,]+)(\D*)$/);
    if (!m) {
      setDisplay(target);
      return;
    }
    const [, prefix, num, suffix] = m;
    const decimals = num.includes('.') ? num.split('.')[1].length : 0;
    const end = parseFloat(num.replace(/,/g, ''));
    const startT = performance.now();
    let raf = requestAnimationFrame(function tick(now) {
      const t = Math.min(1, (now - startT) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      const val = (end * eased).toFixed(decimals);
      setDisplay(`${prefix}${val}${suffix}`);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setDisplay(target);
    });
    return () => cancelAnimationFrame(raf);
  }, [target, start, durationMs, reduced]);

  return display;
}

function formatFrom(target: string, value: number): string {
  const m = target.match(/^(\D*)([\d.,]+)(\D*)$/);
  if (!m) return target;
  const [, prefix, num, suffix] = m;
  const decimals = num.includes('.') ? num.split('.')[1].length : 0;
  return `${prefix}${value.toFixed(decimals)}${suffix}`;
}
