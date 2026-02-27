# Catatan Pengecekan Requirement

**Project:** `d:\Hacktiv8\Fase1\test`

## Keterangan
- `?` = sudah terpenuhi
- `x` = belum/kurang sesuai requirement

## Requirement Routes
1. Minimal 2 route GET dan 1 route POST -> `?`
- Bukti kode: `routes/login.js` (`router.get('/register')`, `router.get('/login')`, `router.post('/register')`, `router.post('/login')`), `routes/home.js` (`router.get('/')`)
2. Terdapat route untuk logout -> `?`
- Bukti kode: `routes/login.js` (`router.get('/logout', Controller.logout)`)

## Requirement Aplikasi
1. Ada fitur search/sort (pakai OP sequelize) -> `?`
- Bukti kode: `models/merchant.js` (`static searchAndSort`, `Op.iLike`, dynamic `order`)
2. Ada static method di model -> `?`
- Bukti kode: `models/user.js` (`static findByEmail`), `models/merchant.js` (`static searchAndSort`)
3. Ada instance method / getter di model -> `?`
- Bukti kode: `models/user.js` (`checkPassword`, `get maskedPhone`)
4. Validasi sequelize beragam + ditampilkan ke page -> `?`
- Bukti kode: `notNull`, `notEmpty`, `len`, `isEmail`, `isNumeric`, `isInt`, `min`, `isIn`, custom validator; `controllers/controller.js` (`parseSequelizeError`)
5. Menggunakan method sequelize untuk CRUD -> `?`
- Bukti kode: `create`, `findByPk/findAll/findOne`, `update`, `destroy`
6. Terdapat hooks -> `?`
- Bukti kode: `models/user.js` (`beforeCreate`, `beforeUpdate`, `beforeBulkCreate`)
7. Membuat dan menggunakan helper -> `?`
- Bukti kode: `helpers/format.js` (`formatCurrency`), dipasang di `app.js` via `res.locals.helpers`
8. Menggunakan promise chaining (notif delete) -> `?`
- Bukti kode: `controllers/controller.js` (`deleteMerchant` pakai `.then().then().catch()`)

## Requirement Pages
1. Landing page -> `?`
- Bukti kode: `views/landing.ejs`, route `GET /`
2. Register & login page -> `?`
- Bukti kode: `views/register.ejs`, `views/login.ejs`, route di `routes/login.js`
3. 1 page menampilkan gabungan >= 2 tabel (eager loading) -> `?`
- Bukti kode: `dashboard()` include `Profile`, `Wallet`, `Transaction`, `Merchant`

## Requirement Explore
1. Login system dengan middleware, session, bcryptjs -> `?`
- Middleware: `?` (`middlewares/auth.js`)
- Session: `?` (`app.js` + `express-session`)
- bcryptjs: `?` (saat ini sudah pakai package `bcryptjs`)
2. Fitur MVP pakai package tambahan (di luar lecture) -> `?`
- Bukti kode: `pdfkit` untuk export PDF di controller

## Tema Pair Project (Entitas User Wajib)
Spesifikasi screenshot:
- username (optional)
- email unique + required + email format
- password min 8
- role di `[buyer, seller]`

Hasil di project ini:
- username -> `x` (pakai `name`)
- email unique/required/format -> `?`
- password min 8 -> `x` (sekarang min 6)
- role buyer/seller -> `x` (sekarang user/merchant)

## Kesimpulan
Mayoritas requirement aplikasi sudah terpenuhi.
Yang masih belum jika mengikuti screenshot secara ketat:
1. Spesifikasi entitas User tema (username, password min 8, role buyer/seller)
