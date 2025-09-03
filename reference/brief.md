Mini Project: CRM untuk PT. Smart
Latar Belakang

PT. Smart adalah sebuah perusahaan ISP (Internet Service Provider) yang sedang menjalani proses digitalisasi. Saat ini, divisi sales masih melakukan pencatatan calon customer (lead), data pelanggan, produk layanan, dan transaksi penjualan secara manual.

Untuk mendukung transformasi digital, tim IT Apps diminta membangun sebuah aplikasi CRM (Customer Relationship Management) sederhana yang akan digunakan oleh tim sales dan manajer.

Berdasarkan hasil analisis dari System Analyst, aplikasi ini harus mampu:

Mencatat dan mengelola calon customer (lead)

Menyimpan data produk (layanan internet)

Mengelola proses konversi lead menjadi customer

Menampilkan data pelanggan aktif dan layanan yang digunakan

Fitur Utama yang Wajib Ada

1. Halaman Login

Hanya user yang login yang dapat mengakses dashboard.

Autentikasi dapat menggunakan session atau JWT.

2. Halaman Leads (Calon Customer)

Fitur untuk tambah, edit, hapus, dan menampilkan daftar lead.

Informasi minimal yang dicatat: nama, kontak, alamat, kebutuhan, dan status.

3. Halaman Master Produk

Fitur CRUD produk (misalnya: paket internet 50Mbps, 100Mbps, dll).

Setiap produk memiliki:

HPP (Harga Pokok Penjualan)

Margin Sales (Persentase keuntungan)

Harga Jual (otomatis dihitung dari HPP + margin)

4. Halaman Project / Deal Pipeline

Proses untuk mengubah lead menjadi customer.

Mendukung penjualan dengan lebih dari satu produk per transaksi.

Harga per produk bisa dinegosiasikan.

Jika harga yang diinputkan di bawah harga jual, maka perlu approval dari leader.

Status project: waiting_approval, approved, rejected.

5. Halaman Customer Aktif

Menampilkan daftar customer yang sudah berlangganan.

Setiap customer dapat memiliki lebih dari satu layanan.

6. Halaman Reporting

Menampilkan laporan data yang relevan (format bebas sesuai kebutuhan aplikasi).

Laporan dapat difilter berdasarkan periode waktu tertentu.

Laporan dapat didownload dalam format Excel.

Role & Akses

Terdapat dua jenis user: Sales dan Manager.

Antar Sales tidak dapat melihat data milik Sales lain.

Manager dapat melihat seluruh data dari semua Sales.

Catatan Teknis

Kerjakan dengan menggunakan karya sendiri.

Untuk flow aplikasi bisa diimprovisasi sendiri.

Pekerjaan wajib dipush ke Github.

Buat repository dengan format: namadepan_crm dan diset ke public.

Dalam development, gunakan best practice dari framework / bahasa pemrograman yang digunakan.

Database yang digunakan bisa MySQL atau PostgreSQL.

Lama pengerjaan: 5 x 24 jam (terhitung dari saat menerima soal).

Apabila sudah selesai, kirimkan link repository dengan README lengkap untuk proses deploy / menjalankan aplikasinya.

Deploy aplikasi ke cloud (contoh: Heroku, Vercel, Netlify, Railway, dll).

Menyediakan Dockerfile dan docker-compose.yml untuk containerisasi akan menjadi nilai tambah.

Happy Coding! 🚀
