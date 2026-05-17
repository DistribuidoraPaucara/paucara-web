#!/bin/bash

echo "════════════════════════════════════════════════════════════════"
echo "🔍 Diagnóstico de Imágenes - Paucara"
echo "════════════════════════════════════════════════════════════════"
echo ""

cd /app || exit 1

# 1. Verificar volumen
echo "📦 1. Estado del Volumen"
echo "─────────────────────────────────────────────────────────────────"
echo "Montajes de storage:"
mount | grep -E "storage|app" || echo "No se encontraron montajes"
echo ""
echo "Espacio disponible:"
df -h storage/ || echo "No disponible"
echo ""

# 2. Permisos de directorios
echo "🔐 2. Permisos de Directorios"
echo "─────────────────────────────────────────────────────────────────"
echo "storage/:"
ls -ld storage/
echo ""
echo "storage/app/:"
ls -ld storage/app/
echo ""
echo "storage/app/public/:"
ls -ld storage/app/public/
echo ""
echo "storage/app/public/clientes/:"
ls -ld storage/app/public/clientes/ 2>/dev/null || echo "❌ NO EXISTE"
echo ""

# 3. Test de escritura
echo "✍️  3. Test de Escritura"
echo "─────────────────────────────────────────────────────────────────"

# Test 1: Raíz de storage
if touch storage/.write_test 2>/dev/null; then
    echo "✅ Puedo escribir en storage/"
    rm -f storage/.write_test
else
    echo "❌ NO puedo escribir en storage/"
fi

# Test 2: En app/public
if touch storage/app/public/.write_test 2>/dev/null; then
    echo "✅ Puedo escribir en storage/app/public/"
    rm -f storage/app/public/.write_test
else
    echo "❌ NO puedo escribir en storage/app/public/"
fi

# Test 3: En clientes
mkdir -p storage/app/public/clientes 2>/dev/null
if touch storage/app/public/clientes/.write_test 2>/dev/null; then
    echo "✅ Puedo escribir en storage/app/public/clientes/"
    rm -f storage/app/public/clientes/.write_test
else
    echo "❌ NO puedo escribir en storage/app/public/clientes/"
fi
echo ""

# 4. Archivos existentes
echo "📁 4. Archivos por Carpeta"
echo "─────────────────────────────────────────────────────────────────"
echo "Total de archivos en storage/app/public:"
find storage/app/public -type f 2>/dev/null | wc -l
echo ""

for folder in clientes empresas productos; do
    path="storage/app/public/$folder"
    count=$(find "$path" -type f 2>/dev/null | wc -l)
    echo "📂 $folder/: $count archivos"
    find "$path" -type f 2>/dev/null | head -3 | sed 's/^/   /'
    [ "$count" -gt 0 ] && echo "" || echo "   (vacío)"
done
echo ""

# 5. Verificar symlink
echo "🔗 5. Estado del Symlink"
echo "─────────────────────────────────────────────────────────────────"
if [ -L public/storage ]; then
    target=$(readlink -f public/storage)
    echo "✅ public/storage existe"
    echo "   Apunta a: $target"
    if [ -d "$target" ]; then
        echo "   ✅ Directorio destino existe"
    else
        echo "   ❌ Directorio destino NO existe"
    fi
else
    echo "❌ public/storage NO existe"
fi
echo ""

# 6. BD vs Disco
echo "💾 6. Imágenes en BD vs Disco"
echo "─────────────────────────────────────────────────────────────────"
echo "Clientes con foto_perfil en BD:"
php artisan tinker --execute 'echo DB::table("clientes")->whereNotNull("foto_perfil")->count();' 2>/dev/null || echo "Error al conectar BD"
echo ""
echo "Verificando archivos:"
php artisan tinker --execute '
DB::table("clientes")
  ->whereNotNull("foto_perfil")
  ->take(5)
  ->get(["id", "foto_perfil"])
  ->each(function($client) {
    $path = "storage/app/public/" . $client->foto_perfil;
    $exists = file_exists($path) ? "✅" : "❌";
    echo "$exists Cliente $client->id: $client->foto_perfil\n";
  });
' 2>/dev/null || echo "Error al conectar BD"
echo ""

# 7. Logs recientes
echo "📋 7. Logs Recientes del Backend"
echo "─────────────────────────────────────────────────────────────────"
tail -20 storage/logs/laravel.log 2>/dev/null | grep -E "foto_perfil|imagenes|Error" || echo "No hay logs relevantes"
echo ""

# 8. Resumen
echo "════════════════════════════════════════════════════════════════"
echo "✨ Diagnóstico Completado"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "Si ves ❌ en 'Puedo escribir en storage/app/public/', el problema es:"
echo "  1. Permisos insuficientes"
echo "  2. Volumen montado como read-only"
echo ""
echo "Si ves ✅ en escritura pero archivos no se guardan:"
echo "  1. Revisar logs: tail -f storage/logs/laravel.log"
echo "  2. Verificar que el backend intente guardar la imagen"
echo ""
