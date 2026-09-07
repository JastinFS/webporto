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

      <footer className="contact__footer">
        <div className="contact__copy">© {SITE.year} {SITE.name}</div>
        <div className="contact__links">
          <a href={`mailto:${SITE.email}`}>EMAIL</a>
          <a href={SITE.github} target="_blank" rel="noreferrer">GITHUB</a>
          <a href={SITE.linkedin} target="_blank" rel="noreferrer">LINKEDIN</a>
          {SITE.cvFile && (
            <a href={SITE.cvFile} target="_blank" rel="noreferrer">CV</a>
          )}
        </div>
      </footer>
    </section>
  );
}
