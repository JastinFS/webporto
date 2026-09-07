import type { CSSProperties } from 'react';
import { useReveal } from '../hooks/useReveal';
import { CERTS } from '../content/load';
import { SideOrnament, RuneRings } from './Ornaments';
import './Certifications.css';

export default function Certifications() {
  const { ref, visible } = useReveal<HTMLElement>();
  if (!CERTS.length) return null;

  return (
    <section
      id="certifications"
      ref={ref}
      className={`certs reveal${visible ? ' reveal--in' : ''}`}
    >
      <SideOrnament side="left" label="Seals" />
      <SideOrnament side="right">
        <RuneRings size={20} spin={26} spinDir="cw" opacity={0.55} />
      </SideOrnament>

      <div className="certs__head">
        <p className="eyebrow">Sealed &amp; Certified</p>
        <h2 className="section-heading">Certifications</h2>
      </div>

      <div className="certs__grid">
        {CERTS.map((c, i) => (
          <a
            key={c.slug}
            href={c.file}
            target="_blank"
            rel="noreferrer"
            className="cert-card"
            style={{ '--i': i } as CSSProperties}
          >
            <div className="cert-card__preview">
              {c.preview ? (
                <img src={c.preview} alt={`${c.title} — ${c.issuer}`} loading="lazy" decoding="async" />
              ) : (
                <div className="cert-card__preview-fallback" aria-hidden="true">
                  <svg viewBox="0 0 40 40" width="46" height="46">
                    <circle cx="20" cy="20" r="17" fill="none" stroke="#d4af37" strokeWidth="1.2" />
                    <path d="M20 8 L23 17 L32 17 L25 23 L28 32 L20 26 L12 32 L15 23 L8 17 L17 17 Z"
                      fill="none" stroke="#d4af37" strokeWidth="1" />
                  </svg>
                </div>
              )}
              <span className="cert-card__seal" aria-hidden="true">✦</span>
            </div>

            <div className="cert-card__body">
              <div className="cert-card__meta">
                <span className="cert-card__date">{c.dateLabel}</span>
                {c.credentialId && (
                  <span className="cert-card__id" title={c.credentialId}>ID · {c.credentialId}</span>
                )}
              </div>
              <h3 className="cert-card__title">{c.title}</h3>
              <p className="cert-card__issuer">{c.issuer}</p>
              {c.tags.length > 0 && (
                <div className="cert-card__tags">
                  {c.tags.map((t) => (
                    <span key={t} className="cert-card__tag">{t}</span>
                  ))}
                </div>
              )}
              <span className="cert-card__cta">View certificate &rarr;</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
