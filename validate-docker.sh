#!/bin/bash

# PT Smart CRM Docker Setup Validation Script

echo "🐳 PT Smart CRM Docker Setup Validation"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Validation functions
check_docker() {
    echo -n "Checking Docker installation... "
    if command -v docker &> /dev/null; then
        echo -e "${GREEN}✓ Found$(NC)"
        docker --version
    else
        echo -e "${RED}✗ Docker not found${NC}"
        return 1
    fi
}

check_compose() {
    echo -n "Checking Docker Compose... "
    if command -v docker-compose &> /dev/null; then
        echo -e "${GREEN}✓ Found${NC}"
        docker-compose --version
    else
        echo -e "${RED}✗ Docker Compose not found${NC}"
        return 1
    fi
}

check_files() {
    echo "Checking Docker configuration files..."

    files=(
        "Dockerfile"
        "Dockerfile.dev"
        "docker-compose.yml"
        "docker-compose.dev.yml"
        ".dockerignore"
        "docker/apache/000-default.conf"
        "docker/nginx/nginx.conf"
        "docker/nginx/default.conf"
        "docker/mysql/init.sql"
        "docker/start.sh"
    )

    for file in "${files[@]}"; do
        echo -n "  $file... "
        if [ -f "$file" ]; then
            echo -e "${GREEN}✓${NC}"
        else
            echo -e "${RED}✗ Missing${NC}"
        fi
    done
}

check_ports() {
    echo "Checking port availability..."

    ports=(8000 3306 3307 6379 8080 8025)

    for port in "${ports[@]}"; do
        echo -n "  Port $port... "
        if lsof -i :$port &> /dev/null || netstat -an | grep -q ":$port "; then
            echo -e "${YELLOW}⚠ In use${NC}"
        else
            echo -e "${GREEN}✓ Available${NC}"
        fi
    done
}

test_build() {
    echo ""
    echo "🔨 Testing Docker build..."
    echo "This may take a few minutes..."

    if docker build -f Dockerfile.dev -t ptsmart-crm:test . &> /dev/null; then
        echo -e "${GREEN}✓ Docker build successful${NC}"
        docker rmi ptsmart-crm:test &> /dev/null
        return 0
    else
        echo -e "${RED}✗ Docker build failed${NC}"
        return 1
    fi
}

show_summary() {
    echo ""
    echo "📋 Setup Summary"
    echo "==============="
    echo ""
    echo "Docker files created:"
    echo "  ✓ Dockerfile (production)"
    echo "  ✓ Dockerfile.dev (development)"
    echo "  ✓ docker-compose.yml (production stack)"
    echo "  ✓ docker-compose.dev.yml (development stack)"
    echo "  ✓ Management scripts (docker-crm.bat/.sh)"
    echo "  ✓ Configuration files (Apache, Nginx, MySQL)"
    echo ""
    echo "Available environments:"
    echo "  🚀 Development: docker-crm.sh dev"
    echo "  🏭 Production:  docker-crm.sh prod"
    echo ""
    echo "Access URLs (after starting):"
    echo "  📱 Application:  http://localhost:8000"
    echo "  🗄️  phpMyAdmin:   http://localhost:8080 (dev only)"
    echo "  📧 Mailpit:      http://localhost:8025"
    echo "  🌐 Nginx:        http://localhost (production only)"
    echo ""
}

# Main validation
echo "Running validation checks..."
echo ""

# Check prerequisites
check_docker || exit 1
echo ""
check_compose || exit 1
echo ""

# Check files
check_files
echo ""

# Check ports
check_ports
echo ""

# Optional build test
read -p "Run build test? (y/N): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    test_build
fi

# Show summary
show_summary

echo "🎉 Docker setup validation complete!"
echo ""
echo "Next steps:"
echo "1. Start development environment: ./docker-crm.sh dev"
echo "2. Access application at http://localhost:8000"
echo "3. Check logs: ./docker-crm.sh logs"
echo "4. For production: ./docker-crm.sh prod"
echo ""
echo "For help: ./docker-crm.sh help"
