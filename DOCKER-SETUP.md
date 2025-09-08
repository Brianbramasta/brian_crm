# 🐳 Docker Setup untuk PT Smart CRM

Dokumentasi lengkap untuk containerisasi aplikasi PT Smart CRM menggunakan Docker dan Docker Compose.

## 📋 Prasyarat

-   Docker 20.10+ terinstall
-   Docker Compose 2.0+ terinstall
-   Minimal 4GB RAM free
-   Minimal 10GB disk space

## 🏗️ Arsitektur Container

### Production Stack

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Nginx Proxy   │    │  Laravel App    │    │  MySQL Database │
│   Port: 80/443  │────│   Port: 8000    │────│   Port: 3306    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                       ┌─────────────────┐    ┌─────────────────┐
                       │  Redis Cache    │    │   Mailpit       │
                       │   Port: 6379    │    │   Port: 8025    │
                       └─────────────────┘    └─────────────────┘
```

### Development Stack

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Laravel App    │    │  MySQL Database │    │   phpMyAdmin    │
│   Port: 8000    │────│   Port: 3307    │────│   Port: 8080    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                       ┌─────────────────┐
                       │   Mailpit       │
                       │   Port: 8025    │
                       └─────────────────┘
```

## 🚀 Quick Start

### 1. Development Environment

```bash
# Windows
docker-crm.bat dev

# Linux/Mac
chmod +x docker-crm.sh
./docker-crm.sh dev
```

### 2. Production Environment

```bash
# Windows
docker-crm.bat prod

# Linux/Mac
./docker-crm.sh prod
```

## 📝 Detail Konfigurasi

### Production (docker-compose.yml)

**Services:**

-   **app**: Laravel application dengan PHP 8.2 dan Apache
-   **db**: MySQL 8.0 database
-   **redis**: Redis untuk caching dan sessions
-   **nginx**: Reverse proxy dan load balancer
-   **mailpit**: Email testing service

**Ports:**

-   `80` - Nginx (public access)
-   `8000` - Laravel app (direct access)
-   `3306` - MySQL database
-   `6379` - Redis
-   `8025` - Mailpit web interface

### Development (docker-compose.dev.yml)

**Services:**

-   **app**: Laravel dengan development optimizations
-   **db**: MySQL untuk development
-   **phpmyadmin**: Database management interface
-   **mailpit**: Email testing

**Ports:**

-   `8000` - Laravel app
-   `3307` - MySQL (berbeda dari production)
-   `8080` - phpMyAdmin
-   `8025` - Mailpit

## 🛠️ Management Commands

### Container Management

```bash
# Start containers
docker-crm.bat start      # Windows
./docker-crm.sh start     # Linux/Mac

# Stop containers
docker-crm.bat stop

# Restart containers
docker-crm.bat restart

# View container status
docker-crm.bat status

# View logs
docker-crm.bat logs       # All services
docker-crm.bat logs app   # Specific service
```

### Laravel Commands

```bash
# Run Artisan commands
docker-crm.bat artisan migrate
docker-crm.bat artisan make:model Product
docker-crm.bat artisan queue:work

# Database operations
docker-crm.bat migrate    # Run migrations
docker-crm.bat seed       # Seed database
docker-crm.bat fresh      # Fresh migrate and seed
```

### Container Access

```bash
# Access app container shell
docker-crm.bat shell

# Access database container
docker-crm.bat shell db

# Access specific container
docker-crm.bat shell redis
```

## 🔧 Environment Variables

### Production Environment (.env)

```env
APP_NAME="PT Smart CRM"
APP_ENV=production
APP_DEBUG=false
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=ptsmart_crm
DB_USERNAME=ptsmart_user
DB_PASSWORD=ptsmart_password

CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379
```

### Development Environment

```env
APP_ENV=local
APP_DEBUG=true
CACHE_DRIVER=file
SESSION_DRIVER=file
QUEUE_CONNECTION=sync
```

