# Use PHP 8.2 FPM Alpine with Supervisor
FROM php:8.2-fpm-alpine

# Install system dependencies including supervisor
RUN apk add --no-cache \
    git \
    curl \
    nodejs \
    npm \
    nginx \
    supervisor \
    libzip-dev \
    zlib-dev \
    postgresql-dev \
    oniguruma-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg && \
    docker-php-ext-install zip pdo_mysql mbstring pdo_pgsql gd

# Configure PHP settings for production
RUN echo "max_execution_time = 120" >> /usr/local/etc/php/php.ini && \
    echo "max_input_time = 120" >> /usr/local/etc/php/php.ini && \
    echo "memory_limit = 512M" >> /usr/local/etc/php/php.ini && \
    echo "post_max_size = 100M" >> /usr/local/etc/php/php.ini && \
    echo "upload_max_filesize = 100M" >> /usr/local/etc/php/php.ini

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /app

# Copy composer files for dependency installation
COPY composer.json composer.lock ./

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Copy package files
COPY package.json package-lock.json ./

# Install Node dependencies
RUN npm ci

# Copy application code
COPY . /app/

# Build frontend assets
RUN npm run build

# Run Laravel setup (storage:link will be done at runtime in supervisord)
RUN echo "🏗️  [BUILD] Inicializando Laravel..." && \
    php artisan package:discover --ansi && \
    php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache && \
    php artisan optimize && \
    echo "✅ [BUILD] Laravel inicializado"

# Set permissions (crucial for volume mount)
RUN echo "🔐 [BUILD] Ajustando permisos..." && \
    chmod -R 777 storage/ && \
    chmod -R 777 public/ && \
    chmod -R 777 bootstrap/cache && \
    echo "✅ [BUILD] storage/ => 777" && \
    echo "✅ [BUILD] public/ => 777" && \
    echo "✅ [BUILD] bootstrap/cache/ => 777"

# Ensure specific directories are writable
RUN echo "📁 [BUILD] Creando directorios de almacenamiento..." && \
    mkdir -p storage/app/private && \
    mkdir -p storage/app/public && \
    mkdir -p storage/app/public/clientes && \
    mkdir -p storage/app/public/clientes/fotos_lugar && \
    mkdir -p storage/app/public/productos && \
    mkdir -p storage/app/public/empresas && \
    mkdir -p storage/app/public/entregas && \
    mkdir -p storage/app/public/visitas && \
    mkdir -p storage/app/public/proveedores && \
    mkdir -p storage/app/public/fotos_lugar && \
    mkdir -p storage/app/backups && \
    mkdir -p storage/app/backups/images && \
    mkdir -p storage/logs && \
    mkdir -p storage/framework && \
    mkdir -p storage/framework/cache && \
    mkdir -p storage/framework/sessions && \
    mkdir -p storage/framework/views && \
    chmod -R 777 storage/ && \
    echo "✅ [BUILD] Directorios de almacenamiento creados con permisos 777"

# Verify directories exist for volume mount
RUN echo "📁 [BUILD] Verificando estructura de directorios..." && \
    mkdir -p storage/app/public && \
    echo "   - storage/app/public existe: $(ls -ld storage/app/public | awk '{print $1, $9}')" && \
    mkdir -p public/bootstrap/cache && \
    echo "   - public/bootstrap/cache existe: $(ls -ld public/bootstrap/cache | awk '{print $1, $9}')" && \
    echo "✅ [BUILD] Estructura de directorios verificada"

# Note: DO NOT create symlink here - it will be done at RUNTIME in supervisord
# This ensures it points correctly to the volume-mounted directory

# Create necessary directories
RUN mkdir -p /run/nginx /var/log/supervisor

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/http.d/default.conf

# Copy Supervisor configuration
COPY supervisord.conf /etc/supervisord.conf

# Expose port
EXPOSE 8080

# Start with Supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
