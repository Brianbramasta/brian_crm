# Use official PHP image with Apache
FROM php:8.2-apache

# Set working directory
WORKDIR /var/www/html

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    nodejs \
    npm \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Enable Apache modules
RUN a2enmod rewrite headers

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy existing application directory contents
COPY . /var/www/html

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Install PHP dependencies
RUN composer install --optimize-autoloader --no-dev

# Install Node.js dependencies and build frontend
WORKDIR /var/www/html/frontend
RUN npm install && npm run build

# Move built assets to Laravel public directory
RUN mkdir -p /var/www/html/public/frontend && \
    cp -r dist/* /var/www/html/public/frontend/

# Return to Laravel root
WORKDIR /var/www/html

# Configure Apache virtual host
COPY docker/apache/000-default.conf /etc/apache2/sites-available/000-default.conf

# Copy application files
COPY --chown=www-data:www-data . /var/www/html/

# Create necessary directories
RUN mkdir -p storage/logs bootstrap/cache storage/framework/sessions storage/framework/views storage/framework/cache

# Set environment variables
ENV APACHE_DOCUMENT_ROOT /var/www/html/public

# Update the default apache site with the new doc root
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Expose port 80
EXPOSE 80

# Create startup script
COPY docker/start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

# Start script
CMD ["/usr/local/bin/start.sh"]
