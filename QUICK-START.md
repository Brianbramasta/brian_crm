# 🚀 PTSmart CRM - Quick Start Guide

Welcome to PTSmart CRM! This guide will get you up and running with the React frontend and Laravel backend in Docker containers in less than 5 minutes.

## Prerequisites ✅

-   Docker Desktop installed and running
-   Git (for cloning the repository)
-   At least 4GB RAM available for Docker

## Quick Setup (Windows) ⚡

1. **Open Command Prompt or PowerShell as Administrator**

2. **Navigate to your project directory:**

    ```cmd
    cd "C:\Users\Brian\Desktop\all progress code\Brian project\test\D-net_test\ptsmart-crm"
    ```

3. **Run the setup command:**

    ```cmd
    docker-dev.bat setup
    ```

4. **Wait for the setup to complete** (approximately 3-5 minutes)

5. **Access your applications:**
    - 🌐 **Frontend (React):** http://localhost:3000
    - 🔧 **Backend API:** http://localhost:8000
    - 📧 **Email Testing:** http://localhost:8025

## Alternative Manual Setup 🛠️

If the automated script doesn't work, follow these manual steps:

### Step 1: Start the Development Environment

```cmd
docker-compose -f docker-compose.dev.yml up -d
```

### Step 2: Wait for Services to Start

```cmd
# Check if all containers are running
docker-compose -f docker-compose.dev.yml ps
```

### Step 3: Run Database Migrations

```cmd
docker-compose -f docker-compose.dev.yml exec backend php artisan migrate
```

### Step 4: Generate Application Key

```cmd
docker-compose -f docker-compose.dev.yml exec backend php artisan key:generate
```

## Verify Everything is Working 🧪

### 1. Check Frontend

-   Open http://localhost:3000
-   You should see the PTSmart CRM login page

### 2. Check Backend API

-   Open http://localhost:8000
-   You should see a Laravel welcome page

### 3. Check Database Connection

```cmd
docker-compose -f docker-compose.dev.yml exec backend php artisan migrate:status
```

## Common Commands 📋

### View Logs

```cmd
# All services
docker-compose -f docker-compose.dev.yml logs

# Specific service
docker-compose -f docker-compose.dev.yml logs backend
docker-compose -f docker-compose.dev.yml logs frontend
```

### Stop Everything

```cmd
docker-compose -f docker-compose.dev.yml down
```

### Restart Everything

```cmd
docker-compose -f docker-compose.dev.yml restart
```

### Run Laravel Commands

```cmd
# Run migrations
docker-compose -f docker-compose.dev.yml exec backend php artisan migrate

# Create a controller
docker-compose -f docker-compose.dev.yml exec backend php artisan make:controller CustomerController

# Clear cache
docker-compose -f docker-compose.dev.yml exec backend php artisan cache:clear
```

### Run Frontend Commands

```cmd
# Install new npm packages
docker-compose -f docker-compose.dev.yml exec frontend npm install package-name

# Build for production
docker-compose -f docker-compose.dev.yml exec frontend npm run build
```

## Project Structure Overview 📁

```
ptsmart-crm/
├── frontend/              # React application (Port 3000)
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── pages/        # Page components
│   │   └── services/     # API services
│   └── package.json
├── app/                  # Laravel backend (Port 8000)
├── database/            # Migrations & seeders
├── docker-compose.dev.yml  # Development config
└── docker-dev.bat       # Helper script
```

## Default Credentials 🔑

### Database

-   **Host:** localhost:3306
-   **Database:** ptsmart_crm
-   **Username:** root
-   **Password:** secret

### Email Testing (Mailpit)

-   **Web Interface:** http://localhost:8025
-   **SMTP Port:** 1025

## Troubleshooting 🔧

### Port Already in Use

If you get port conflicts, check what's using the ports:

```cmd
netstat -ano | findstr :3000
netstat -ano | findstr :8000
```

### Docker Not Starting

1. Make sure Docker Desktop is running
2. Check Docker system status:
    ```cmd
    docker info
    ```

### Permission Issues

Run command prompt as Administrator and try again.

### Build Failures

Clean everything and rebuild:

```cmd
docker-compose -f docker-compose.dev.yml down -v
docker system prune -f
docker-dev.bat setup
```

## Next Steps 🎯

1. **Explore the Frontend:** Navigate through the CRM interface
2. **Check the API:** Visit http://localhost:8000/api to see available endpoints
3. **Customize:** Start modifying components in `frontend/src/`
4. **Add Features:** Create new Laravel controllers and React components

## Need Help? 🆘

-   Check the logs: `docker-compose -f docker-compose.dev.yml logs`
-   Review the full documentation: `README-Docker.md`
-   Check Docker status: `docker ps`

## Production Deployment 🌍

When ready for production, use:

```cmd
docker-compose -f docker-compose.prod.yml up -d
```

---

**🎉 Congratulations! Your PTSmart CRM is now running with Docker!**

Happy coding! 🚀
