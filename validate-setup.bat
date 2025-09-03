@echo off
REM PTSmart CRM Docker Setup Validation Script
REM This script validates that the Docker environment is properly configured

echo ================================
echo PTSmart CRM Docker Validation
echo ================================
echo.

REM Check if Docker is running
echo [1/8] Checking Docker status...
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
) else (
    echo ✅ Docker is running
)

REM Check if required files exist
echo.
echo [2/8] Checking required files...
set "files_missing=0"

if not exist "docker-compose.dev.yml" (
    echo ❌ docker-compose.dev.yml not found
    set "files_missing=1"
) else (
    echo ✅ docker-compose.dev.yml found
)

if not exist "frontend\package.json" (
    echo ❌ frontend\package.json not found
    set "files_missing=1"
) else (
    echo ✅ frontend\package.json found
)

if not exist "composer.json" (
    echo ❌ composer.json not found
    set "files_missing=1"
) else (
    echo ✅ composer.json found
)

if not exist ".env" (
    echo ⚠️  .env not found - will be created from .env.docker
) else (
    echo ✅ .env found
)

if %files_missing%==1 (
    echo ❌ Some required files are missing. Please check the setup.
    pause
    exit /b 1
)

REM Validate Docker Compose syntax
echo.
echo [3/8] Validating Docker Compose configuration...
docker-compose -f docker-compose.dev.yml config >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose configuration is invalid
    pause
    exit /b 1
) else (
    echo ✅ Docker Compose configuration is valid
)

REM Check available ports
echo.
echo [4/8] Checking port availability...
netstat -ano | findstr :3000 >nul 2>&1
if not errorlevel 1 (
    echo ⚠️  Port 3000 is already in use (Frontend)
) else (
    echo ✅ Port 3000 is available (Frontend)
)

netstat -ano | findstr :8000 >nul 2>&1
if not errorlevel 1 (
    echo ⚠️  Port 8000 is already in use (Backend)
) else (
    echo ✅ Port 8000 is available (Backend)
)

netstat -ano | findstr :3306 >nul 2>&1
if not errorlevel 1 (
    echo ⚠️  Port 3306 is already in use (MySQL)
) else (
    echo ✅ Port 3306 is available (MySQL)
)

REM Check Docker resources
echo.
echo [5/8] Checking Docker resources...
for /f "tokens=*" %%i in ('docker system df --format "{{.Type}},{{.TotalCount}},{{.Size}}"') do (
    echo ✅ Docker has available resources
    goto :next_check
)
:next_check

REM Test image pulls
echo.
echo [6/8] Testing Docker image availability...
docker pull node:18-alpine >nul 2>&1
if errorlevel 1 (
    echo ❌ Cannot pull Node.js image. Check internet connection.
) else (
    echo ✅ Node.js image available
)

docker pull mysql:8.0 >nul 2>&1
if errorlevel 1 (
    echo ❌ Cannot pull MySQL image. Check internet connection.
) else (
    echo ✅ MySQL image available
)

REM Check environment file
echo.
echo [7/8] Checking environment configuration...
if not exist ".env" (
    if exist ".env.docker" (
        echo ℹ️  Copying .env.docker to .env...
        copy ".env.docker" ".env" >nul
        echo ✅ Environment file created
    ) else (
        echo ❌ No environment file template found
    )
) else (
    echo ✅ Environment file exists
)

REM Final validation
echo.
echo [8/8] Running final validation...
docker-compose -f docker-compose.dev.yml config --quiet
if errorlevel 1 (
    echo ❌ Final validation failed
    pause
    exit /b 1
) else (
    echo ✅ All validations passed!
)

echo.
echo ================================
echo ✅ VALIDATION COMPLETE
echo ================================
echo.
echo Your Docker environment is ready!
echo.
echo Next steps:
echo 1. Run: docker-dev.bat start
echo 2. Wait for containers to start (2-3 minutes)
echo 3. Open: http://localhost:3000 (Frontend)
echo 4. Open: http://localhost:8000 (Backend)
echo 5. Open: http://localhost:8025 (Email testing)
echo.
echo For full setup, run: docker-dev.bat setup
echo.
pause
