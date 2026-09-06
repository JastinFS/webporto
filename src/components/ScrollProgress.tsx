import './ScrollProgress.css';

/** Thin gold meter across the top of the viewport.
 *  Width is driven purely by the global --scroll-progress var. */
export default function ScrollProgress() {
  return (
    <div className="scroll-progress" aria-hidden="true">
      <div className="scroll-progress__bar" />
    </div>
  );
}
