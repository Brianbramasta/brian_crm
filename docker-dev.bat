@echo off
REM PT Smart CRM Docker Helper Script

if "%1"=="start" (
    echo Starting PT Smart CRM containers...
    docker-compose -f docker-compose.dev.yml up -d
    echo Containers started successfully!
    echo.
    echo Frontend: http://localhost:3000
    echo Backend API: http://localhost:8000
    echo Mailpit: http://localhost:8025
    goto :end
)

if "%1"=="stop" (
    echo Stopping PT Smart CRM containers...
    docker-compose -f docker-compose.dev.yml down
    echo Containers stopped successfully!
    goto :end
)

if "%1"=="restart" (
    echo Restarting PT Smart CRM containers...
    docker-compose -f docker-compose.dev.yml restart
    echo Containers restarted successfully!
    goto :end
)

if "%1"=="logs" (
    if "%2"=="" (
        docker-compose -f docker-compose.dev.yml logs -f
    ) else (
        docker-compose -f docker-compose.dev.yml logs -f %2
    )
    goto :end
)

if "%1"=="artisan" (
    if "%2"=="" (
        echo Usage: docker-dev.bat artisan [command]
        echo Example: docker-dev.bat artisan migrate
    ) else (
        docker-compose -f docker-compose.dev.yml exec backend php artisan %2 %3 %4 %5 %6
    )
    goto :end
)

if "%1"=="composer" (
    if "%2"=="" (
        echo Usage: docker-dev.bat composer [command]
        echo Example: docker-dev.bat composer install
    ) else (
        docker-compose -f docker-compose.dev.yml exec backend composer %2 %3 %4 %5 %6
    )
    goto :end
)

if "%1"=="npm" (
    if "%2"=="" (
        echo Usage: docker-dev.bat npm [command]
        echo Example: docker-dev.bat npm install
    ) else (
        docker-compose -f docker-compose.dev.yml exec frontend npm %2 %3 %4 %5 %6
    )
    goto :end
)

if "%1"=="shell" (
    if "%2"=="backend" (
        docker-compose -f docker-compose.dev.yml exec backend bash
    ) else if "%2"=="frontend" (
        docker-compose -f docker-compose.dev.yml exec frontend sh
    ) else (
        echo Usage: docker-dev.bat shell [backend|frontend]
    )
    goto :end
)

if "%1"=="ps" (
    docker-compose -f docker-compose.dev.yml ps
    goto :end
)

if "%1"=="build" (
    echo Building PT Smart CRM containers...
    docker-compose -f docker-compose.dev.yml build
    echo Build completed!
    goto :end
)

REM Default help message
echo PT Smart CRM Docker Helper
echo.
echo Available commands:
echo   start     - Start all containers
echo   stop      - Stop all containers
echo   restart   - Restart all containers
echo   build     - Build all containers
echo   ps        - Show container status
echo   logs      - Show logs (add service name for specific service)
echo   artisan   - Run Laravel artisan command
echo   composer  - Run composer command
echo   npm       - Run npm command
echo   shell     - Access container shell (backend or frontend)
echo.
echo Examples:
echo   docker-dev.bat start
echo   docker-dev.bat artisan migrate
echo   docker-dev.bat composer install
echo   docker-dev.bat npm install
echo   docker-dev.bat logs backend

:end
