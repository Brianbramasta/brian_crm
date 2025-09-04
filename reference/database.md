# Database Schema - PT. Smart CRM

Dokumentasi lengkap struktur database untuk aplikasi **CRM (Customer Relationship Management) PT. Smart**.  
Database ini dirancang untuk mendukung proses sales, manajemen leads, deals, dan customer untuk perusahaan ISP.

---

## 1. Tabel `users`

**Deskripsi**: Menyimpan data user (sales dan manager) yang dapat mengakses sistem CRM

| Kolom               | Tipe Data               | Constraint                                            | Keterangan             |
| ------------------- | ----------------------- | ----------------------------------------------------- | ---------------------- |
| `id`                | BIGINT / SERIAL         | PK                                                    | Primary key            |
| `name`              | VARCHAR(100)            | NOT NULL                                              | Nama lengkap user      |
| `email`             | VARCHAR(100)            | UNIQUE, NOT NULL                                      | Email login            |
| `email_verified_at` | TIMESTAMP               | NULL                                                  | Waktu verifikasi email |
| `password`          | VARCHAR(255)            | NOT NULL                                              | Password hash          |
| `role`              | ENUM('sales','manager') | NOT NULL, DEFAULT 'sales'                             | Role user              |
| `is_active`         | BOOLEAN                 | DEFAULT TRUE                                          | Status aktif user      |
| `remember_token`    | VARCHAR(100)            | NULL                                                  | Token remember me      |
| `created_at`        | TIMESTAMP               | DEFAULT CURRENT_TIMESTAMP                             | Waktu dibuat           |
| `updated_at`        | TIMESTAMP               | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Waktu diupdate         |

**Indexes**:

-   PRIMARY KEY (`id`)
-   UNIQUE KEY (`email`)
-   INDEX (`role`)

---

## 2. Tabel `leads`

**Deskripsi**: Menyimpan data calon customer (prospek) yang akan dikonversi menjadi customer

| Kolom        | Tipe Data                                                                               | Constraint                                            | Keterangan                           |
| ------------ | --------------------------------------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------ |
| `id`         | BIGINT / SERIAL                                                                         | PK                                                    | Primary key                          |
| `name`       | VARCHAR(100)                                                                            | NOT NULL                                              | Nama calon customer                  |
| `email`      | VARCHAR(100)                                                                            | NULL                                                  | Email calon customer                 |
| `phone`      | VARCHAR(50)                                                                             | NULL                                                  | Nomor telepon/kontak                 |
| `address`    | TEXT                                                                                    | NULL                                                  | Alamat lengkap                       |
| `needs`      | TEXT                                                                                    | NULL                                                  | Kebutuhan layanan internet           |
| `status`     | ENUM('new','contacted','qualified','proposal','negotiation','closed_won','closed_lost') | NOT NULL, DEFAULT 'new'                               | Status lead dalam sales pipeline     |
| `source`     | VARCHAR(100)                                                                            | NULL                                                  | Sumber lead (website, referral, dll) |
| `notes`      | TEXT                                                                                    | NULL                                                  | Catatan tambahan                     |
| `sales_id`   | BIGINT                                                                                  | FK, NOT NULL                                          | Sales yang menangani lead            |
| `created_at` | TIMESTAMP                                                                               | DEFAULT CURRENT_TIMESTAMP                             | Waktu dibuat                         |
| `updated_at` | TIMESTAMP                                                                               | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Waktu diupdate                       |

**Foreign Keys**:

-   `sales_id` REFERENCES `users(id)` ON DELETE RESTRICT

**Indexes**:

-   PRIMARY KEY (`id`)
-   INDEX (`sales_id`)
-   INDEX (`status`)
-   INDEX (`created_at`)

---

## 3. Tabel `products`

**Deskripsi**: Master data produk/layanan internet yang ditawarkan PT. Smart

