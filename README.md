# PT Smart CRM - Sistem Manajemen Hubungan Pelanggan

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-10.10+-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel">
  <img src="https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/PHP-8.1+-777BB4?style=for-the-badge&logo=php&logoColor=white" alt="PHP">
  <img src="https://img.shields.io/badge/MySQL-8.0+-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL">
  <img src="https://img.shields.io/badge/Vite-4.4.5-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
</p>

## 📋 Tentang Proyek

PT Smart CRM adalah sistem manajemen hubungan pelanggan (Customer Relationship Management) yang dibangun menggunakan Laravel sebagai backend dan React sebagai frontend. Sistem ini dirancang untuk memberikan solusi yang robust dan scalable untuk mengelola interaksi pelanggan dan proses bisnis.

### 🎯 Target Pengguna
- Tim bisnis yang memerlukan manajemen data pelanggan
- Tim sales untuk tracking penjualan
- Tim customer service untuk komunikasi pelanggan
- Manager untuk analisis dan reporting

### 💡 Masalah yang Dipecahkan
- Manajemen data pelanggan yang terpusat
- Proses komunikasi dan follow-up yang efisien
- Arsitektur yang scalable untuk penggunaan enterprise
- Role-based access control untuk keamanan data

## ✨ Fitur Utama

### 🔐 Autentikasi & Authorization
- Login/logout dengan Laravel Sanctum
- Role-based access control (Sales/Manager)
- Token-based authentication untuk API

### 👥 Manajemen Pelanggan
- CRUD operations untuk data pelanggan
- Auto-generated customer numbers (CUST-YYYYMMDD-001)
- Tracking lifecycle pelanggan (Lead → Deal → Customer)
- Management alamat billing dan instalasi

### 🎯 Manajemen Leads
- Tracking status leads dengan workflow approval
- Konversi leads ke deals dan customers
- Search dan filtering berdasarkan berbagai kriteria

### 💼 Manajemen Deals
- Pipeline management dengan approval workflow
- Support multiple products per deal
- Price negotiation dan discount approval
- Audit trail untuk semua perubahan status

### 📦 Manajemen Produk
- Product catalog untuk layanan ISP
- HPP dan margin percentage dengan auto-calculated selling price
- Bandwidth specifications dan service features
- Billing cycle dan installation requirements

### 📊 Reporting & Analytics
- Dashboard dengan KPI utama
- Lead conversion analytics
- Sales performance tracking
- Product performance analysis
- Excel export untuk semua reports

## 🏗️ Arsitektur Sistem

### Pattern Arsitektur
- **Backend**: MVC (Model-View-Controller) dengan Laravel
- **Frontend**: Component-based architecture dengan React
- **API**: RESTful API dengan Laravel Sanctum authentication

### Design Patterns
- **Service Provider**: Dependency injection dan service registration
- **Middleware Pattern**: Request filtering dan authentication
- **Repository Pattern**: Data access layer (optional)
- **Facade Pattern**: Simplified access ke complex subsystems

## 🛠️ Technology Stack

### Backend
- **PHP**: 8.1+
- **Laravel Framework**: 10.10+
- **Laravel Sanctum**: 3.3+ (API authentication)
- **MySQL**: Database utama
- **Eloquent ORM**: Database interactions

### Frontend
- **React**: 18.2.0
- **Vite**: 4.4.5 (Build tool)
- **React Router**: 6.8.0 (Client-side routing)
- **Axios**: 1.6.4 (HTTP client)
- **Tailwind CSS**: Styling framework
- **Lucide React**: Icon library

### Development Tools
- **Composer**: PHP dependency management
- **NPM**: Frontend dependency management
- **Laravel Tinker**: Interactive shell
- **PHPUnit**: Testing framework
- **Faker**: Sample data generation

## 🚀 Setup dan Installation

### Prerequisites
- PHP 8.1 atau lebih tinggi
- Composer
- Node.js 16+ dengan NPM
- MySQL atau MariaDB
- Git

### Installation Steps