## 📂 File Structure

```
ptsmart-crm/
├── docker/
│   ├── apache/
│   │   └── 000-default.conf    # Apache virtual host
│   ├── nginx/
│   │   ├── nginx.conf          # Nginx main config
│   │   └── default.conf        # Site configuration
│   ├── mysql/
│   │   └── init.sql           # Database initialization
│   └── start.sh               # Container startup script
├── Dockerfile                 # Production container
├── Dockerfile.dev            # Development container
├── docker-compose.yml        # Production stack
├── docker-compose.dev.yml    # Development stack
├── docker-crm.bat           # Windows management script
├── docker-crm.sh            # Linux/Mac management script
└── .dockerignore            # Docker ignore file
```

## 🔒 Security Features

### Production Security

-   Non-root user dalam container
-   Security headers di Nginx
-   File permissions yang tepat
-   Environment isolation
-   Network isolation antar services

### Database Security

-   User dengan privileges terbatas
-   Password yang aman
-   Network access terbatas
-   Data persistence dengan volumes

## 📈 Performance Optimizations

### Application

-   PHP OPcache enabled
-   Composer autoloader optimization
-   Laravel config caching
-   Gzip compression di Nginx

### Database

-   MySQL 8.0 dengan optimizations
-   Persistent volumes untuk data
-   Connection pooling

### Caching

-   Redis untuk sessions dan cache
-   Static file caching di Nginx
-   Browser caching headers

## 🐛 Troubleshooting

### Common Issues

**1. Port sudah digunakan**

```bash
# Cek port yang digunakan
netstat -an | findstr :8000

# Ganti port di docker-compose.yml
ports:
  - "8001:80"  # Ganti 8000 ke 8001
```

**2. Database connection failed**

```bash
# Cek status database
docker-crm.bat logs db

# Reset database
docker-crm.bat clean
docker-crm.bat dev
```

**3. Permission denied**

```bash
# Fix file permissions
docker-crm.bat shell
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache
```

### Debugging

**View container logs:**

```bash
docker-crm.bat logs app
docker-crm.bat logs db
docker-crm.bat logs nginx
```

**Access container shell:**

```bash
docker-crm.bat shell app
docker-crm.bat shell db
```

**Check container status:**

```bash
docker-crm.bat status
docker ps -a
```

## 🚀 Deployment

### Development to Production

1. Test di development environment
2. Update environment variables
3. Build production containers
4. Deploy dengan production compose file

### CI/CD Integration

```yaml
# Contoh untuk GitHub Actions
- name: Build Docker image
  run: docker build -t ptsmart-crm .

- name: Run tests
  run: docker-crm.sh artisan test

- name: Deploy
  run: docker-crm.sh prod
```

## 📊 Monitoring

### Health Checks

-   Application health endpoint
-   Database connectivity check
-   Redis connectivity check

### Logs

-   Application logs: `storage/logs/`
-   Nginx logs: `/var/log/nginx/`
-   Apache logs: `/var/log/apache2/`

### Metrics

-   Container resource usage
-   Database performance
-   Response times

## 🔄 Backup dan Recovery

### Database Backup

```bash
# Manual backup
docker-compose exec db mysqldump -u ptsmart_user -p ptsmart_crm > backup.sql

# Automated backup (cron job)
0 2 * * * /path/to/backup-script.sh
```

### Volume Backup

```bash
# Backup volumes
docker run --rm -v ptsmart-crm_db_data:/data -v $(pwd):/backup ubuntu tar czf /backup/db_backup.tar.gz /data
```

## 🆘 Support

Untuk bantuan lebih lanjut:

1. Cek logs container dengan `docker-crm.bat logs`
2. Verifikasi konfigurasi environment variables
3. Pastikan semua ports tidak konflik
4. Cek dokumentasi Laravel dan Docker official

---

**🎉 Selamat! Aplikasi PT Smart CRM siap berjalan dalam container Docker!**
