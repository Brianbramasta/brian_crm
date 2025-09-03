#!/bin/bash

# PTSmart CRM Docker Development Helper Script
# Usage: ./docker-dev.sh [command]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info >/dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi
}

# Function to build containers
build() {
    print_status "Building Docker containers..."
    docker-compose -f docker-compose.dev.yml build
    print_success "Containers built successfully!"
}

# Function to start development environment
start() {
    print_status "Starting development environment..."
    check_docker

    # Copy environment file if not exists
    if [ ! -f .env ]; then
        print_status "Copying .env.docker to .env..."
        cp .env.docker .env
    fi

    docker-compose -f docker-compose.dev.yml up -d
    print_success "Development environment started!"
    print_status "Frontend: http://localhost:3000"
    print_status "Backend API: http://localhost:8000"
    print_status "Mailpit: http://localhost:8025"
}

# Function to stop development environment
stop() {
    print_status "Stopping development environment..."
    docker-compose -f docker-compose.dev.yml down
    print_success "Development environment stopped!"
}

# Function to restart development environment
restart() {
    print_status "Restarting development environment..."
    stop
    start
}

# Function to view logs
logs() {
    if [ -n "$2" ]; then
        docker-compose -f docker-compose.dev.yml logs -f "$2"
    else
        docker-compose -f docker-compose.dev.yml logs -f
    fi
}

# Function to run Laravel commands
artisan() {
    docker-compose -f docker-compose.dev.yml exec backend php artisan "${@:2}"
}

# Function to run npm commands in frontend
npm_frontend() {
    docker-compose -f docker-compose.dev.yml exec frontend npm "${@:2}"
}

# Function to setup the application (first time)
setup() {
    print_status "Setting up PTSmart CRM for the first time..."

    # Build containers
    build

    # Start services
    start

    # Wait for database
    print_status "Waiting for database to be ready..."
    sleep 10

    # Generate app key if needed
    print_status "Generating application key..."
    artisan key:generate

    # Run migrations
    print_status "Running database migrations..."
    artisan migrate

    # Seed database (optional)
    print_status "Seeding database..."
    artisan db:seed --class=DatabaseSeeder

    # Install frontend dependencies
    print_status "Installing frontend dependencies..."
    npm_frontend install

    print_success "Setup completed!"
    print_status "Frontend: http://localhost:3000"
    print_status "Backend API: http://localhost:8000"
    print_status "Mailpit: http://localhost:8025"
}

# Function to clean up Docker resources
clean() {
    print_warning "This will remove all containers, images, and volumes. Are you sure? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_status "Cleaning up Docker resources..."
        docker-compose -f docker-compose.dev.yml down -v --rmi all
        docker system prune -f
        print_success "Cleanup completed!"
    else
        print_status "Cleanup cancelled."
    fi
}

# Function to show help
help() {
    echo "PTSmart CRM Docker Development Helper"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  setup         Setup the application for the first time"
    echo "  build         Build Docker containers"
    echo "  start         Start development environment"
    echo "  stop          Stop development environment"
    echo "  restart       Restart development environment"
    echo "  logs [service] View logs (optionally for specific service)"
    echo "  artisan [cmd] Run Laravel artisan command"
    echo "  npm [cmd]     Run npm command in frontend container"
    echo "  clean         Clean up all Docker resources"
    echo "  help          Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 setup                      # First time setup"
    echo "  $0 start                      # Start development"
    echo "  $0 logs backend               # View backend logs"
    echo "  $0 artisan migrate            # Run migrations"
    echo "  $0 npm install                # Install frontend deps"
}

# Main script logic
case "$1" in
    setup)
        setup
        ;;
    build)
        build
        ;;
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    logs)
        logs "$@"
        ;;
    artisan)
        artisan "$@"
        ;;
    npm)
        npm_frontend "$@"
        ;;
    clean)
        clean
        ;;
    help|--help|-h)
        help
        ;;
    *)
        print_error "Unknown command: $1"
        help
        exit 1
        ;;
esac