| Kolom               | Tipe Data       | Constraint                                            | Keterangan                                          |
| ------------------- | --------------- | ----------------------------------------------------- | --------------------------------------------------- |
| `id`                | BIGINT / SERIAL | PK                                                    | Primary key                                         |
| `name`              | VARCHAR(100)    | NOT NULL                                              | Nama produk/paket (e.g., "Paket 50Mbps")            |
| `description`       | TEXT            | NULL                                                  | Deskripsi detail produk                             |
| `hpp`               | DECIMAL(12,2)   | NOT NULL                                              | Harga Pokok Penjualan (Cost)                        |
| `margin_percentage` | DECIMAL(5,2)    | NOT NULL                                              | Persentase margin keuntungan                        |
| `selling_price`     | DECIMAL(12,2)   | GENERATED                                             | Harga jual = hpp + (hpp \* margin_percentage / 100) |
| `category`          | VARCHAR(50)     | NULL                                                  | Kategori produk (residential, corporate, dll)       |
| `bandwidth`         | VARCHAR(20)     | NULL                                                  | Kecepatan bandwidth (50Mbps, 100Mbps, dll)          |
| `is_active`         | BOOLEAN         | DEFAULT TRUE                                          | Status aktif produk                                 |
| `created_at`        | TIMESTAMP       | DEFAULT CURRENT_TIMESTAMP                             | Waktu dibuat                                        |
| `updated_at`        | TIMESTAMP       | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Waktu diupdate                                      |

**Indexes**:

-   PRIMARY KEY (`id`)
-   INDEX (`is_active`)
-   INDEX (`category`)

**Triggers/Computed Columns**:

```sql
-- Trigger untuk auto-calculate selling_price
CREATE TRIGGER calculate_selling_price
BEFORE INSERT OR UPDATE ON products
FOR EACH ROW
SET NEW.selling_price = NEW.hpp + (NEW.hpp * NEW.margin_percentage / 100);
```

---

## 4. Tabel `deals`

**Deskripsi**: Deal/project untuk konversi lead menjadi customer dengan proses approval

| Kolom             | Tipe Data                                                                         | Constraint                                            | Keterangan                    |
| ----------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------- | ----------------------------- |
| `id`              | BIGINT / SERIAL                                                                   | PK                                                    | Primary key                   |
| `lead_id`         | BIGINT                                                                            | FK, NOT NULL                                          | Lead yang dikonversi          |
| `deal_number`     | VARCHAR(50)                                                                       | UNIQUE                                                | Nomor deal (auto-generated)   |
| `title`           | VARCHAR(200)                                                                      | NOT NULL                                              | Judul deal                    |
| `description`     | TEXT                                                                              | NULL                                                  | Deskripsi deal                |
| `total_amount`    | DECIMAL(12,2)                                                                     | NOT NULL, DEFAULT 0                                   | Total nilai deal              |
| `discount_amount` | DECIMAL(12,2)                                                                     | DEFAULT 0                                             | Total diskon                  |
| `final_amount`    | DECIMAL(12,2)                                                                     | NOT NULL                                              | Nilai akhir setelah diskon    |
| `status`          | ENUM('draft','waiting_approval','approved','rejected','closed_won','closed_lost') | NOT NULL, DEFAULT 'draft'                             | Status deal                   |
| `needs_approval`  | BOOLEAN                                                                           | DEFAULT FALSE                                         | Apakah butuh approval manager |
| `sales_id`        | BIGINT                                                                            | FK, NOT NULL                                          | Sales yang handle deal        |
| `approved_by`     | BIGINT                                                                            | FK, NULL                                              | Manager yang approve          |
| `approved_at`     | TIMESTAMP                                                                         | NULL                                                  | Waktu approval                |
| `closed_at`       | TIMESTAMP                                                                         | NULL                                                  | Waktu deal ditutup            |
| `notes`           | TEXT                                                                              | NULL                                                  | Catatan deal                  |
| `created_at`      | TIMESTAMP                                                                         | DEFAULT CURRENT_TIMESTAMP                             | Waktu dibuat                  |
| `updated_at`      | TIMESTAMP                                                                         | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Waktu diupdate                |

**Foreign Keys**:

-   `lead_id` REFERENCES `leads(id)` ON DELETE RESTRICT
-   `sales_id` REFERENCES `users(id)` ON DELETE RESTRICT
-   `approved_by` REFERENCES `users(id)` ON DELETE SET NULL

**Indexes**:

-   PRIMARY KEY (`id`)
-   UNIQUE KEY (`deal_number`)
-   INDEX (`lead_id`)
-   INDEX (`sales_id`)
-   INDEX (`status`)
-   INDEX (`created_at`)

---

## 5. Tabel `deal_items`

