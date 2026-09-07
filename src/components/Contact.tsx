import { useState } from 'react';
import type { CSSProperties, FormEvent } from 'react';
import { useReveal } from '../hooks/useReveal';
import { useMagnetic } from '../hooks/useMagnetic';
import { SITE } from '../content/load';
import { SideOrnament, RuneDot } from './Ornaments';
import './Contact.css';

type Status = 'idle' | 'sending' | 'ok' | 'error';

export default function Contact() {
  const { ref, visible } = useReveal<HTMLElement>();
  const submitRef = useMagnetic<HTMLButtonElement>(0.4);
  const [data, setData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<Status>('idle');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Preferred path: Web3Forms delivers straight to SITE.email — no backend.
    if (SITE.formAccessKey) {
      setStatus('sending');
      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: SITE.formAccessKey,
            subject: `Portfolio — pesan dari ${data.name || 'seseorang'}`,
            from_name: data.name,
            name: data.name,
            email: data.email,
            message: data.message,
          }),
        });
        const json = await res.json();
        setStatus(json.success ? 'ok' : 'error');
      } catch {
        setStatus('error');
      }
      return;
    }

    // Fallback: open the visitor's mail client with a pre-filled draft.
    const subject = encodeURIComponent(`Portfolio — pesan dari ${data.name || 'seseorang'}`);
    const body = encodeURIComponent(`${data.message}\n\n— ${data.name} (${data.email})`);
    window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
    setStatus('ok');
  };

  return (
    <section
      id="contact"
      ref={ref}
      className={`contact reveal${visible ? ' reveal--in' : ''}`}
    >
      <SideOrnament side="left">
        <RuneDot size={20} opacity={0.6} />
      </SideOrnament>
      <SideOrnament side="right" label="Epilogue" />

      <div className="contact__head">
        <p className="eyebrow">Send a Letter</p>
        <h2 className="section-heading">Contact</h2>
      </div>

      {status === 'ok' ? (
        <div className="contact__sealed">
          <div className="contact__sealed-title">Your message has been sealed.</div>
          <div className="contact__sealed-sub">I will answer the summons soon.</div>
        </div>
      ) : (
        <form className="contact__form stagger" onSubmit={handleSubmit}>
          <label className="contact__field" style={{ '--i': 0 } as CSSProperties}>
            <input
              type="text"
              required
              placeholder="Your Name"
              value={data.name}
              onChange={(e) => setData((d) => ({ ...d, name: e.target.value }))}
              className="contact__input"
            />
            <span className="contact__line" />
          </label>
          <label className="contact__field" style={{ '--i': 1 } as CSSProperties}>
            <input
              type="email"
              required
              placeholder="Your Email"
              value={data.email}
              onChange={(e) => setData((d) => ({ ...d, email: e.target.value }))}
              className="contact__input"
            />
            <span className="contact__line" />
          </label>
          <label className="contact__field" style={{ '--i': 2 } as CSSProperties}>
            <textarea
              required
              rows={4}
              placeholder="Your Message"
              value={data.message}
              onChange={(e) => setData((d) => ({ ...d, message: e.target.value }))}
              className="contact__input contact__textarea"
            />
            <span className="contact__line" />
          </label>

          {status === 'error' && (
            <p className="contact__error">
              The letter could not be sent. Try again, or email{' '}
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a> directly.
            </p>
          )}

          <button
            ref={submitRef}
            type="submit"
            className="contact__submit"
            style={{ '--i': 3 } as CSSProperties}
            disabled={status === 'sending'}
          >
            <span>{status === 'sending' ? 'SEALING…' : 'SEAL THE MESSAGE'}</span>
          </button>
        </form>
      )}

      <div className="contact__social">
        <a href={`mailto:${SITE.email}`} className="social-btn" aria-label="Email">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
            <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6Zm-2.4 0L12 10.8 4.4 6h15.2ZM20 18H4V8.25l8 5 8-5V18Z" />
          </svg>
        </a>
        <a href={SITE.github} target="_blank" rel="noreferrer" className="social-btn" aria-label="GitHub">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
            <path d="M12 .5C5.37.5 0 5.78 0 12.29c0 5.2 3.44 9.6 8.21 11.16.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.05-3.34.73-4.04-1.6-4.04-1.6-.55-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.23 1.84 1.23 1.07 1.83 2.81 1.3 3.5.99.11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.32-5.47-5.87 0-1.3.47-2.36 1.24-3.19-.12-.3-.54-1.52.12-3.16 0 0 1.01-.32 3.3 1.22a11.6 11.6 0 0 1 6 0c2.29-1.54 3.3-1.22 3.3-1.22.66 1.64.24 2.86.12 3.16.77.83 1.24 1.89 1.24 3.19 0 4.56-2.81 5.57-5.49 5.86.43.37.81 1.1.81 2.22 0 1.6-.01 2.9-.01 3.29 0 .32.22.7.83.58A12.02 12.02 0 0 0 24 12.29C24 5.78 18.63.5 12 .5Z" />
          </svg>
        </a>
        <a href={SITE.linkedin} target="_blank" rel="noreferrer" className="social-btn" aria-label="LinkedIn">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
            <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
          </svg>
        </a>
        {SITE.cvFile && (
          <a href={SITE.cvFile} target="_blank" rel="noreferrer" className="social-btn" aria-label="Curriculum Vitae">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Zm-1 1.5L18.5 9H13V3.5ZM8 12.5h8V14H8v-1.5Zm0 3.5h8v1.5H8V16Zm0-7h4v1.5H8V9Z" />
            </svg>
          </a>
        )}
      </div>
    </section>
  );
}
