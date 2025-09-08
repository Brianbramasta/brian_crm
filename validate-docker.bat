@echo off
REM PT Smart CRM Docker Setup Validation Script for Windows

echo.
echo 🐳 PT Smart CRM Docker Setup Validation
echo ========================================
echo.

:check_docker
echo Checking Docker installation...
docker --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Docker found
    docker --version
) else (
    echo ✗ Docker not found - Please install Docker Desktop
    pause
    exit /b 1
)

echo.

:check_compose
echo Checking Docker Compose...
docker-compose --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Docker Compose found
    docker-compose --version
) else (
    echo ✗ Docker Compose not found
    pause
    exit /b 1
)

echo.

:check_files
echo Checking Docker configuration files...

set files=Dockerfile Dockerfile.dev docker-compose.yml docker-compose.dev.yml .dockerignore

for %%f in (%files%) do (
    if exist "%%f" (
        echo ✓ %%f
    ) else (
        echo ✗ %%f - Missing
    )
)

echo Checking Docker configuration directories...
if exist "docker\apache\000-default.conf" (echo ✓ docker\apache\000-default.conf) else (echo ✗ docker\apache\000-default.conf)
if exist "docker\nginx\nginx.conf" (echo ✓ docker\nginx\nginx.conf) else (echo ✗ docker\nginx\nginx.conf)
if exist "docker\nginx\default.conf" (echo ✓ docker\nginx\default.conf) else (echo ✗ docker\nginx\default.conf)
if exist "docker\mysql\init.sql" (echo ✓ docker\mysql\init.sql) else (echo ✗ docker\mysql\init.sql)
if exist "docker\start.sh" (echo ✓ docker\start.sh) else (echo ✗ docker\start.sh)

echo.

:check_ports
echo Checking port availability...
echo Note: Ports marked as "In use" may cause conflicts
echo.

netstat -an | findstr ":8000 " >nul 2>&1
if %errorlevel% equ 0 (echo ⚠ Port 8000 - In use) else (echo ✓ Port 8000 - Available)

netstat -an | findstr ":3306 " >nul 2>&1
if %errorlevel% equ 0 (echo ⚠ Port 3306 - In use) else (echo ✓ Port 3306 - Available)

netstat -an | findstr ":3307 " >nul 2>&1
if %errorlevel% equ 0 (echo ⚠ Port 3307 - In use) else (echo ✓ Port 3307 - Available)

netstat -an | findstr ":6379 " >nul 2>&1
if %errorlevel% equ 0 (echo ⚠ Port 6379 - In use) else (echo ✓ Port 6379 - Available)

netstat -an | findstr ":8080 " >nul 2>&1
if %errorlevel% equ 0 (echo ⚠ Port 8080 - In use) else (echo ✓ Port 8080 - Available)

netstat -an | findstr ":8025 " >nul 2>&1
if %errorlevel% equ 0 (echo ⚠ Port 8025 - In use) else (echo ✓ Port 8025 - Available)

echo.

:build_test
set /p build_test="Run Docker build test? (y/N): "
if /i "%build_test%"=="y" (
    echo.
    echo 🔨 Testing Docker build...
    echo This may take a few minutes...
    docker build -f Dockerfile.dev -t ptsmart-crm:test . >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✓ Docker build successful
        docker rmi ptsmart-crm:test >nul 2>&1
    ) else (
        echo ✗ Docker build failed
        echo Check the error messages above
    )
)

echo.

:summary
echo 📋 Setup Summary
echo ===============
echo.
echo Docker files created:
echo   ✓ Dockerfile (production)
echo   ✓ Dockerfile.dev (development)
echo   ✓ docker-compose.yml (production stack)
echo   ✓ docker-compose.dev.yml (development stack)
echo   ✓ Management scripts (docker-crm.bat/.sh)
echo   ✓ Configuration files (Apache, Nginx, MySQL)
echo.
echo Available environments:
echo   🚀 Development: docker-crm.bat dev
echo   🏭 Production:  docker-crm.bat prod
echo.
echo Access URLs (after starting):
echo   📱 Application:  http://localhost:8000
echo   🗄️  phpMyAdmin:   http://localhost:8080 (dev only)
echo   📧 Mailpit:      http://localhost:8025
echo   🌐 Nginx:        http://localhost (production only)
echo.
echo 🎉 Docker setup validation complete!
echo.
echo Next steps:
echo 1. Start development environment: docker-crm.bat dev
echo 2. Access application at http://localhost:8000
echo 3. Check logs: docker-crm.bat logs
echo 4. For production: docker-crm.bat prod
echo.
echo For help: docker-crm.bat help
echo.
pause
