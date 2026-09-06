import { useEffect, useRef, useState } from 'react';
import './CustomCursor.css';

const INTERACTIVE = 'a, button, [role="button"], input, textarea, label, .arcana, .project-card';

/**
 * Gold dual-ring pointer. The dot tracks 1:1, the ring eases behind it
 * and swells over interactive targets. Fine-pointer devices only.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia?.('(hover: hover) and (pointer: fine)').matches;
    if (!fine) return;
    setEnabled(true);
    document.body.classList.add('has-custom-cursor');

    const mouse = { x: innerWidth / 2, y: innerHeight / 2 };
    const ring = { x: mouse.x, y: mouse.y };
    let hovering = false;
    let down = false;

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
      const over = !!(e.target as Element)?.closest?.(INTERACTIVE);
      if (over !== hovering) {
        hovering = over;
        ringRef.current?.classList.toggle('is-hover', over);
      }
    };
    const onDown = () => {
      down = true;
      ringRef.current?.classList.add('is-down');
    };
    const onUp = () => {
      down = false;
      ringRef.current?.classList.remove('is-down');
    };
    const onLeave = () => {
      dotRef.current?.classList.add('is-out');
      ringRef.current?.classList.add('is-out');
    };
    const onEnter = () => {
      dotRef.current?.classList.remove('is-out');
      ringRef.current?.classList.remove('is-out');
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    let raf = requestAnimationFrame(function loop() {
      ring.x += (mouse.x - ring.x) * 0.18;
      ring.y += (mouse.y - ring.y) * 0.18;
      if (ringRef.current) {
        const s = (hovering ? 1.9 : 1) * (down ? 0.8 : 1);
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%) scale(${s})`;
      }
      raf = requestAnimationFrame(loop);
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      document.body.classList.remove('has-custom-cursor');
    };
  }, []);

  if (!enabled) return null;
  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
