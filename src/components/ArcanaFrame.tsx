import './ArcanaFrame.css';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

/**
 * Ornate gilded tarot frame overlaid on a skill card.
 * `back` renders the symmetric reverse (no numeral / name-plate) for the flip side.
 */
export default function ArcanaFrame({
  index,
  title,
  back = false,
}: {
  index: number;
  title: string;
  back?: boolean;
}) {
  const numeral = ROMAN[index] ?? String(index + 1);

  return (
    <div className={`aframe${back ? ' aframe--back' : ''}`} aria-hidden="true">
      {/* double gold rule hugging the card edges */}
      <svg className="aframe__rule" viewBox="0 0 100 100" preserveAspectRatio="none">
        <rect x="2.5" y="2.5" width="95" height="95" rx="3" fill="none"
          stroke="#c9a24a" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        <rect x="6" y="6" width="88" height="88" rx="2" fill="none"
          stroke="#c9a24a" strokeWidth="1" vectorEffect="non-scaling-stroke" opacity="0.6" />
      </svg>

      {/* corner flourishes */}
      {(['tl', 'tr', 'bl', 'br'] as const).map((pos) => (
        <svg key={pos} className={`aframe__corner aframe__corner--${pos}`} viewBox="0 0 40 40">
          <path d="M2 2 H16 M2 2 V16 M2 12 C2 6 6 2 12 2 M2 22 C10 22 22 10 22 2"
            fill="none" stroke="#d4af37" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="2" cy="2" r="1.6" fill="#d4af37" />
        </svg>
      ))}

      {back ? (
        /* reverse: a centred alchemical sigil */
        <svg className="aframe__sigil" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="30" fill="none" stroke="#c9a24a" strokeWidth="1.2" opacity="0.8" />
          <circle cx="40" cy="40" r="22" fill="none" stroke="#c9a24a" strokeWidth="0.8" opacity="0.5" />
          <polygon points="40,14 63,54 17,54" fill="none" stroke="#d4af37" strokeWidth="1" opacity="0.7" />
          <polygon points="40,66 17,26 63,26" fill="none" stroke="#d4af37" strokeWidth="1" opacity="0.5" />
        </svg>
      ) : (
        <>
          {/* pediment + numeral medallion */}
          <div className="aframe__pediment">
            <svg viewBox="0 0 120 74">
              <g stroke="#c9a24a" strokeWidth="1.2" fill="none" opacity="0.85">
                {Array.from({ length: 11 }, (_, i) => {
                  const a = (-90 + (i - 5) * 13) * (Math.PI / 180);
                  return (
                    <line key={i} x1="60" y1="58"
                      x2={60 + Math.cos(a) * 42} y2={58 + Math.sin(a) * 42} opacity="0.45" />
                  );
                })}
                <path d="M12 72 C12 34 34 20 60 8 C86 20 108 34 108 72" strokeWidth="1.6" />
                <path d="M22 72 C22 40 40 28 60 18 C80 28 98 40 98 72" opacity="0.55" />
              </g>
              <circle cx="60" cy="30" r="15" fill="#0e0a07" stroke="#d4af37" strokeWidth="1.6" />
              <circle cx="60" cy="30" r="19" fill="none" stroke="#c9a24a" strokeWidth="0.8" opacity="0.6" />
              <text x="60" y="30" textAnchor="middle" dominantBaseline="central"
                fontFamily="'Cormorant Garamond', serif" fontSize="15" fill="#e8dcc4"
                letterSpacing="0.5">{numeral}</text>
            </svg>
          </div>

          {/* bottom name-plate */}
          <div className="aframe__banner">
            <span className="aframe__banner-cap aframe__banner-cap--l" />
            <span className="aframe__banner-text">{title}</span>
            <span className="aframe__banner-cap aframe__banner-cap--r" />
          </div>
        </>
      )}
    </div>
  );
}
