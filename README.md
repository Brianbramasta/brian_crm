# PTSmart CRM

A comprehensive Customer Relationship Management system built with Laravel backend and React frontend, fully containerized with Docker for easy development and deployment.

## 🏗️ Architecture

-   **Backend:** Laravel 10.x with PHP 8.1+
-   **Frontend:** React 18.x with Material-UI
-   **Database:** MySQL 8.0
-   **Cache:** Redis 7.x
-   **Containerization:** Docker & Docker Compose
-   **Web Server:** Nginx (production)

## 🚀 Quick Start with Docker

The fastest way to get started is using Docker:

```bash
# Windows
docker-dev.bat setup

# Linux/Mac
./docker-dev.sh setup
```

After setup:

-   Frontend: http://localhost:3000
-   Backend API: http://localhost:8000
-   Email Testing: http://localhost:8025

For detailed instructions, see [QUICK-START.md](QUICK-START.md) and [README-Docker.md](README-Docker.md).

## 🛠️ Manual Installation

If you prefer manual installation without Docker:

### Backend (Laravel)

1. Install dependencies:

    ```bash
    composer install
    npm install
    ```

2. Setup environment:

    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

3. Configure database in `.env` and run:
    ```bash
    php artisan migrate
    php artisan serve
    ```

### Frontend (React)

1. Navigate to frontend directory:

    ```bash
    cd frontend
    npm install
    ```

2. Start development server:
    ```bash
    npm start
    ```

## 📁 Project Structure

```
ptsmart-crm/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── hooks/          # Custom React hooks
│   │   └── utils/          # Utility functions
│   └── package.json
├── app/                     # Laravel application
├── config/                  # Laravel configuration
├── database/                # Migrations and seeders
├── routes/                  # API and web routes
├── docker/                  # Docker configurations
├── docker-compose.*.yml     # Docker orchestration
└── README.md               # This file
```

## 🔧 Development

### With Docker (Recommended)

```bash
# Start development environment
docker-dev.bat start          # Windows
./docker-dev.sh start         # Linux/Mac

# View logs
docker-dev.bat logs backend

# Run Laravel commands
docker-dev.bat artisan migrate

# Run frontend commands
docker-dev.bat npm install
```

### Without Docker

```bash
# Backend
php artisan serve

# Frontend (in separate terminal)
cd frontend && npm start
```

## 🌐 Production Deployment

### Docker Production

```bash
# Configure production environment
cp .env.production.example .env.production
# Edit .env.production with your settings

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

### Traditional Deployment

1. Build frontend:

    ```bash
    cd frontend && npm run build
    ```

2. Deploy Laravel following standard procedures

## 🧪 Testing

```bash
# Backend tests
docker-dev.bat artisan test

# Frontend tests
docker-dev.bat npm test
```

## 📚 Documentation

-   [Quick Start Guide](QUICK-START.md) - Get running in 5 minutes
-   [Docker Documentation](README-Docker.md) - Complete Docker setup guide
-   [API Documentation](#) - Backend API reference
-   [Frontend Guide](#) - React component documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Use Docker for development
4. Make your changes
5. Run tests
6. Submit a pull request

## 📄 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
