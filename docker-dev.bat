@echo off
REM PTSmart CRM Docker Development Helper Script for Windows
REM Usage: docker-dev.bat [command]

setlocal enabledelayedexpansion

REM Function to check if Docker is running
:check_docker
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not running. Please start Docker first.
    exit /b 1
)
goto :eof

REM Function to build containers
:build
echo [INFO] Building Docker containers...
docker-compose -f docker-compose.dev.yml build
if errorlevel 1 (
    echo [ERROR] Failed to build containers
    exit /b 1
)
echo [SUCCESS] Containers built successfully!
goto :eof

REM Function to start development environment
:start
echo [INFO] Starting development environment...
call :check_docker

REM Copy environment file if not exists
if not exist .env (
    echo [INFO] Copying .env.docker to .env...
    copy .env.docker .env
)

docker-compose -f docker-compose.dev.yml up -d
if errorlevel 1 (
    echo [ERROR] Failed to start containers
    exit /b 1
)
echo [SUCCESS] Development environment started!
echo [INFO] Frontend: http://localhost:3000
echo [INFO] Backend API: http://localhost:8000
echo [INFO] Mailpit: http://localhost:8025
goto :eof

REM Function to stop development environment
:stop
echo [INFO] Stopping development environment...
docker-compose -f docker-compose.dev.yml down
echo [SUCCESS] Development environment stopped!
goto :eof

REM Function to restart development environment
:restart
echo [INFO] Restarting development environment...
call :stop
call :start
goto :eof

REM Function to view logs
:logs
if "%~2"=="" (
    docker-compose -f docker-compose.dev.yml logs -f
) else (
    docker-compose -f docker-compose.dev.yml logs -f %2
)
goto :eof

REM Function to run Laravel commands
:artisan
set "cmd_args="
for /f "tokens=2*" %%a in ("%*") do set "cmd_args=%%b"
docker-compose -f docker-compose.dev.yml exec backend php artisan !cmd_args!
goto :eof

REM Function to run npm commands in frontend
:npm_frontend
set "cmd_args="
for /f "tokens=2*" %%a in ("%*") do set "cmd_args=%%b"
docker-compose -f docker-compose.dev.yml exec frontend npm !cmd_args!
goto :eof

REM Function to setup the application (first time)
:setup
echo [INFO] Setting up PTSmart CRM for the first time...

REM Build containers
call :build

REM Start services
call :start

REM Wait for database
echo [INFO] Waiting for database to be ready...
timeout /t 10 /nobreak >nul

REM Generate app key if needed
echo [INFO] Generating application key...
docker-compose -f docker-compose.dev.yml exec backend php artisan key:generate

REM Run migrations
echo [INFO] Running database migrations...
docker-compose -f docker-compose.dev.yml exec backend php artisan migrate

REM Seed database (optional)
echo [INFO] Seeding database...
docker-compose -f docker-compose.dev.yml exec backend php artisan db:seed --class=DatabaseSeeder

REM Install frontend dependencies
echo [INFO] Installing frontend dependencies...
docker-compose -f docker-compose.dev.yml exec frontend npm install

echo [SUCCESS] Setup completed!
echo [INFO] Frontend: http://localhost:3000
echo [INFO] Backend API: http://localhost:8000
echo [INFO] Mailpit: http://localhost:8025
goto :eof

REM Function to clean up Docker resources
:clean
set /p response="This will remove all containers, images, and volumes. Are you sure? (y/N): "
if /i "!response!"=="y" (
    echo [INFO] Cleaning up Docker resources...
    docker-compose -f docker-compose.dev.yml down -v --rmi all
    docker system prune -f
    echo [SUCCESS] Cleanup completed!
) else (
    echo [INFO] Cleanup cancelled.
)
goto :eof

REM Function to show help
:help
echo PTSmart CRM Docker Development Helper
echo.
echo Usage: %0 [command]
echo.
echo Commands:
echo   setup         Setup the application for the first time
echo   build         Build Docker containers
echo   start         Start development environment
echo   stop          Stop development environment
echo   restart       Restart development environment
echo   logs [service] View logs (optionally for specific service)
echo   artisan [cmd] Run Laravel artisan command
echo   npm [cmd]     Run npm command in frontend container
echo   clean         Clean up all Docker resources
echo   help          Show this help message
echo.
echo Examples:
echo   %0 setup                      # First time setup
echo   %0 start                      # Start development
echo   %0 logs backend               # View backend logs
echo   %0 artisan migrate            # Run migrations
echo   %0 npm install                # Install frontend deps
goto :eof

REM Main script logic
if "%1"=="setup" (
    call :setup
) else if "%1"=="build" (
    call :build
) else if "%1"=="start" (
    call :start
) else if "%1"=="stop" (
    call :stop
) else if "%1"=="restart" (
    call :restart
) else if "%1"=="logs" (
    call :logs %*
) else if "%1"=="artisan" (
    call :artisan %*
) else if "%1"=="npm" (
    call :npm_frontend %*
) else if "%1"=="clean" (
    call :clean
) else if "%1"=="help" (
    call :help
) else if "%1"=="--help" (
    call :help
) else if "%1"=="-h" (
    call :help
) else (
    echo [ERROR] Unknown command: %1
    call :help
    exit /b 1
)
