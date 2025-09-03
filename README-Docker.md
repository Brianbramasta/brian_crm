# PTSmart CRM - Docker Setup Guide

A comprehensive Customer Relationship Management system built with Laravel backend and React frontend, fully containerized with Docker.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Nginx (Reverse Proxy)                │
│                      Port 80/443 (SSL)                     │
└─────────────────────┬───────────────────────────────────────┘
                      │
         ┌────────────┴────────────┐
         │                         │
┌────────▼─────────┐       ┌───────▼──────────┐
│   React Frontend │       │  Laravel Backend │
│     Port 3000    │       │     Port 8000    │
│   (Development)  │       │                  │
└──────────────────┘       └───────┬──────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
            ┌───────▼──────┐  ┌────▼─────┐  ┌────▼─────┐
            │    MySQL     │  │  Redis   │  │ Mailpit  │
            │   Port 3306  │  │Port 6379 │  │Port 8025 │
            │              │  │          │  │   (Dev)  │
            └──────────────┘  └──────────┘  └──────────┘
```

## 🚀 Quick Start

### Prerequisites

-   Docker Desktop 4.0+
-   Docker Compose 2.0+
-   Git

### Development Setup

1. **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd ptsmart-crm
    ```

2. **Run the setup script:**

    **For Windows:**

    ```cmd
    docker-dev.bat setup
    ```

    **For Linux/Mac:**

    ```bash
    chmod +x docker-dev.sh
    ./docker-dev.sh setup
    ```

3. **Access the application:**
    - Frontend: http://localhost:3000
    - Backend API: http://localhost:8000
    - Mailpit (Email testing): http://localhost:8025

## 🐳 Docker Services

### Core Services

| Service  | Port   | Description                       |
| -------- | ------ | --------------------------------- |
| frontend | 3000   | React application with hot reload |
| backend  | 8000   | Laravel API with PHP 8.1          |
| db       | 3306   | MySQL 8.0 database                |
| redis    | 6379   | Redis for caching and sessions    |
| nginx    | 80/443 | Reverse proxy (production)        |
| mailpit  | 8025   | Email testing (development)       |

### Network Configuration

#### Development Network

-   **Name:** `ptsmart-dev-network`
-   **Driver:** bridge
-   **Subnet:** Auto-assigned by Docker

#### Production Network

-   **Name:** `ptsmart-prod-network`
-   **Driver:** bridge
-   **Subnet:** 172.20.0.0/16

## 📁 Directory Structure

```
ptsmart-crm/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   └── styles/         # CSS files
│   ├── public/             # Static assets
│   ├── Dockerfile          # Production build
│   ├── Dockerfile.dev      # Development build
│   └── nginx.conf          # Nginx config for frontend
├── docker/                 # Docker configurations
│   ├── nginx/              # Nginx configurations
│   └── mysql/              # MySQL initialization
├── app/                    # Laravel application
├── config/                 # Laravel configuration
├── database/               # Migrations and seeders
├── routes/                 # API and web routes
├── Dockerfile              # Laravel production build
├── Dockerfile.dev          # Laravel development build
├── docker-compose.yml      # Production configuration
├── docker-compose.dev.yml  # Development configuration
├── docker-compose.prod.yml # Production with SSL
├── docker-dev.sh           # Linux/Mac helper script
├── docker-dev.bat          # Windows helper script
└── .env.docker            # Docker environment template
```

## 🛠️ Development Commands

### Using Helper Scripts

**Windows (`docker-dev.bat`):**

```cmd
# First time setup
docker-dev.bat setup

# Start development environment
docker-dev.bat start

# Stop all services
docker-dev.bat stop

# Restart services
docker-dev.bat restart

# View logs
docker-dev.bat logs
docker-dev.bat logs backend

# Run Laravel commands
docker-dev.bat artisan migrate
docker-dev.bat artisan make:controller UserController

# Run npm commands
docker-dev.bat npm install
docker-dev.bat npm run build

# Clean up everything
docker-dev.bat clean
```

**Linux/Mac (`docker-dev.sh`):**

```bash
# Make script executable
chmod +x docker-dev.sh

# First time setup
./docker-dev.sh setup

# Start development environment
./docker-dev.sh start

# Stop all services
./docker-dev.sh stop

# View logs
./docker-dev.sh logs backend

# Run Laravel commands
./docker-dev.sh artisan migrate

# Clean up
./docker-dev.sh clean
```

