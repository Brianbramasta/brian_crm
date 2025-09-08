@echo off
REM PT Smart CRM Docker Management Script for Windows

SET COMPOSE_FILE=docker-compose.yml
SET DEV_COMPOSE_FILE=docker-compose.dev.yml

if "%1"=="" goto help

if "%1"=="start" goto start
if "%1"=="stop" goto stop
if "%1"=="restart" goto restart
if "%1"=="build" goto build
if "%1"=="logs" goto logs
if "%1"=="shell" goto shell
if "%1"=="artisan" goto artisan
if "%1"=="migrate" goto migrate
if "%1"=="seed" goto seed
if "%1"=="fresh" goto fresh
if "%1"=="dev" goto dev
if "%1"=="prod" goto prod
if "%1"=="status" goto status
if "%1"=="clean" goto clean
goto help

:start
echo Starting PT Smart CRM containers...
docker-compose -f %COMPOSE_FILE% up -d
goto end

:stop
echo Stopping PT Smart CRM containers...
docker-compose -f %COMPOSE_FILE% down
goto end

:restart
echo Restarting PT Smart CRM containers...
docker-compose -f %COMPOSE_FILE% restart
goto end

:build
echo Building PT Smart CRM containers...
docker-compose -f %COMPOSE_FILE% build --no-cache
goto end

:logs
if "%2"=="" (
    docker-compose -f %COMPOSE_FILE% logs -f
) else (
    docker-compose -f %COMPOSE_FILE% logs -f %2
)
goto end

:shell
if "%2"=="" (
    docker-compose -f %COMPOSE_FILE% exec app bash
) else (
    docker-compose -f %COMPOSE_FILE% exec %2 bash
)
goto end

:artisan
if "%2"=="" (
    echo Please specify an Artisan command
    echo Example: docker-crm.bat artisan migrate
) else (
    docker-compose -f %COMPOSE_FILE% exec app php artisan %2 %3 %4 %5 %6
)
goto end

:migrate
echo Running database migrations...
docker-compose -f %COMPOSE_FILE% exec app php artisan migrate --force
goto end

:seed
echo Seeding database...
docker-compose -f %COMPOSE_FILE% exec app php artisan db:seed --force
goto end

:fresh
echo Refreshing database with fresh migrations and seeds...
docker-compose -f %COMPOSE_FILE% exec app php artisan migrate:fresh --seed --force
goto end

:dev
echo Starting development environment...
docker-compose -f %DEV_COMPOSE_FILE% up -d
echo Development environment started!
echo - Application: http://localhost:8000
echo - phpMyAdmin: http://localhost:8080
echo - Mailpit: http://localhost:8025
goto end

:prod
echo Starting production environment...
docker-compose -f %COMPOSE_FILE% up -d
echo Production environment started!
echo - Application: http://localhost:8000
echo - Application (via Nginx): http://localhost
goto end

:status
echo Checking container status...
docker-compose -f %COMPOSE_FILE% ps
goto end

:clean
echo Cleaning up Docker containers and volumes...
docker-compose -f %COMPOSE_FILE% down -v
docker-compose -f %DEV_COMPOSE_FILE% down -v
docker system prune -f
echo Cleanup complete!
goto end

:help
echo PT Smart CRM Docker Management Script
echo.
echo Usage: docker-crm.bat [command] [options]
echo.
echo Commands:
echo   start          Start production containers
echo   stop           Stop containers
echo   restart        Restart containers
echo   build          Build containers from scratch
echo   logs [service] View logs (optionally for specific service)
echo   shell [service] Access container shell (default: app)
echo   artisan [cmd]  Run Laravel Artisan commands
echo   migrate        Run database migrations
echo   seed           Seed the database
echo   fresh          Fresh migrate and seed
echo   dev            Start development environment
echo   prod           Start production environment
echo   status         Check container status
echo   clean          Clean up containers and volumes
echo   help           Show this help message
echo.
echo Examples:
echo   docker-crm.bat dev
echo   docker-crm.bat artisan make:model Product
echo   docker-crm.bat logs app
echo   docker-crm.bat shell db
echo.

:end
