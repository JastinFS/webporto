import Lenis from 'lenis';

/** Module-level handle so imperative helpers (nav clicks, back-to-top)
 *  can drive the same Lenis instance the provider created. */
let instance: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  instance = l;
}

export function getLenis(): Lenis | null {
  return instance;
}

/** Smooth-scroll to an element id, offset for the fixed navbar.
 *  Falls back to native scrolling when Lenis is not running. */
export function scrollToId(id: string, offset = -84) {
  const el = document.getElementById(id);
  if (!el) return;
  if (instance) {
    instance.scrollTo(el, { offset, duration: 1.5 });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

export function scrollToTop() {
  if (instance) instance.scrollTo(0, { duration: 1.4 });
  else window.scrollTo({ top: 0, behavior: 'smooth' });
}