### Direct Docker Commands

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# Stop services
docker-compose -f docker-compose.dev.yml down

# View logs
docker-compose -f docker-compose.dev.yml logs -f backend

# Execute commands in containers
docker-compose -f docker-compose.dev.yml exec backend php artisan migrate
docker-compose -f docker-compose.dev.yml exec frontend npm install
```

## 🌐 Environment Variables

### Development (.env.docker)

```env
# Database
DB_HOST=db
DB_PORT=3306
DB_DATABASE=ptsmart_crm
DB_USERNAME=root
DB_PASSWORD=secret

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# Mail (Mailpit)
MAIL_HOST=mailpit
MAIL_PORT=1025
```

### Production (.env.production.example)

```env
# Database (use secure credentials)
DB_HOST=db
DB_USERNAME=your_secure_user
DB_PASSWORD=your_secure_password

# Redis (with password)
REDIS_HOST=redis
REDIS_PASSWORD=your_redis_password

# SSL
SSL_EMAIL=admin@your-domain.com
DOMAIN_NAME=your-domain.com

# External services
MAIL_HOST=your-smtp-host
```

## 🚢 Production Deployment

### 1. Prepare Environment

```bash
# Copy and configure production environment
cp .env.production.example .env.production

# Edit with your production values
nano .env.production
```

### 2. Deploy with SSL

```bash
# Start production services
docker-compose -f docker-compose.prod.yml up -d

# Generate SSL certificates (first time)
docker-compose -f docker-compose.prod.yml run --rm certbot
```

### 3. Production Services

-   **Frontend:** Served by Nginx with asset caching
-   **Backend:** PHP-FPM with opcache enabled
-   **Database:** MySQL with persistent storage
-   **Cache:** Redis with password protection
-   **Queue Worker:** Handles background jobs
-   **Scheduler:** Runs Laravel scheduled tasks
-   **SSL:** Let's Encrypt certificates

## 🔧 Troubleshooting

### Common Issues

1. **Port conflicts:**

    ```bash
    # Check what's using the port
    netstat -ano | findstr :3000  # Windows
    lsof -i :3000                 # Linux/Mac
    ```

2. **Permission issues (Linux/Mac):**

    ```bash
    sudo chown -R $USER:$USER storage bootstrap/cache
    chmod -R 775 storage bootstrap/cache
    ```

3. **Database connection issues:**

    ```bash
    # Check if database is ready
    docker-compose -f docker-compose.dev.yml exec db mysql -u root -p
    ```

4. **Frontend build issues:**
    ```bash
    # Rebuild frontend container
    docker-compose -f docker-compose.dev.yml build frontend --no-cache
    ```

### Logs and Debugging

```bash
# View all service logs
docker-compose -f docker-compose.dev.yml logs

# View specific service logs
docker-compose -f docker-compose.dev.yml logs backend
docker-compose -f docker-compose.dev.yml logs frontend
docker-compose -f docker-compose.dev.yml logs db

# Follow logs in real-time
docker-compose -f docker-compose.dev.yml logs -f backend
```

## 🔒 Security Considerations

### Development

-   Default passwords are used (change for production)
-   Debug mode is enabled
-   CORS is permissive

### Production

-   Strong passwords required
-   Debug mode disabled
-   SSL/TLS encryption
-   Rate limiting enabled
-   Security headers configured
-   Regular security updates

## 📊 Monitoring

### Health Checks

-   **Application:** http://localhost/health
-   **Database:** Built-in Docker health checks
-   **Redis:** Connection monitoring

### Performance Monitoring

-   **Nginx:** Access and error logs
-   **Laravel:** Application logs with error tracking
-   **MySQL:** Slow query logging
-   **Redis:** Memory usage monitoring

## 🔄 Backup and Recovery

### Database Backup

```bash
# Create backup
docker-compose -f docker-compose.prod.yml exec db mysqldump -u root -p ptsmart_crm > backup.sql

# Restore backup
docker-compose -f docker-compose.prod.yml exec -T db mysql -u root -p ptsmart_crm < backup.sql
```

### Volume Backup

```bash
# Backup persistent data
docker run --rm -v ptsmart-crm_mysql_prod_data:/data -v $(pwd):/backup ubuntu tar czf /backup/mysql-backup.tar.gz -C /data .
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Use the development Docker environment
4. Make your changes
5. Run tests: `./docker-dev.sh artisan test`
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For issues and questions:

-   Check the troubleshooting section
-   Review Docker logs
-   Create an issue on GitHub
