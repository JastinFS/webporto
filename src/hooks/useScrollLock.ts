import { useEffect } from 'react';
import { getLenis } from '../smooth/lenis';

/**
 * Freezes the page while an overlay is open:
 *  - pauses Lenis (otherwise it keeps eating wheel events and the page
 *    scrolls "through" the overlay)
 *  - locks <body> scroll as a fallback, compensating for the scrollbar
 * Reference-counted so overlapping overlays behave, and the page is only
 * released once the last one closes.
 */
let locks = 0;
let restore: (() => void) | null = null;

function lock() {
  locks += 1;
  if (locks > 1) return;

  getLenis()?.stop();
  const body = document.body;
  const prevOverflow = body.style.overflow;
  const prevPad = body.style.paddingRight;
  const sbw = window.innerWidth - document.documentElement.clientWidth;
  body.style.overflow = 'hidden';
  if (sbw > 0) body.style.paddingRight = `${sbw}px`;

  restore = () => {
    body.style.overflow = prevOverflow;
    body.style.paddingRight = prevPad;
    getLenis()?.start();
  };
}

function unlock() {
  locks = Math.max(0, locks - 1);
  if (locks === 0 && restore) {
    restore();
    restore = null;
  }
}

export function useScrollLock(active = true) {
  useEffect(() => {
    if (!active) return;
    lock();
    return unlock;
  }, [active]);
}
