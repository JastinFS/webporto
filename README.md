# Jastin Fadillah Sitompul — Portfolio

Portofolio pribadi bertema **Lord of the Mysteries** (gothic / mystic, aksen emas).
Dibangun dari design handoff Claude Design menjadi website yang benar-benar responsif.

## Stack

| Bagian | Pilihan | Alasan |
| --- | --- | --- |
| Bahasa | **TypeScript** | Type-safety, autocomplete, aman saat refactor |
| UI | **React 18** | Struktur design sudah component-based (cocok 1:1) |
| Build tool | **Vite 5** | Dev server instan, build production kecil & cepat |
| Styling | **CSS murni per-komponen** | Nilai visual disalin persis dari design, tanpa dependency ekstra |
| Smooth scroll | **Lenis** | Inertia scrolling halus + progress bar global |

## Efek "premium" yang ditambahkan

- **Intro loader** — sigil emas menggambar dirinya + counter, lalu tirai membuka (sekali per sesi).
- **Custom cursor** — dot + ring emas yang membesar di elemen interaktif (khusus perangkat pointer).
- **Smooth scrolling (Lenis)** + **scroll progress bar** emas di atas layar.
- **Atmosphere** — 3 glow "ether" yang menghanyut + film grain + vignette di seluruh halaman.
- **Hero** — sonar pulse di balik nama, entrance blur-in, titik cahaya turun di indikator scroll.
- **Section heading** — teks gradasi emas dengan sheen yang bergerak; eyebrow dengan garis sisi.
- **About** — portrait tilt mengikuti kursor + aura conic berputar + reveal clip-path; angka statistik count-up.
- **Skills** — dua baris marquee berlawanan arah + aura di belakang kartu tarot.
- **Projects** — kartu entrance blur/stagger, spotlight mengikuti kursor, sheen menyapu thumbnail, zoom gambar, tag "REVEAL →".
- **Navbar** — indikator section aktif (scrollspy), tombol CTA magnetik + isian gradien.
- **Contact** — field stagger, underline emas tumbuh saat focus, tombol submit magnetik.
- **Back-to-top** — rune emas berputar muncul setelah scroll.
- Semua efek berat dimatikan otomatis saat `prefers-reduced-motion: reduce`.

Tidak ada backend — form kontak membuka mail client pengunjung (`mailto:`) lalu
menampilkan state "sealed", sesuai perilaku pada design.

## Menjalankan

```bash
npm install
npm run dev      # http://localhost:5173
```

## Build produksi

```bash
npm run build    # output ke dist/
npm run preview  # pratinjau hasil build
```

Hasil `dist/` adalah situs statis — bisa langsung di-deploy ke Vercel, Netlify,
GitHub Pages, atau hosting statis apa pun. `base` di `vite.config.ts` sudah
diset relatif (`./`) sehingga jalan dari sub-path mana pun.

## Struktur

```
content/                   # SEMUA KONTEN ADA DI SINI (bisa diedit lewat /admin)
  site.md                  # nama, kontak, teks hero, file CV
  about.md                 # ringkasan, statistik, pendidikan, pengalaman
  skills.md                # 6 kartu skill + daftar marquee
  projects/*.md            # 1 file = 1 project (frontmatter + deskripsi markdown)
public/
  uploads/                 # semua gambar + CV (dipakai lewat path /uploads/...)
  admin/                   # panel Decap CMS (index.html + config.yml)
src/
  content/load.ts          # loader: parse markdown+frontmatter -> objek
  hooks/                   # useReveal, useTypewriter, useCountUp, useMagnetic, ...
  smooth/lenis.ts          # setup + helper smooth-scroll
  components/              # Navbar / Hero / About / Skills / Projects / ... + efek
  styles/                  # global.css (token + keyframes), sections.css
```

## Mengganti konten

**Cara mudah (rekomendasi):** panel admin di `/admin/` — lihat [DEPLOY.md](DEPLOY.md).
Bisa dijalankan lokal sekarang tanpa hosting:

```bash
npx decap-server      # terminal 1
npm run dev           # terminal 2
# buka http://localhost:5173/admin/
```

**Cara manual:** edit file di `content/` langsung.
- Tambah project → buat file baru `content/projects/nama-project.md` (contoh: lihat file yang ada).
- Ganti gambar → taruh di `public/uploads/`, rujuk sebagai `/uploads/nama.webp`.
- Latar hero → set `heroImage` di `content/site.md`.

## Aksesibilitas & performa

- Menghormati `prefers-reduced-motion` (animasi loop dinonaktifkan).
- Cursor-trail hanya aktif di perangkat pointer halus (desktop).
- Gambar proyek `loading="lazy"`, font di-`preconnect`.
