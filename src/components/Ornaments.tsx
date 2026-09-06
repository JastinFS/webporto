import type { CSSProperties, ReactNode } from 'react';
import './Ornaments.css';

/* ---- Rune sigils (SVG) reused across sections ------------------- */

export function RuneTriangle({ size = 26, spin, spinDir = 'cw', opacity = 0.85 }: {
  size?: number;
  spin?: number; // seconds per rotation; omit for static
  spinDir?: 'cw' | 'ccw';
  opacity?: number;
}) {
  const style: CSSProperties = { opacity };
  if (spin) {
    style.animation = `${spinDir === 'cw' ? 'spinCW' : 'spinCCW'} ${spin}s linear infinite`;
  }
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} style={style} aria-hidden="true">
      <circle cx="20" cy="20" r="18" fill="none" stroke="#D4AF37" strokeWidth="1" />
      <polygon points="20,8 30,26 10,26" fill="none" stroke="#D4AF37" strokeWidth="0.8" />
    </svg>
  );
}

export function RuneRings({ size = 20, spin, spinDir = 'ccw', opacity = 0.6 }: {
  size?: number;
  spin?: number;
  spinDir?: 'cw' | 'ccw';
  opacity?: number;
}) {
  const style: CSSProperties = { opacity };
  if (spin) {
    style.animation = `${spinDir === 'cw' ? 'spinCW' : 'spinCCW'} ${spin}s linear infinite`;
  }
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} style={style} aria-hidden="true">
      <circle cx="20" cy="20" r="18" fill="none" stroke="#D4AF37" strokeWidth="1" />
      <circle cx="20" cy="20" r="10" fill="none" stroke="#D4AF37" strokeWidth="0.7" />
    </svg>
  );
}

export function RuneDot({ size = 20, opacity = 0.6 }: { size?: number; opacity?: number }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} style={{ opacity }} aria-hidden="true">
      <circle cx="20" cy="20" r="18" fill="none" stroke="#D4AF37" strokeWidth="1" />
      <circle cx="20" cy="20" r="4" fill="#D4AF37" opacity="0.5" />
    </svg>
  );
}

export function RuneTick({ size = 20, spin, spinDir = 'cw', opacity = 0.55 }: {
  size?: number;
  spin?: number;
  spinDir?: 'cw' | 'ccw';
  opacity?: number;
}) {
  const style: CSSProperties = { opacity };
  if (spin) {
    style.animation = `${spinDir === 'cw' ? 'spinCW' : 'spinCCW'} ${spin}s linear infinite`;
  }
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} style={style} aria-hidden="true">
      <circle cx="20" cy="20" r="18" fill="none" stroke="#D4AF37" strokeWidth="1" />
      <line x1="20" y1="4" x2="20" y2="12" stroke="#D4AF37" strokeWidth="0.8" />
      <line x1="20" y1="28" x2="20" y2="36" stroke="#D4AF37" strokeWidth="0.8" />
    </svg>
  );
}

/* ---- Vertical side ornament (hidden below 900px via CSS) -------- */

export function SideOrnament({
  side,
  label,
  children,
}: {
  side: 'left' | 'right';
  label?: string;
  children?: ReactNode;
}) {
  return (
    <div className="side-ornament" data-side={side} aria-hidden="true">
      <span className="side-ornament__line side-ornament__line--top" />
      {label ? <span className="side-ornament__label">{label}</span> : children}
      <span className="side-ornament__line side-ornament__line--bottom" />
    </div>
  );
}

/* ---- Ornamental section divider ------------------------------- */

export function Divider() {
  return (
    <div className="divider">
      <div className="divider__row">
        <span className="divider__rule divider__rule--l" />
        <RuneTriangle size={26} spin={30} spinDir="cw" opacity={0.85} />
        <span className="divider__rule divider__rule--r" />
      </div>
      <p className="divider__quote">
        "In data, as in fate, the patterns reveal themselves only to those patient enough to look."
      </p>
    </div>
  );
}
