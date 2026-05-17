#!/bin/bash

# 📦 Script para sincronizar archivos de almacenamiento
# Copia archivos desde el código Git (en /app) al volumen persistente
# Se ejecuta al inicio en supervisord

echo "=========================================="
echo "📦 SYNC-STORAGE: Iniciando sincronización"
echo "=========================================="

cd /app

# Directorios a sincronizar
DIRS_TO_SYNC=(
    "clientes"
    "empresas"
    "productos"
    "entregas"
    "visitas"
    "proveedores"
    "fotos_lugar"
)

# Asegurarse de que el directorio raíz existe
mkdir -p /app/storage/app/public
chmod 777 /app/storage/app/public

echo "✅ Directorio raíz creado/verificado: /app/storage/app/public"
echo ""

# Copiar archivos de cada subdirectorio
for dir in "${DIRS_TO_SYNC[@]}"; do
    if [ -d "storage/app/public/$dir" ] && [ "$(ls -A storage/app/public/$dir)" ]; then
        echo "📋 Sincronizando directorio: $dir"
        echo "   Origen: storage/app/public/$dir/"
        echo "   Destino: /app/storage/app/public/$dir/"

        # Crear directorio si no existe
        mkdir -p "/app/storage/app/public/$dir"

        # Copiar archivos sin sobreescribir existentes (-n)
        # Usar -r para recursivo, -v para verbose
        cp -rn "storage/app/public/$dir/"* "/app/storage/app/public/$dir/" 2>/dev/null

        # Contar archivos copiados
        COUNT=$(find "/app/storage/app/public/$dir" -type f 2>/dev/null | wc -l)
        echo "   ✅ $dir sincronizado ($COUNT archivos)"
        echo ""
    fi
done

# Establecer permisos correctos
echo "🔐 Ajustando permisos..."
chmod -R 777 /app/storage/app/public 2>/dev/null || true
echo "✅ Permisos ajustados: /app/storage/app/public = 777"
echo ""

# Verificar sincronización final
echo "📁 Directorios sincronizados finales:"
ls -ld /app/storage/app/public/*/ 2>/dev/null | awk '{print "   ✅", $NF}'
echo ""

echo "=========================================="
echo "✅ SYNC-STORAGE: Sincronización completada"
echo "=========================================="
