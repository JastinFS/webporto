import { SITE } from '../content/load';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__copy">© {SITE.year} {SITE.name}</div>
      <div className="site-footer__links">
        <a href={`mailto:${SITE.email}`}>EMAIL</a>
        <a href={SITE.github} target="_blank" rel="noreferrer">GITHUB</a>
        <a href={SITE.linkedin} target="_blank" rel="noreferrer">LINKEDIN</a>
        {SITE.cvFile && (
          <a href={SITE.cvFile} target="_blank" rel="noreferrer">CV</a>
        )}
      </div>
    </footer>
  );
}
