#!/bin/bash

set -e

echo "Starting PT Smart CRM Application..."

# Wait for database to be ready
echo "Waiting for database connection..."
until nc -z db 3306; do
  echo "Database not ready, waiting..."
  sleep 2
done

echo "Database is ready!"

# Generate app key if not exists
if [ ! -f ".env" ]; then
    cp .env.example .env
    php artisan key:generate
fi

# Run database migrations
echo "Running database migrations..."
php artisan migrate --force

# Clear application caches
echo "Clearing application caches..."
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

# Cache configurations for production
echo "Caching configurations..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Create symbolic link for storage
php artisan storage:link

# Set proper permissions
echo "Setting file permissions..."
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Optimize composer autoloader
composer dump-autoload --optimize --no-dev

echo "Starting Apache web server..."
apache2-foreground
