import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { useReveal } from '../hooks/useReveal';
import { SideOrnament, RuneTriangle } from './Ornaments';
import DoodleModal from './DoodleModal';
import './WallOfFame.css';

export interface Note {
  id: string;
  name: string;
  title: string;
  doodle: string;
  ts: number;
}

type Layout = 'scatter' | 'grid';
interface Pos {
  x: number;
  y: number;
  rot: number;
}

// deterministic pseudo-random from a string
function seed(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function layoutPos(notes: Note[], mode: Layout, salt: string): Record<string, Pos> {
  const out: Record<string, Pos> = {};
  if (mode === 'grid') {
    const cols = 3;
    notes.forEach((n, i) => {
      out[n.id] = {
        x: 6 + (i % cols) * 31,
        y: 4 + Math.floor(i / cols) * 40,
        rot: 0,
      };
    });
    return out;
  }
  notes.forEach((n) => {
    const rnd = seed(n.id + salt);
    out[n.id] = {
      x: 4 + rnd() * 62,
      y: 3 + rnd() * (Math.max(1, Math.ceil(notes.length / 3)) * 34 - 10),
      rot: (rnd() - 0.5) * 12,
    };
  });
  return out;
}

export default function WallOfFame() {
  const { ref, visible } = useReveal<HTMLElement>();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [reading, setReading] = useState<Note | null>(null);
  const [mode, setMode] = useState<Layout>('scatter');
  const [salt, setSalt] = useState('a');
  const [drag, setDrag] = useState<Record<string, Pos>>({});
  const boardRef = useRef<HTMLDivElement>(null);

  // moderation: open ?wall_admin=<secret> to reveal delete controls
  const adminKey = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return new URLSearchParams(window.location.search).get('wall_admin') || '';
  }, []);

  useEffect(() => {
    fetch('/api/wall')
      .then((r) => r.json())
      .then((d) => setNotes(Array.isArray(d.notes) ? d.notes : []))
      .catch(() => setNotes([]))
      .finally(() => setLoading(false));
  }, []);

  const removeNote = async (id: string) => {
    try {
      const res = await fetch('/api/wall', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'x-wall-admin': adminKey },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (res.ok) setNotes(Array.isArray(data.notes) ? data.notes : []);
    } catch {
      /* ignore */
    }
  };
  const clearAll = async () => {
    if (!window.confirm('Hapus SEMUA catatan?')) return;
    try {
      const res = await fetch('/api/wall', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'x-wall-admin': adminKey },
        body: JSON.stringify({ clear: true }),
      });
      if (res.ok) setNotes([]);
    } catch {
      /* ignore */
    }
  };

  const base = useMemo(() => layoutPos(notes, mode, salt), [notes, mode, salt]);
  const posOf = (id: string) => drag[id] ?? base[id] ?? { x: 30, y: 20, rot: 0 };

  // pointer drag (local only)
  const dragState = useRef<{ id: string; sx: number; sy: number; ox: number; oy: number } | null>(null);
  const moved = useRef(false);

  const onPointerDown = (e: ReactPointerEvent, n: Note) => {
    const board = boardRef.current;
    if (!board) return;
    const p = posOf(n.id);
    dragState.current = { id: n.id, sx: e.clientX, sy: e.clientY, ox: p.x, oy: p.y };
    moved.current = false;
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: ReactPointerEvent) => {
    const st = dragState.current;
    const board = boardRef.current;
    if (!st || !board) return;
    const rect = board.getBoundingClientRect();
    const dx = ((e.clientX - st.sx) / rect.width) * 100;
    const dy = ((e.clientY - st.sy) / rect.height) * 100;
    if (Math.abs(e.clientX - st.sx) + Math.abs(e.clientY - st.sy) > 4) moved.current = true;
    setDrag((d) => ({
      ...d,
      [st.id]: {
        x: Math.max(-2, Math.min(78, st.ox + dx)),
        y: Math.max(-2, Math.min(96, st.oy + dy)),
        rot: base[st.id]?.rot ?? 0,
      },
    }));
  };
  const onPointerUp = () => {
    dragState.current = null;
  };

  const handleCardClick = (n: Note) => {
    if (moved.current) return;
    setReading(n);
  };

  const addNote = useCallback((updated: Note[]) => {
    setNotes(updated);
    setDrag({});
  }, []);

  return (
    <section
      id="wall"
      ref={ref}
      className={`wall reveal${visible ? ' reveal--in' : ''}`}
    >
      <SideOrnament side="left" label="Guestbook" />
      <SideOrnament side="right">
        <RuneTriangle size={20} opacity={0.6} />
      </SideOrnament>

      <div className="wall__head">
        <p className="eyebrow">Wall of Fame</p>
        <h2 className="section-heading">
          {loading ? '…' : notes.length} {notes.length === 1 ? 'note' : 'notes'}
        </h2>
        <p className="wall__sub">Doodles and messages left by people who stopped by.</p>

        <div className="wall__controls">
          <button
            className="wall__icon-btn"
            onClick={() => setMode((m) => (m === 'scatter' ? 'grid' : 'scatter'))}
            aria-label="Ganti tata letak"
            title={mode === 'scatter' ? 'Rapikan' : 'Sebar'}
          >
            {mode === 'scatter' ? '▦' : '✦'}
          </button>
          <button
            className="wall__icon-btn"
            onClick={() => {
              setMode('scatter');
              setSalt(Math.random().toString(36).slice(2, 6));
              setDrag({});
            }}
            aria-label="Acak posisi"
            title="Acak"
          >
            ⤨
          </button>
          <button className="wall__leave" onClick={() => setOpen(true)}>
            Leave a note
          </button>
          {adminKey && (
            <button className="wall__icon-btn wall__icon-btn--danger" onClick={clearAll} title="Hapus semua">
              🗑
            </button>
          )}
        </div>
      </div>

      <div className="wall__board" ref={boardRef} onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
        {!loading && notes.length === 0 && (
          <p className="wall__empty">Be the first to leave a mark.</p>
        )}
        {notes.map((n) => {
          const p = posOf(n.id);
          return (
            <div
              key={n.id}
              className="wall-note"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                transform: `rotate(${p.rot}deg)`,
              }}
              onPointerDown={(e) => onPointerDown(e, n)}
              onClick={() => handleCardClick(n)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setReading(n);
              }}
            >
              <div className="wall-note__paper">
                <img src={n.doodle} alt={`Note by ${n.name}`} draggable={false} />
                {adminKey && (
                  <button
                    className="wall-note__del"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNote(n.id);
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    aria-label="Hapus catatan ini"
                  >
                    ×
                  </button>
                )}
              </div>
              <div className="wall-note__label">
                <span className="wall-note__who">
                  <span className="wall-note__dot" /> {n.name}
                </span>
                <span className="wall-note__title">{n.title}</span>
              </div>
            </div>
          );
        })}
      </div>
      <p className="wall__hint">Drag a card to move it · Click to read it</p>

      {open && (
        <DoodleModal
          onClose={() => setOpen(false)}
          onSaved={(updated) => {
            addNote(updated);
            setOpen(false);
          }}
        />
      )}

      {reading && (
        <div className="wall-read" onClick={() => setReading(null)} role="dialog" aria-modal="true">
          <div className="wall-read__panel" onClick={(e) => e.stopPropagation()}>
            <button className="wall-read__close" onClick={() => setReading(null)} aria-label="Tutup">
              ×
            </button>
            <img className="wall-read__img" src={reading.doodle} alt={`Note by ${reading.name}`} />
            <div className="wall-read__meta">
              <span className="wall-note__dot" /> {reading.name}
            </div>
            <div className="wall-read__title">{reading.title}</div>
          </div>
        </div>
      )}
    </section>
  );
}