**Deskripsi**: Item produk dalam setiap deal (support multiple products per deal)

| Kolom                 | Tipe Data       | Constraint                                            | Keterangan                        |
| --------------------- | --------------- | ----------------------------------------------------- | --------------------------------- |
| `id`                  | BIGINT / SERIAL | PK                                                    | Primary key                       |
| `deal_id`             | BIGINT          | FK, NOT NULL                                          | Deal terkait                      |
| `product_id`          | BIGINT          | FK, NOT NULL                                          | Produk yang dijual                |
| `quantity`            | INT             | NOT NULL, DEFAULT 1                                   | Jumlah produk                     |
| `unit_price`          | DECIMAL(12,2)   | NOT NULL                                              | Harga satuan produk (dari master) |
| `negotiated_price`    | DECIMAL(12,2)   | NOT NULL                                              | Harga nego per unit               |
| `discount_percentage` | DECIMAL(5,2)    | DEFAULT 0                                             | Persentase diskon                 |
| `subtotal`            | DECIMAL(12,2)   | GENERATED                                             | quantity \* negotiated_price      |
| `notes`               | TEXT            | NULL                                                  | Catatan item                      |
| `created_at`          | TIMESTAMP       | DEFAULT CURRENT_TIMESTAMP                             | Waktu dibuat                      |
| `updated_at`          | TIMESTAMP       | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Waktu diupdate                    |

**Foreign Keys**:

-   `deal_id` REFERENCES `deals(id)` ON DELETE CASCADE
-   `product_id` REFERENCES `products(id)` ON DELETE RESTRICT

**Indexes**:

-   PRIMARY KEY (`id`)
-   INDEX (`deal_id`)
-   INDEX (`product_id`)

**Triggers**:

```sql
-- Trigger untuk auto-calculate subtotal dan update deal total
CREATE TRIGGER calculate_deal_item_subtotal
BEFORE INSERT OR UPDATE ON deal_items
FOR EACH ROW
SET NEW.subtotal = NEW.quantity * NEW.negotiated_price;

-- Trigger untuk update total_amount di deals
CREATE TRIGGER update_deal_total
AFTER INSERT OR UPDATE OR DELETE ON deal_items
FOR EACH ROW
UPDATE deals SET total_amount = (
    SELECT COALESCE(SUM(subtotal), 0) FROM deal_items WHERE deal_id = NEW.deal_id
) WHERE id = NEW.deal_id;
```

---

## 6. Tabel `customers`

**Deskripsi**: Data customer aktif yang sudah berlangganan layanan

| Kolom                  | Tipe Data                             | Constraint                                            | Keterangan                      |
| ---------------------- | ------------------------------------- | ----------------------------------------------------- | ------------------------------- |
| `id`                   | BIGINT / SERIAL                       | PK                                                    | Primary key                     |
| `customer_number`      | VARCHAR(50)                           | UNIQUE                                                | Nomor customer (auto-generated) |
| `lead_id`              | BIGINT                                | FK, NULL                                              | Lead asal (jika dari konversi)  |
| `name`                 | VARCHAR(100)                          | NOT NULL                                              | Nama customer                   |
| `email`                | VARCHAR(100)                          | NULL                                                  | Email customer                  |
| `phone`                | VARCHAR(50)                           | NULL                                                  | Nomor telepon                   |
| `address`              | TEXT                                  | NULL                                                  | Alamat lengkap                  |
| `billing_address`      | TEXT                                  | NULL                                                  | Alamat penagihan                |
| `installation_address` | TEXT                                  | NULL                                                  | Alamat instalasi                |
| `customer_type`        | ENUM('individual','corporate')        | DEFAULT 'individual'                                  | Tipe customer                   |
| `status`               | ENUM('active','inactive','suspended') | DEFAULT 'active'                                      | Status customer                 |
| `sales_id`             | BIGINT                                | FK, NOT NULL                                          | Sales yang handle               |
| `activation_date`      | DATE                                  | NULL                                                  | Tanggal aktivasi                |
| `notes`                | TEXT                                  | NULL                                                  | Catatan customer                |
| `created_at`           | TIMESTAMP                             | DEFAULT CURRENT_TIMESTAMP                             | Waktu dibuat                    |
| `updated_at`           | TIMESTAMP                             | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Waktu diupdate                  |

