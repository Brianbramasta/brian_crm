#!/bin/bash

# Deployment script for cPanel
# Run this script after git pull on your server

echo "Starting deployment..."

# Install/Update dependencies
composer install --optimize-autoloader --no-dev

# Clear and cache config
php artisan config:clear
php artisan config:cache

# Clear and cache routes
php artisan route:clear
php artisan route:cache

# Clear and cache views
php artisan view:clear
php artisan view:cache

# Run database migrations
php artisan migrate --force

# Set proper permissions
chmod -R 755 storage/
chmod -R 755 bootstrap/cache/

# Build frontend (if Node.js is available)
cd frontend
npm install --production
npm run build
cd ..

echo "Deployment completed!"