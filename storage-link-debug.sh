#!/bin/bash

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}     🔍 Diagnóstico de Storage Link - Paucara${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

cd /app || exit 1

# Timestamp
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
echo -e "${YELLOW}⏰ Timestamp: $TIMESTAMP${NC}"
echo ""

# Check environment
echo -e "${BLUE}📊 1. Información del Entorno${NC}"
echo "App Environment: $(php artisan tinker --execute 'echo config("app.env");' 2>/dev/null || echo 'N/A')"
echo "PHP Version: $(php -v | head -n1)"
echo "Working Directory: $(pwd)"
echo ""

# Check directories existence
echo -e "${BLUE}📁 2. Estructura de Directorios${NC}"

check_dir() {
    if [ -d "$1" ]; then
        perms=$(ls -ld "$1" | awk '{print $1}')
        echo -e "${GREEN}✅${NC} $1 existe (permisos: $perms)"
    else
        echo -e "${RED}❌${NC} $1 NO existe"
    fi
}

check_dir "storage"
check_dir "storage/app"
check_dir "storage/app/public"
check_dir "public"
check_dir "public/bootstrap"
check_dir "public/bootstrap/cache"
echo ""

# Check symlink
echo -e "${BLUE}🔗 3. Estado del Symlink${NC}"

if [ -L public/storage ]; then
    target=$(readlink -f public/storage)
    perms=$(ls -ld public/storage | awk '{print $1}')
    echo -e "${GREEN}✅${NC} Symlink public/storage existe"
    echo "   Permisos: $perms"
    echo "   Apunta a: $target"

    if [ -d "$target" ]; then
        echo -e "${GREEN}✅${NC} El directorio destino existe"
        target_perms=$(ls -ld "$target" | awk '{print $1}')
        echo "   Permisos del destino: $target_perms"
    else
        echo -e "${RED}❌${NC} El directorio destino NO existe: $target"
    fi
else
    echo -e "${RED}❌${NC} Symlink public/storage NO existe"
    echo "   Intentando crear..."
    php artisan storage:link 2>&1
    if [ -L public/storage ]; then
        echo -e "${GREEN}✅${NC} Symlink creado exitosamente"
    else
        echo -e "${RED}❌${NC} Error al crear symlink"
    fi
fi
echo ""

# Check files in storage
echo -e "${BLUE}📂 4. Contenido de storage/app/public${NC}"

if [ -d "storage/app/public" ]; then
    count=$(find storage/app/public -type f 2>/dev/null | wc -l)
    echo "Archivos en storage/app/public: $count"

    if [ "$count" -gt 0 ]; then
        echo -e "${GREEN}✅${NC} Hay archivos guardados"
        echo "   Primeros 5 archivos:"
        find storage/app/public -type f | head -n5 | sed 's/^/       /'
    else
        echo -e "${YELLOW}⚠️${NC} No hay archivos en storage/app/public"
    fi
else
    echo -e "${RED}❌${NC} storage/app/public no existe"
fi
echo ""

# Check permissions in detail
echo -e "${BLUE}🔐 5. Verificación Detallada de Permisos${NC}"

check_perms() {
    path=$1
    if [ -e "$path" ]; then
        octal=$(stat -c %a "$path" 2>/dev/null || stat -f %A "$path" 2>/dev/null || echo "N/A")
        owner=$(stat -c %U:%G "$path" 2>/dev/null || stat -f %Su:%Sg "$path" 2>/dev/null || echo "N/A")
        echo "   $path: $octal ($owner)"
    fi
}

echo "storage/: $(ls -ld storage | awk '{print $1, $3, $4}')"
check_perms "storage"
check_perms "storage/app"
check_perms "storage/app/public"
check_perms "public"
check_perms "public/storage"
check_perms "public/bootstrap/cache"
echo ""

# Test file write
echo -e "${BLUE}✍️  6. Test de Escritura${NC}"

test_file="storage/app/public/.test_write_$(date +%s).txt"
if touch "$test_file" 2>/dev/null; then
    echo -e "${GREEN}✅${NC} Puedo escribir en storage/app/public"
    rm -f "$test_file"
else
    echo -e "${RED}❌${NC} NO puedo escribir en storage/app/public"
    echo "   Error de permisos o volumen no montado"
fi
echo ""

# Check database
echo -e "${BLUE}💾 7. Información de la Base de Datos${NC}"

db_host=$(php artisan tinker --execute 'echo config("database.connections.pgsql.host");' 2>/dev/null || echo "N/A")
db_name=$(php artisan tinker --execute 'echo config("database.connections.pgsql.database");' 2>/dev/null || echo "N/A")
echo "Database Host: $db_host"
echo "Database Name: $db_name"

if php artisan tinker --execute 'DB::connection()->getPdo();' 2>/dev/null; then
    echo -e "${GREEN}✅${NC} Conexión a BD exitosa"
else
    echo -e "${RED}❌${NC} Error de conexión a BD"
fi
echo ""

# Check client images in database
echo -e "${BLUE}🖼️  8. Verificación de Imágenes en BD${NC}"

photo_count=$(php artisan tinker --execute 'echo DB::table("clientes")->whereNotNull("foto_perfil")->count();' 2>/dev/null || echo "0")
echo "Clientes con foto_perfil en BD: $photo_count"

if [ "$photo_count" -gt 0 ]; then
    echo "Ejemplos de rutas guardadas:"
    php artisan tinker --execute 'DB::table("clientes")->whereNotNull("foto_perfil")->take(3)->pluck("foto_perfil")->each(function($path) { echo "  - " . $path . "\n"; });' 2>/dev/null

    echo -e "\nVerificando si archivos existen:"
    php artisan tinker --execute '
    DB::table("clientes")->whereNotNull("foto_perfil")->take(3)->get(["id", "foto_perfil"])->each(function($client) {
        $path = "storage/app/public/" . $client->foto_perfil;
        $exists = file_exists($path);
        $status = $exists ? "✅ EXISTE" : "❌ FALTA";
        echo "  Cliente $client->id: $status - $path\n";
    });
    ' 2>/dev/null
fi
echo ""

# Summary
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}📋 Resumen del Diagnóstico${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

# Count issues
issues=0
if [ ! -L public/storage ]; then
    echo -e "${RED}❌${NC} Symlink public/storage no existe"
    ((issues++))
fi

if [ ! -w "storage/app/public" ]; then
    echo -e "${RED}❌${NC} storage/app/public no es escribible"
    ((issues++))
fi

if [ "$count" -eq 0 ] && [ "$photo_count" -gt 0 ]; then
    echo -e "${RED}❌${NC} Hay imágenes en BD pero archivos no existen"
    ((issues++))
fi

if [ $issues -eq 0 ]; then
    echo -e "${GREEN}✅ Todo está correcto${NC}"
else
    echo -e "${RED}❌ Se encontraron $issues problemas${NC}"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
