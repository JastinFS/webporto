import { useEffect } from 'react';
import Lenis from 'lenis';
import { setLenis } from '../smooth/lenis';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

/**
 * Buttery inertial scrolling + a global `--scroll-progress` custom
 * property (0 → 1) on <html> that any component can read.
 * Disabled entirely under prefers-reduced-motion.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const root = document.documentElement;

    const setProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      root.style.setProperty('--scroll-progress', p.toFixed(4));
    };

    if (reduced) {
      window.addEventListener('scroll', setProgress, { passive: true });
      setProgress();
      return () => window.removeEventListener('scroll', setProgress);
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });
    setLenis(lenis);

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    lenis.on('scroll', setProgress);
    setProgress();

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, [reduced]);

  return <>{children}</>;
}
