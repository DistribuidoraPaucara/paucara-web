#!/bin/bash
# Script para restaurar todos los cambios de EmpleadoAccesoSistema.tsx

cd "$(dirname "$0")"

# 1. Agregar estado searchRoles si no existe
sed -i "/const \[searchPermiso,/i\\    const [searchRoles, setSearchRoles] = useState<string>('');" resources/js/presentation/components/empleados/EmpleadoAccesoSistema.tsx

# 2. Agregar autoComplete en password
sed -i 's/type={showPassword ? '\''text'\'\ : '\''password'\''}/autoComplete="new-password"\n                                    type={showPassword ? '"'"'text'"'"' : '"'"'password'"'"'}/g' resources/js/presentation/components/empleados/EmpleadoAccesoSistema.tsx

# 3. Agregar autoComplete en usernick
sed -i '/value={usernick}/a\                            autoComplete="off"' resources/js/presentation/components/empleados/EmpleadoAccesoSistema.tsx

echo "✅ Cambios restaurados"