#### 1. Clone Repository
```bash
git clone <repository-url>
cd ptsmart-crm
```

#### 2. Backend Setup
```bash
# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure database di .env file
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=ptsmart_crm
# DB_USERNAME=your_username
# DB_PASSWORD=your_password

# Run migrations
php artisan migrate

# (Optional) Seed database dengan sample data
php artisan db:seed
```

#### 3. Frontend Setup
```bash
# Navigate ke frontend directory
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Configure API URL di .env
# VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

#### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
php artisan serve
# Backend akan berjalan di http://127.0.0.1:8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Frontend akan berjalan di http://127.0.0.1:3000
```

## 🏭 Production Deployment

### Build untuk Production
```bash
# Build frontend
cd frontend
npm run build

# Atau gunakan automated script
./auto-build.bat  # Windows
./auto-build.sh   # Linux/Mac
```

### cPanel Deployment
1. Build aplikasi secara lokal
2. Upload files ke cPanel hosting
3. Pisahkan Laravel app dari public assets
4. Configure .htaccess untuk SPA routing
5. Setup database dan environment variables

Lihat file `PRODUCTION-404-FIX.md` untuk panduan deployment detail.

## 📁 Struktur Direktori

```
ptsmart-crm/
├── app/                    # Laravel application
│   ├── Http/Controllers/   # API controllers
│   ├── Models/            # Eloquent models
│   └── Exports/           # Excel export classes
├── database/
│   ├── migrations/        # Database migrations
│   └── seeders/          # Database seeders
├── frontend/              # React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── contexts/     # React contexts
│   └── dist/             # Built frontend assets
├── public/               # Laravel public directory
│   └── frontend/        # Built React assets
├── routes/              # Laravel routes
├── resources/views/     # Blade templates
└── reference/          # Project documentation
```

## 🔧 Development Commands

### Backend Commands
```bash
# Clear all caches
php artisan optimize:clear

# Run migrations
php artisan migrate

# Reset database dengan seeding
php artisan migrate:fresh --seed

# Generate model dengan migration
php artisan make:model ModelName -m

# Generate controller
php artisan make:controller Api/ControllerName --api
```

### Frontend Commands
```bash
# Development server
npm run dev

# Build untuk production
npm run build

# Preview production build
npm run preview
```

## 🧪 Testing

### Backend Testing
```bash
# Run all tests
php artisan test

# Run specific test
php artisan test --filter=TestName

# Generate test coverage
php artisan test --coverage
```

### Frontend Testing
```bash
cd frontend

# Run tests (jika sudah dikonfigurasi)
npm test
```

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/user` - Get authenticated user

### Core Endpoints
- `GET /api/leads` - Get leads list
- `POST /api/leads` - Create new lead
- `GET /api/deals` - Get deals list
- `POST /api/deals` - Create new deal
- `GET /api/customers` - Get customers list
- `POST /api/customers` - Create new customer
- `GET /api/products` - Get products list
- `GET /api/reports/dashboard-stats` - Dashboard statistics

Semua endpoints memerlukan Bearer token authentication kecuali login.

## 🔒 Security Features

- CSRF protection via middleware
- Password hashing menggunakan Laravel Hash facade
- API token authentication via Laravel Sanctum
- Role-based access control (Sales/Manager)
- Input validation untuk semua endpoints
- SQL injection protection via Eloquent ORM

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Code Standards
- PSR-12 untuk PHP code
- Laravel coding conventions
- React best practices untuk frontend
- Consistent naming conventions

## 📝 License

Project ini menggunakan [MIT license](https://opensource.org/licenses/MIT).

## 👥 Tim Pengembang

- **Backend Developer**: Laravel API development
- **Frontend Developer**: React UI/UX development
- **DevOps**: Deployment dan infrastructure

## 📞 Support

Jika menemukan bug atau memerlukan bantuan:
1. Check existing issues di repository
2. Create new issue dengan detail yang jelas
3. Sertakan steps to reproduce untuk bugs

---

**PT Smart CRM** - Solusi CRM yang powerful untuk bisnis modern. 🚀