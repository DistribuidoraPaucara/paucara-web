#!/bin/bash

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}     📦 Diagnóstico de Almacenamiento (Clientes, Empresas, Productos)${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

cd /app || exit 1

# Arrays de carpetas
declare -a folders=("clientes" "empresas" "productos")
declare -a db_tables=("clientes" "empresas" "productos")
declare -a db_columns=("foto_perfil" "logo" "imagen_portada")

# 1. Resumen general
echo -e "${BLUE}📊 1. Resumen General${NC}"
echo "─────────────────────────────────────────────────────────────────"
total_files=$(find storage/app/public -type f 2>/dev/null | wc -l)
echo "Total de archivos en storage/app/public: $total_files"
echo ""

# 2. Por carpeta
echo -e "${BLUE}📁 2. Estado por Carpeta${NC}"
echo "─────────────────────────────────────────────────────────────────"

for i in "${!folders[@]}"; do
    folder="${folders[$i]}"
    path="storage/app/public/$folder"

    echo -n "$folder: "
    if [ -d "$path" ]; then
        perms=$(ls -ld "$path" | awk '{print $1}')
        count=$(find "$path" -type f 2>/dev/null | wc -l)
        echo -e "${GREEN}✅${NC} Existe | Permisos: $perms | Archivos: $count"
    else
        echo -e "${RED}❌${NC} NO EXISTE"
        mkdir -p "$path" && chmod 777 "$path"
        echo "   ${GREEN}✅ Creado y permisos 777${NC}"
    fi
done
echo ""

# 3. Test de escritura por carpeta
echo -e "${BLUE}✍️  3. Test de Escritura${NC}"
echo "─────────────────────────────────────────────────────────────────"

for folder in "${folders[@]}"; do
    path="storage/app/public/$folder"
    if touch "$path/.write_test" 2>/dev/null; then
        echo -e "${GREEN}✅${NC} $folder: Puedo escribir"
        rm -f "$path/.write_test"
    else
        echo -e "${RED}❌${NC} $folder: NO puedo escribir"
    fi
done
echo ""

# 4. Verificar archivos en BD vs Disco
echo -e "${BLUE}💾 4. BD vs Disco (Verificación de Integridad)${NC}"
echo "─────────────────────────────────────────────────────────────────"

# Clientes
echo "📌 CLIENTES:"
clientes_count=$(php artisan tinker --execute 'echo DB::table("clientes")->whereNotNull("foto_perfil")->count();' 2>/dev/null || echo "0")
echo "   BD: $clientes_count clientes con foto_perfil"
php artisan tinker --execute '
DB::table("clientes")
  ->whereNotNull("foto_perfil")
  ->take(3)
  ->get(["id", "foto_perfil"])
  ->each(function($client) {
    $path = "storage/app/public/" . $client->foto_perfil;
    $exists = file_exists($path) ? "✅" : "❌";
    echo "   $exists Cliente $client->id\n";
  });
' 2>/dev/null || echo "   Error al conectar BD"
echo ""

# Empresas
echo "📌 EMPRESAS:"
empresas_count=$(php artisan tinker --execute 'echo DB::table("empresas")->whereNotNull("logo")->count();' 2>/dev/null || echo "0")
echo "   BD: $empresas_count empresas con logo"
php artisan tinker --execute '
DB::table("empresas")
  ->whereNotNull("logo")
  ->take(3)
  ->get(["id", "logo"])
  ->each(function($empresa) {
    $path = "storage/app/public/" . $empresa->logo;
    $exists = file_exists($path) ? "✅" : "❌";
    echo "   $exists Empresa $empresa->id\n";
  });
' 2>/dev/null || echo "   Error al conectar BD"
echo ""

# Productos
echo "📌 PRODUCTOS:"
productos_count=$(php artisan tinker --execute 'echo DB::table("productos")->whereNotNull("imagen_portada")->count();' 2>/dev/null || echo "0")
echo "   BD: $productos_count productos con imagen_portada"
php artisan tinker --execute '
DB::table("productos")
  ->whereNotNull("imagen_portada")
  ->take(3)
  ->get(["id", "imagen_portada"])
  ->each(function($producto) {
    $path = "storage/app/public/" . $producto->imagen_portada;
    $exists = file_exists($path) ? "✅" : "❌";
    echo "   $exists Producto $producto->id\n";
  });
' 2>/dev/null || echo "   Error al conectar BD"
echo ""

# 5. Symlink
echo -e "${BLUE}🔗 5. Estado del Symlink${NC}"
echo "─────────────────────────────────────────────────────────────────"
if [ -L public/storage ]; then
    target=$(readlink -f public/storage)
    echo -e "${GREEN}✅${NC} public/storage existe"
    echo "   Apunta a: $target"
    if [ -d "$target" ]; then
        echo -e "${GREEN}✅${NC} Directorio destino accesible"
    else
        echo -e "${RED}❌${NC} Directorio destino NO accesible"
    fi
else
    echo -e "${RED}❌${NC} public/storage NO existe"
fi
echo ""

# 6. Estructura de directorios
echo -e "${BLUE}📂 6. Estructura Completa${NC}"
echo "─────────────────────────────────────────────────────────────────"
tree -L 3 storage/app/public 2>/dev/null || find storage/app/public -type d | head -20 | sed 's/^/  /'
echo ""

# 7. Resumen final
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}📋 Resumen${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""
echo "✅ Clientes: $clientes_count en BD"
echo "✅ Empresas: $empresas_count en BD"
echo "✅ Productos: $productos_count en BD"
echo ""
echo "Para acceder a los archivos:"
echo "  https://paucara.up.railway.app/storage/clientes/..."
echo "  https://paucara.up.railway.app/storage/empresas/..."
echo "  https://paucara.up.railway.app/storage/productos/..."
echo ""