**Foreign Keys**:

-   `lead_id` REFERENCES `leads(id)` ON DELETE SET NULL
-   `sales_id` REFERENCES `users(id)` ON DELETE RESTRICT

**Indexes**:

-   PRIMARY KEY (`id`)
-   UNIQUE KEY (`customer_number`)
-   INDEX (`lead_id`)
-   INDEX (`sales_id`)
-   INDEX (`status`)
-   INDEX (`customer_type`)

---

## 7. Tabel `customer_services`

**Deskripsi**: Layanan yang digunakan oleh customer (support multiple services per customer)

| Kolom                  | Tipe Data                                          | Constraint                                            | Keterangan                          |
| ---------------------- | -------------------------------------------------- | ----------------------------------------------------- | ----------------------------------- |
| `id`                   | BIGINT / SERIAL                                    | PK                                                    | Primary key                         |
| `service_number`       | VARCHAR(50)                                        | UNIQUE                                                | Nomor layanan (auto-generated)      |
| `customer_id`          | BIGINT                                             | FK, NOT NULL                                          | Customer terkait                    |
| `product_id`           | BIGINT                                             | FK, NOT NULL                                          | Produk/paket yang digunakan         |
| `deal_id`              | BIGINT                                             | FK, NULL                                              | Deal asal layanan                   |
| `monthly_fee`          | DECIMAL(12,2)                                      | NOT NULL                                              | Biaya bulanan                       |
| `installation_fee`     | DECIMAL(12,2)                                      | DEFAULT 0                                             | Biaya instalasi                     |
| `start_date`           | DATE                                               | NOT NULL                                              | Tanggal mulai layanan               |
| `end_date`             | DATE                                               | NULL                                                  | Tanggal berakhir layanan            |
| `billing_cycle`        | ENUM('monthly','quarterly','yearly')               | DEFAULT 'monthly'                                     | Siklus penagihan                    |
| `status`               | ENUM('active','inactive','suspended','terminated') | DEFAULT 'active'                                      | Status layanan                      |
| `installation_address` | TEXT                                               | NULL                                                  | Alamat instalasi spesifik           |
| `equipment_info`       | JSON                                               | NULL                                                  | Info equipment (router, modem, dll) |
| `notes`                | TEXT                                               | NULL                                                  | Catatan layanan                     |
| `created_at`           | TIMESTAMP                                          | DEFAULT CURRENT_TIMESTAMP                             | Waktu dibuat                        |
| `updated_at`           | TIMESTAMP                                          | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Waktu diupdate                      |

**Foreign Keys**:

-   `customer_id` REFERENCES `customers(id)` ON DELETE CASCADE
-   `product_id` REFERENCES `products(id)` ON DELETE RESTRICT
-   `deal_id` REFERENCES `deals(id)` ON DELETE SET NULL

**Indexes**:

-   PRIMARY KEY (`id`)
-   UNIQUE KEY (`service_number`)
-   INDEX (`customer_id`)
-   INDEX (`product_id`)
-   INDEX (`deal_id`)
-   INDEX (`status`)
-   INDEX (`start_date`)

---

## 8. Tabel `personal_access_tokens` (Laravel Sanctum)

**Deskripsi**: Token autentikasi untuk API access

| Kolom            | Tipe Data       | Constraint                                            | Keterangan                   |
| ---------------- | --------------- | ----------------------------------------------------- | ---------------------------- |
| `id`             | BIGINT / SERIAL | PK                                                    | Primary key                  |
| `tokenable_type` | VARCHAR(255)    | NOT NULL                                              | Model type (App\Models\User) |
| `tokenable_id`   | BIGINT          | NOT NULL                                              | User ID                      |
| `name`           | VARCHAR(255)    | NOT NULL                                              | Token name                   |
| `token`          | VARCHAR(64)     | UNIQUE, NOT NULL                                      | Hashed token                 |
| `abilities`      | TEXT            | NULL                                                  | Token abilities/permissions  |
| `last_used_at`   | TIMESTAMP       | NULL                                                  | Last usage timestamp         |
| `expires_at`     | TIMESTAMP       | NULL                                                  | Token expiration             |
| `created_at`     | TIMESTAMP       | DEFAULT CURRENT_TIMESTAMP                             | Waktu dibuat                 |
| `updated_at`     | TIMESTAMP       | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Waktu diupdate               |

