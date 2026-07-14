# Ringkasan Project — Toko Widi

Aplikasi manajemen toko oleh-oleh "Toko Widi": pencatatan produk, supplier, transaksi kasir (POS), laporan penjualan, dan manajemen user, dengan dua role — **admin** (Dashboard, Product read-only, Reports, Kelola User) dan **karyawan** (Product CRUD, Supplier, Kasir, Transaksi).

Struktur repo:
- `backend/` — REST API Laravel (PHP)
- `frontend/` — SPA React (Vite)

## Tech stack frontend

| Library | Kegunaan |
|---|---|
| React 19 + React Router 7 | UI & routing (lazy-loaded per halaman) |
| Axios | HTTP client ke API Laravel |
| Tailwind CSS 4 + daisyUI 5 | Styling |
| react-icons (Material Design set, `react-icons/md`) | Ikon |
| Recharts | Grafik di Dashboard |

## Halaman (`frontend/src/pages/`)

| Halaman | Route | Akses | Isi |
|---|---|---|---|
| Login | `/` | publik | Form login, dialog "Login berhasil" (`SuccessModal`) sebelum redirect |
| Dashboard | `/dashboard` | admin | Statistik toko, grafik penjualan (Recharts), transaksi terbaru |
| Product | `/product` | admin (read-only) / karyawan (CRUD) | Daftar produk, search, filter "Produk Expired" & "Segera Expired (7 Hari)", tambah/edit/hapus produk |
| Reports | `/reports` | admin | Filter tanggal, ringkasan pendapatan, grafik penjualan per hari, produk terlaris, semua transaksi |
| Kelola User (Users) | `/users` | admin | CRUD akun karyawan |
| Suppliers | `/suppliers` | karyawan | CRUD data supplier |
| Kasir | `/kasir` | karyawan | POS: pilih produk, keranjang, checkout transaksi |
| Transactions | `/transactions` | karyawan | Riwayat transaksi |
| Settings | `/settings` | semua role | Tab Profil Akun & Keamanan (ganti password) |

## Komponen (`frontend/src/components/`)

- **PageHeader.jsx** — judul halaman (dibaca dari `pathname` lewat mapping route→judul), dipakai di hampir semua halaman lewat `<PageHeader />`.
- **Header.jsx** — navbar atas tetap (di dalam `MainLayout`), berisi sapaan "Halo, selamat datang..." dan avatar user.
- **Sidebar.jsx** — menu navigasi kiri, item menu berbeda tergantung role (admin vs karyawan), tombol logout.
- **Pagination.jsx** — komponen pagination reusable (props: `page`, `total`, `perPage`, `onChange`), tombol prev/next + nomor halaman dengan warna aktif brand (`#8B4513`). Dipakai di Product, Suppliers, Transactions, Kasir.
- **ConfirmModal.jsx** — dialog konfirmasi di tengah layar (ikon `!`, tombol "Ya"/"Batal"). Dipakai untuk konfirmasi hapus (Product, Users, Suppliers) dan konfirmasi simpan perubahan (Settings).
- **SuccessModal.jsx** — dialog notifikasi sukses di tengah layar (ikon centang hijau, tanpa tombol, auto-hilang). Dipakai untuk pesan "Login berhasil" di halaman Login.
- **Toast.jsx** — notifikasi kecil pojok kanan atas (success/error/info), dikendalikan lewat `ToastContext`/`useToast()`. Dipakai luas untuk feedback CRUD (mis. "Produk berhasil ditambahkan").
- **Loading.jsx** — layar loading penuh (spinner), dipakai sebagai fallback `<Suspense>` saat lazy-load halaman, dan saat `AuthContext` masih memeriksa sesi login.
- **ProtectedRoute.jsx** — dua route guard: `ProtectedRoute` (harus login) dan `RoleRoute` (harus login + role tertentu), dipakai membungkus route di `App.jsx`.
- **Footer.jsx** — belum berisi apa-apa (file kosong, belum dipakai).

## Layout (`frontend/src/layout/`)

- **MainLayout.jsx** — kerangka halaman setelah login: `Sidebar` + `Header` + area konten (`<Outlet />`).
- **AuthLayout.jsx** — kerangka halaman sebelum login (Login): cuma background + `<Outlet />`, tanpa sidebar/header.

## Context (state management global, `frontend/src/context/`)

- **AuthContext.jsx** — sesi user: `login`, `logout`, `updateProfile`, `updatePassword`, simpan token & data user di `localStorage`, restore sesi otomatis lewat endpoint `/me` saat app dibuka.
- **ToastContext.jsx** — antrian notifikasi toast (`showToast(message, type)`), auto-hilang setelah 3.5 detik.

## Alur routing (`App.jsx`)

Semua halaman di-*lazy load* (`React.lazy`). Route dibagi dua grup: yang dibungkus `MainLayout` (butuh login, sebagian juga butuh role tertentu lewat `RoleRoute`), dan yang dibungkus `AuthLayout` (cuma Login — publik).
