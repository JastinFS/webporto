import './Atmosphere.css';

/**
 * Site-wide ambience that sits behind all content:
 *  - three slow-drifting radial "ether" glows
 *  - an animated film-grain layer
 * Purely decorative, no pointer interaction.
 */
export default function Atmosphere() {
  return (
    <div className="atmos" aria-hidden="true">
      <div className="atmos__glow atmos__glow--1" />
      <div className="atmos__glow atmos__glow--2" />
      <div className="atmos__glow atmos__glow--3" />
      <div className="atmos__grain" />
      <div className="atmos__vignette" />
    </div>
  );
}
