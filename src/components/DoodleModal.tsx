import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import type { Note } from './WallOfFame';
import { useScrollLock } from '../hooks/useScrollLock';
import './DoodleModal.css';

const COLORS = ['#1b1b1b', '#2b7fff', '#e5484d', '#22c55e', '#d4af37'];
const W = 320;
const H = 230;

export default function DoodleModal({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: (notes: Note[]) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const dirty = useRef(false);
  const [color, setColor] = useState(COLORS[0]);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useScrollLock();

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = W * dpr;
    c.height = H * dpr;
    const ctx = c.getContext('2d')!;
    ctx.scale(dpr, dpr);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const pos = (e: ReactPointerEvent) => {
    const r = canvasRef.current!.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H };
  };
  const down = (e: ReactPointerEvent) => {
    drawing.current = true;
    last.current = pos(e);
    canvasRef.current?.setPointerCapture(e.pointerId);
  };
  const move = (e: ReactPointerEvent) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current!.getContext('2d')!;
    const p = pos(e);
    ctx.strokeStyle = color;
    ctx.lineWidth = color === '#ffffff' ? 16 : 4;
    ctx.beginPath();
    ctx.moveTo(last.current!.x, last.current!.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
    dirty.current = true;
  };
  const up = () => {
    drawing.current = false;
    last.current = null;
  };
  const clear = () => {
    const ctx = canvasRef.current!.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);
    dirty.current = false;
  };

  const submit = async () => {
    setError('');
    if (!name.trim() || !title.trim()) return setError('Isi nama & pesan dulu.');
    if (!dirty.current) return setError('Coret sesuatu dulu di kanvasnya.');
    const c = canvasRef.current!;
    let doodle = '';
    try {
      doodle = c.toDataURL('image/webp', 0.75);
      if (!doodle.startsWith('data:image/webp')) doodle = c.toDataURL('image/png');
    } catch {
      doodle = c.toDataURL('image/png');
    }
    setBusy(true);
    try {
      const res = await fetch('/api/wall', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), title: title.trim(), doodle }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Gagal menyimpan.');
        setBusy(false);
        return;
      }
      onSaved(data.notes);
    } catch {
      setError('Jaringan bermasalah. Coba lagi.');
      setBusy(false);
    }
  };

  return (
    <div className="doodle" onClick={onClose} role="dialog" aria-modal="true" aria-label="Leave a note">
      <div className="doodle__panel" onClick={(e) => e.stopPropagation()} data-lenis-prevent>
        <button className="doodle__close" onClick={onClose} aria-label="Tutup">×</button>
        <h3 className="doodle__title">Leave a note</h3>

        <div className="doodle__fields">
          <input
            className="doodle__input"
            placeholder="Your name"
            maxLength={24}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="doodle__input"
            placeholder="A short message"
            maxLength={48}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="doodle__pad">
          <canvas
            ref={canvasRef}
            className="doodle__canvas"
            style={{ aspectRatio: `${W} / ${H}` }}
            onPointerDown={down}
            onPointerMove={move}
            onPointerUp={up}
            onPointerLeave={up}
          />
        </div>

        <div className="doodle__tools">
          <div className="doodle__swatches">
            {COLORS.map((c) => (
              <button
                key={c}
                className={`doodle__swatch${color === c ? ' is-active' : ''}`}
                style={{ background: c }}
                onClick={() => setColor(c)}
                aria-label={`Warna ${c}`}
              />
            ))}
            <button
              className={`doodle__swatch doodle__swatch--eraser${color === '#ffffff' ? ' is-active' : ''}`}
              onClick={() => setColor('#ffffff')}
              aria-label="Penghapus"
              title="Eraser"
            >
              ⌫
            </button>
          </div>
          <button className="doodle__clear" onClick={clear}>Clear</button>
        </div>

        {error && <p className="doodle__error">{error}</p>}

        <button className="doodle__submit" onClick={submit} disabled={busy}>
          <span>{busy ? 'SEALING…' : 'SEAL IT'}</span>
        </button>
      </div>
    </div>
  );
}
