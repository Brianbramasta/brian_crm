#!/bin/bash

# PT Smart CRM Docker Management Script for Linux/Mac

COMPOSE_FILE="docker-compose.yml"
DEV_COMPOSE_FILE="docker-compose.dev.yml"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Help function
show_help() {
    echo -e "${BLUE}PT Smart CRM Docker Management Script${NC}"
    echo ""
    echo "Usage: ./docker-crm.sh [command] [options]"
    echo ""
    echo "Commands:"
    echo "  start          Start production containers"
    echo "  stop           Stop containers"
    echo "  restart        Restart containers"
    echo "  build          Build containers from scratch"
    echo "  logs [service] View logs (optionally for specific service)"
    echo "  shell [service] Access container shell (default: app)"
    echo "  artisan [cmd]  Run Laravel Artisan commands"
    echo "  migrate        Run database migrations"
    echo "  seed           Seed the database"
    echo "  fresh          Fresh migrate and seed"
    echo "  dev            Start development environment"
    echo "  prod           Start production environment"
    echo "  status         Check container status"
    echo "  clean          Clean up containers and volumes"
    echo "  help           Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./docker-crm.sh dev"
    echo "  ./docker-crm.sh artisan make:model Product"
    echo "  ./docker-crm.sh logs app"
    echo "  ./docker-crm.sh shell db"
    echo ""
}

# Main script logic
case $1 in
    start)
        print_status "Starting PT Smart CRM containers..."
        docker-compose -f $COMPOSE_FILE up -d
        ;;
    stop)
        print_status "Stopping PT Smart CRM containers..."
        docker-compose -f $COMPOSE_FILE down
        ;;
    restart)
        print_status "Restarting PT Smart CRM containers..."
        docker-compose -f $COMPOSE_FILE restart
        ;;
    build)
        print_status "Building PT Smart CRM containers..."
        docker-compose -f $COMPOSE_FILE build --no-cache
        ;;
    logs)
        if [ -z "$2" ]; then
            docker-compose -f $COMPOSE_FILE logs -f
        else
            docker-compose -f $COMPOSE_FILE logs -f $2
        fi
        ;;
    shell)
        if [ -z "$2" ]; then
            docker-compose -f $COMPOSE_FILE exec app bash
        else
            docker-compose -f $COMPOSE_FILE exec $2 bash
        fi
        ;;
    artisan)
        if [ -z "$2" ]; then
            print_error "Please specify an Artisan command"
            echo "Example: ./docker-crm.sh artisan migrate"
        else
            shift
            docker-compose -f $COMPOSE_FILE exec app php artisan "$@"
        fi
        ;;
    migrate)
        print_status "Running database migrations..."
        docker-compose -f $COMPOSE_FILE exec app php artisan migrate --force
        ;;
    seed)
        print_status "Seeding database..."
        docker-compose -f $COMPOSE_FILE exec app php artisan db:seed --force
        ;;
    fresh)
        print_status "Refreshing database with fresh migrations and seeds..."
        docker-compose -f $COMPOSE_FILE exec app php artisan migrate:fresh --seed --force
        ;;
    dev)
        print_status "Starting development environment..."
        docker-compose -f $DEV_COMPOSE_FILE up -d
        print_status "Development environment started!"
        echo "- Application: http://localhost:8000"
        echo "- phpMyAdmin: http://localhost:8080"
        echo "- Mailpit: http://localhost:8025"
        ;;
    prod)
        print_status "Starting production environment..."
        docker-compose -f $COMPOSE_FILE up -d
        print_status "Production environment started!"
        echo "- Application: http://localhost:8000"
        echo "- Application (via Nginx): http://localhost"
        ;;
    status)
        print_status "Checking container status..."
        docker-compose -f $COMPOSE_FILE ps
        ;;
    clean)
        print_warning "Cleaning up Docker containers and volumes..."
        docker-compose -f $COMPOSE_FILE down -v
        docker-compose -f $DEV_COMPOSE_FILE down -v
        docker system prune -f
        print_status "Cleanup complete!"
        ;;
    help|"")
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