**Indexes**:

-   PRIMARY KEY (`id`)
-   UNIQUE KEY (`token`)
-   INDEX (`tokenable_type`, `tokenable_id`)

---

## Relasi Database

### Relasi Utama:

1. **users → leads** (1:N) - Satu sales menangani banyak leads
2. **leads → deals** (1:N) - Satu lead bisa punya beberapa deals
3. **deals → deal_items** (1:N) - Satu deal punya banyak item produk
4. **products → deal_items** (1:N) - Satu produk bisa dijual di banyak deals
5. **leads → customers** (1:1, optional) - Lead yang berhasil jadi customer
6. **customers → customer_services** (1:N) - Customer bisa punya banyak layanan
7. **products → customer_services** (1:N) - Satu produk bisa dipakai banyak customer
8. **deals → customer_services** (1:N) - Deal yang approved jadi layanan customer

### ERD Diagram (Conceptual):

```
users (sales/manager)
  ├── leads (prospects)
  │   ├── deals (conversion projects)
  │   │   └── deal_items (products in deal)
  │   │       └── products (master data)
  │   └── customers (converted leads)
  │       └── customer_services (active subscriptions)
  │           ├── products (service packages)
  │           └── deals (origin deal)
  └── personal_access_tokens (API auth)
```

---

## Business Rules & Constraints

### 1. **Approval Workflow**

-   Jika `negotiated_price` < `selling_price` dalam deal_items, maka deal otomatis `needs_approval = TRUE`
-   Hanya user dengan role `manager` yang bisa approve deals
-   Deal dengan status `approved` bisa dikonversi jadi customer

### 2. **Lead to Customer Conversion**

-   Ketika deal status menjadi `closed_won`, lead status otomatis menjadi `closed_won`
-   Customer baru dibuat dengan referensi ke lead_id
-   Customer services dibuat berdasarkan deal_items

### 3. **Price Calculation**

-   `products.selling_price` = `hpp` + (`hpp` \* `margin_percentage` / 100)
-   `deal_items.subtotal` = `quantity` \* `negotiated_price`
-   `deals.total_amount` = SUM(`deal_items.subtotal`)
-   `deals.final_amount` = `total_amount` - `discount_amount`

### 4. **Role-Based Data Access**

-   **Sales**: Hanya bisa akses data yang `sales_id` = user.id
-   **Manager**: Bisa akses semua data

### 5. **Auto-Generated Numbers**

-   `customers.customer_number`: Format "CUST-YYYYMMDD-XXX"
-   `deals.deal_number`: Format "DEAL-YYYYMMDD-XXX"
-   `customer_services.service_number`: Format "SVC-YYYYMMDD-XXX"

---

## Sample Data

### Users

```sql
INSERT INTO users (name, email, password, role) VALUES
('John Sales', 'john@ptsmart.com', '$2y$10$...', 'sales'),
('Jane Manager', 'jane@ptsmart.com', '$2y$10$...', 'manager');
```

### Products

```sql
INSERT INTO products (name, description, hpp, margin_percentage) VALUES
('Paket Internet 50Mbps', 'Paket internet rumahan 50Mbps unlimited', 200000, 25),
('Paket Internet 100Mbps', 'Paket internet rumahan 100Mbps unlimited', 350000, 30),
('Paket Corporate 1Gbps', 'Paket dedicated untuk perusahaan', 2000000, 40);
```

### Leads

```sql
INSERT INTO leads (name, email, phone, address, needs, status, sales_id) VALUES
('PT. Contoh Perusahaan', 'info@contoh.com', '021-1234567', 'Jakarta Selatan', 'Internet dedicated 100Mbps', 'qualified', 1),
('Budi Santoso', 'budi@email.com', '081234567890', 'Depok', 'Internet rumahan 50Mbps', 'new', 1);
```

---

## Migration Commands

```bash
# Generate migrations
php artisan make:migration create_users_table
php artisan make:migration create_leads_table
php artisan make:migration create_products_table
php artisan make:migration create_deals_table
php artisan make:migration create_deal_items_table
php artisan make:migration create_customers_table
php artisan make:migration create_customer_services_table

# Run migrations
php artisan migrate

# Seed sample data
php artisan db:seed
```
