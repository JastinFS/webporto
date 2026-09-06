import { useState } from 'react';
import type { CSSProperties, FormEvent } from 'react';
import { useReveal } from '../hooks/useReveal';
import { useMagnetic } from '../hooks/useMagnetic';
import { SITE } from '../content/load';
import { SideOrnament, RuneDot } from './Ornaments';
import './Contact.css';

export default function Contact() {
  const { ref, visible } = useReveal<HTMLElement>();
  const submitRef = useMagnetic<HTMLButtonElement>(0.4);
  const [data, setData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // No backend in the design — hand off to the visitor's mail client
    // so the message actually reaches Jastin, then show the sealed state.
    const subject = encodeURIComponent(`Portfolio — pesan dari ${data.name || 'seseorang'}`);
    const body = encodeURIComponent(`${data.message}\n\n— ${data.name} (${data.email})`);
    window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
    setSubmitted(true);
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

      {submitted ? (
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
          <button
            ref={submitRef}
            type="submit"
            className="contact__submit"
            style={{ '--i': 3 } as CSSProperties}
          >
            <span>SEAL THE MESSAGE</span>
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
