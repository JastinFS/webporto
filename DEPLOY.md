# Deploy & Panel Admin (edit tanpa ribet)

Situs ini **statis** — hasil `npm run build` (folder `dist/`) bisa ditaruh di
hosting gratis mana pun. Konten (project, about, skills, kontak, CV) ada di
folder [`content/`](content/) dan bisa diedit lewat **panel admin** di `/admin/`.

---

## A. Edit konten SEKARANG (di komputer, tanpa hosting)

1. Terminal 1:
   ```bash
   npx decap-server
   ```
2. Terminal 2:
   ```bash
   npm run dev
   ```
3. Buka **http://localhost:5173/admin/** → klik **"Work with Local Repo"** bila
   diminta (tanpa login).
4. Tambah / edit project → **Publish**. File `.md` di `content/projects/`
   langsung berubah dan situs otomatis reload.

> Gambar yang di-upload lewat panel masuk ke `public/uploads/`.

---

## B. Kalau sudah punya hosting — biar bisa edit dari mana saja

Langkah wajib sekali saja: **taruh kode di GitHub**.

```bash
cd portfolio
git init
git add .
git commit -m "Portfolio awal"
# buat repo kosong di github.com, lalu:
git remote add origin https://github.com/JastinFS/NAMA-REPO.git
git branch -M main
git push -u origin main
```

Lalu buka [`public/admin/config.yml`](public/admin/config.yml) dan ganti baris:

```yml
repo: JastinFS/portfolio      # <- ganti "portfolio" jadi nama repo kamu
```

Commit & push perubahan itu.

### Pilihan hosting

| Hosting | Cara deploy | Panel admin |
| --- | --- | --- |
| **Netlify** (paling mulus) | Connect repo → build `npm run build`, publish `dist` | Aktifkan **Identity** + **Git Gateway** (lihat B.1) |
| **Vercel** | Import repo → framework "Vite", otomatis | Perlu OAuth GitHub (lihat B.2) |
| **GitHub Pages** | Actions → deploy `dist` | Perlu OAuth GitHub (lihat B.2) |
| **Cloudflare Pages** | Connect repo → build `npm run build`, output `dist` | Perlu OAuth GitHub (lihat B.2) |

Setiap kali kamu klik **Publish** di panel, hosting otomatis rebuild &
situs update dalam ~1 menit.

---

### B.1 — Netlify (rekomendasi: paling sedikit langkah)

1. netlify.com → **Add new site → Import from Git** → pilih repo.
   Build command `npm run build`, publish directory `dist`.
2. Site settings → **Identity** → **Enable Identity**.
3. Identity → **Registration** → set **Invite only**, lalu **Invite users**
   → masukkan emailmu, cek email, set password.
4. Identity → **Services** → **Enable Git Gateway**.
5. Edit `public/admin/config.yml`, ganti blok `backend:` jadi:
   ```yml
   backend:
     name: git-gateway
     branch: main
   ```
   Commit & push.
6. Selesai. Buka `https://situsmu.netlify.app/admin/` → login → edit project.

### B.2 — Vercel / GitHub Pages / Cloudflare (backend GitHub)

Biarkan `backend: name: github` di `config.yml`. Butuh satu "jembatan" OAuth
(sekali setup, gratis). Cara termudah pakai **Cloudflare Worker**:

1. Buat GitHub OAuth App: github.com → Settings → Developer settings →
   **OAuth Apps → New**. Homepage = URL situsmu.
   Authorization callback URL = `https://<worker-kamu>.workers.dev/callback`.
   Catat **Client ID** & **Client Secret**.
2. Deploy worker siap-pakai:
   `https://github.com/sterlingcm/netlify-cms-oauth` atau
   `https://github.com/i40west/netlify-cms-cloudflare-pages`
   (isi `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`).
3. Tambah `base_url` ke `config.yml`:
   ```yml
   backend:
     name: github
     repo: JastinFS/NAMA-REPO
     branch: main
     base_url: https://<worker-kamu>.workers.dev
   ```
   Commit & push.
4. Buka `https://situsmu/admin/` → **Login with GitHub**.

> Kalau nanti pilih Netlify, cara B.1 jauh lebih singkat — tak perlu worker.

---

## Ganti CV

Taruh file baru di `public/uploads/` (mis. `CV_Jastin_2026.pdf`), lalu di panel
admin **Halaman & Info → Info Utama → File CV** pilih file itu. Atau edit
`content/site.md` baris `cvFile:`.
