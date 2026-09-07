# Deploy & Panel Admin

- **Live:** https://jastin.xyz — hosting **Cloudflare Pages**, auto-build dari
  repo GitHub `JastinFS/webporto` tiap `git push` ke branch `main`.
- **Build:** `npm run build` → output `dist/`.
- **Konten** (project, about, skills, kontak, CV, hero) ada di folder
  [`content/`](content/) + gambar di [`public/uploads/`](public/uploads/).

Deploy = commit + push:

```bash
git add -A
git commit -m "update konten"
git push
```

Cloudflare rebuild otomatis, live ~1–2 menit.

---

## Panel admin (`/admin/`) — edit project dari HP/laptop mana pun

Panel Decap CMS-nya sudah ada di `https://jastin.xyz/admin/`. Login GitHub-nya
lewat OAuth handler yang jalan sebagai **Cloudflare Pages Functions**
(`functions/api/auth.js` + `functions/api/callback.js` — sudah di repo).

Sisa **2 langkah manual** (sekali saja):

### 1. Buat GitHub OAuth App

github.com → **Settings → Developer settings → OAuth Apps → New OAuth App**

| Field | Isi |
| --- | --- |
| Application name | `Jastin Portfolio CMS` (bebas) |
| Homepage URL | `https://jastin.xyz` |
| Authorization callback URL | `https://jastin.xyz/api/callback` |

Setelah dibuat: catat **Client ID**, lalu **Generate a new client secret** →
catat **Client secret** (cuma muncul sekali).

### 2. Masukkan ke Cloudflare Pages

Cloudflare dashboard → **Workers & Pages → (project webporto) → Settings →
Environment variables** → **Add** (untuk *Production*):

| Variable name | Value |
| --- | --- |
| `GITHUB_OAUTH_ID` | Client ID dari langkah 1 |
| `GITHUB_OAUTH_SECRET` | Client secret dari langkah 1 |

Simpan → **Deployments → Retry deployment** (atau `git push` sekali lagi) supaya
env var-nya kepakai.

### Selesai

Buka `https://jastin.xyz/admin/` → **Login with GitHub** → authorize →
masuk panel. Tambah/edit project → **Publish** → Cloudflare rebuild otomatis.

> Kalau muncul "Not Found" dari `api.netlify.com` seperti sebelumnya, berarti
> `base_url`/`auth_endpoint` di `public/admin/config.yml` belum ke-deploy —
> pastikan commit terakhir sudah live di Cloudflare.

---

## Edit konten TANPA panel (lokal)

```bash
npx decap-server      # terminal 1
npm run dev           # terminal 2
```

Buka `http://localhost:5173/admin/` → **"Work with Local Repo"** (tanpa login).
Perubahan langsung nulis file di `content/`. Lalu commit + push seperti biasa.

Atau edit file `.md` di `content/` langsung pakai teks editor.

---

## Ganti CV / hero image / dsb.

- **CV:** taruh file baru di `public/uploads/`, update `content/site.md` baris
  `cvFile:` (atau lewat panel: Info Utama → File CV).
- **Hero background:** ganti `public/uploads/hero-bg.jpg`, atau ubah
  `content/site.md` baris `heroImage:`. Kegelapannya diatur di
  `src/components/Hero.css` (blok `.hero--has-bg`).
- **Form kontak:** key Web3Forms ada di `content/site.md` baris `formAccessKey:`.
