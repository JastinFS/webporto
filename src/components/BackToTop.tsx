import { useEffect, useState } from 'react';
import { scrollToTop } from '../smooth/lenis';
import './BackToTop.css';

export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 1.2);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      className={`back-top${show ? ' back-top--in' : ''}`}
      onClick={scrollToTop}
      aria-label="Kembali ke atas"
    >
      <svg viewBox="0 0 40 40" width="22" height="22" aria-hidden="true">
        <circle cx="20" cy="20" r="18" fill="none" stroke="#D4AF37" strokeWidth="1" />
        <polygon points="20,10 28,26 12,26" fill="none" stroke="#D4AF37" strokeWidth="0.9" />
      </svg>
      <span className="back-top__ring" />
    </button>
  );
}
