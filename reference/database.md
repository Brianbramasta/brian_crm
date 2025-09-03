Berikut saya pisahkan masing-masing tabel CRM PT. Smart dalam format Markdown, lengkap dengan kolom, tipe data, dan keterangan.

1. Tabel users
   Kolom Tipe Data Keterangan
   id BIGINT / SERIAL PK Primary key
   name VARCHAR(100) Nama lengkap user
   email VARCHAR(100) UNIQUE Email login
   password VARCHAR(255) Password hash
   role ENUM('sales','manager') Role user
   created_at TIMESTAMP Waktu dibuat
   updated_at TIMESTAMP Waktu diupdate
2. Tabel leads
   Kolom Tipe Data Keterangan
   id BIGINT / SERIAL PK Primary key
   name VARCHAR(100) Nama calon customer
   contact VARCHAR(50) Nomor kontak
   address VARCHAR(255) Alamat
   kebutuhan VARCHAR(255) Kebutuhan layanan
   status ENUM('new','contacted','qualified','lost') Status lead
   owner_user_id BIGINT FK → users(id) Sales owner lead
   created_at TIMESTAMP Waktu dibuat
   updated_at TIMESTAMP Waktu diupdate
3. Tabel products
   Kolom Tipe Data Keterangan
   id BIGINT / SERIAL PK Primary key
   name VARCHAR(100) Nama produk/layanan
   hpp DECIMAL(12,2) Harga pokok penjualan
   margin_percent DECIMAL(5,2) Margin %
   harga_jual DECIMAL(12,2) Harga jual otomatis (hpp + margin)
   created_at TIMESTAMP Waktu dibuat
   updated_at TIMESTAMP Waktu diupdate
4. Tabel deals
   Kolom Tipe Data Keterangan
   id BIGINT / SERIAL PK Primary key
   lead_id BIGINT FK → leads(id) Lead yang dikonversi
   status ENUM('waiting_approval','approved','rejected') Status deal
   total_amount DECIMAL(12,2) Total harga
   created_at TIMESTAMP Waktu dibuat
   updated_at TIMESTAMP Waktu diupdate
5. Tabel deal_items
   Kolom Tipe Data Keterangan
   id BIGINT / SERIAL PK Primary key
   deal_id BIGINT FK → deals(id) Deal terkait
   product_id BIGINT FK → products(id) Produk terjual
   qty INT Jumlah produk
   harga_nego DECIMAL(12,2) Harga nego per produk
   subtotal DECIMAL(12,2) qty \* harga_nego
6. Tabel customers
   Kolom Tipe Data Keterangan
   id BIGINT / SERIAL PK Primary key
   lead_id BIGINT FK → leads(id) Lead asli (opsional)
   name VARCHAR(100) Nama customer
   contact VARCHAR(50) Kontak
   created_at TIMESTAMP Waktu dibuat
   updated_at TIMESTAMP Waktu diupdate
7. Tabel customer_services
   Kolom Tipe Data Keterangan
   id BIGINT / SERIAL PK Primary key
   customer_id BIGINT FK → customers(id) Customer terkait
   product_id BIGINT FK → products(id) Produk yang digunakan
   price DECIMAL(12,2) Harga layanan
   start_date DATE Tanggal mulai layanan

    💡 Catatan Relasi Utama

users → leads (1:N)

leads → deals (1:N)

deals → deal_items (1:N)

leads → customers (1:1 / optional)

customers → customer_services (1:N)

products → deal_items / customer_services (1:N)
