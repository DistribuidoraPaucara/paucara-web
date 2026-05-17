# 🏢 Seeders de Sectores

Documentación para los seeders de sectores de almacén.

## 📋 Seeders Creados

### 1. **SectorPermissionsSeeder**
Archivo: `database/seeders/SectorPermissionsSeeder.php`

**Responsabilidad:** Crear permisos de sectores y asignarlos a roles

**Permisos creados:**
- `sectores.create` - Crear sectores
- `sectores.read` - Ver/Listar sectores
- `sectores.update` - Editar sectores
- `sectores.delete` - Eliminar sectores
- `sectores.manage` - Permiso general (incluye todos)

**Asignaciones por rol:**
- **admin**: Todos los permisos (`sectores.*`)
- **vendedor**: Solo lectura (`sectores.read`)
- **encargado**: Lectura y edición (`sectores.read`, `sectores.update`)

---

### 2. **SectorSeeder**
Archivo: `database/seeders/SectorSeeder.php`

**Responsabilidad:** Crear sectores de ejemplo para cada almacén

**Sectores creados por almacén:**
1. **Bebidas** - Refrescos, bebidas alcohólicas, jugos, agua
2. **Refrigeración** - Productos que requieren cadena de frío
3. **Lácteos** - Leche, yogurt, quesos, crema
4. **Panadería** - Pan, pasteles, galletas
5. **Carnes y Pescados** - Carnes frescas, embutidos, pescados
6. **Abarrotes** - Productos secos, conservas, alimentos no perecederos
7. **Limpieza** - Productos de limpieza y desinfección
8. **Higiene Personal** - Jabones, desodorantes, pasta dental

**Además:** 
- Se verifica que exista el sector "General" (genérico) para cada almacén
- Si no existe, se crea automáticamente
- El seeder evita duplicados (verifica que no existan antes de crear)

---

## 🚀 Cómo Usar

### En Desarrollo
Los seeders se ejecutan automáticamente al correr:

```bash
php artisan db:seed
```

O para ejecutar solo los seeders de sectores:

```bash
php artisan db:seed --class=SectorPermissionsSeeder
php artisan db:seed --class=SectorSeeder
```

### En Producción

**Opción 1: Migración limpia (recomendado)**
```bash
php artisan migrate:fresh --seed
```

**Opción 2: Agregar a una BD existente**
```bash
php artisan db:seed --class=SectorPermissionsSeeder
php artisan db:seed --class=SectorSeeder
```

### En DatabaseSeeder (se ejecutan automáticamente)
Los seeders ya están integrados en `DatabaseSeeder.php`:

```php
// Permisos (ejecuta temprano, después de otros permisos)
$this->call(SectorPermissionsSeeder::class);

// Datos (ejecuta después de almacenes)
$this->call(SectorSeeder::class);
```

---

## ⚙️ Configuración

### Para agregar más roles
Editar `SectorPermissionsSeeder.php`:

```php
$roleNewRole = Role::where('name', 'nuevo_rol')->first();
if ($roleNewRole) {
    $roleNewRole->givePermissionTo('sectores.read'); // Solo lectura
}
```

### Para agregar más sectores de ejemplo
Editar `SectorSeeder.php`:

```php
$sectoresEjemplo = [
    // ... sectores existentes ...
    [
        'nombre' => 'Mi Nuevo Sector',
        'descripcion' => 'Descripción del sector'
    ],
];
```

---

## 🔐 Permisos Asignados

| Rol | Permisos | Descripción |
|-----|----------|-------------|
| admin | `sectores.*` | Control total |
| vendedor | `sectores.read` | Solo lectura |
| encargado | `sectores.read`, `sectores.update` | Lectura + edición |
| otros | ninguno | Sin acceso |

---

## 📊 Datos de Ejemplo

**Almacén:** Almacén Principal
```
├─ General (genérico - automático)
├─ Bebidas
├─ Refrigeración
├─ Lácteos
├─ Panadería
├─ Carnes y Pescados
├─ Abarrotes
├─ Limpieza
└─ Higiene Personal
```

Se crea esta estructura para **cada almacén activo**.

---

## ✅ Verificación

Después de ejecutar los seeders, verificar:

```bash
php artisan tinker

# Verificar permisos creados
Permission::where('name', 'like', '%sector%')->get();

# Verificar sectores creados
Sector::with('almacen')->get();

# Verificar permisos de admin
User::find(2)->getPermissions()->where('name', 'like', '%sector%')->get();
```

---

## 🐛 Troubleshooting

### Error: "Permiso ya existe"
Normal. El seeder usa `firstOrCreate()`, así que es seguro ejecutar múltiples veces.

### Error: "Rol no encontrado"
El rol aún no está creado. Los seeders verifican si existen antes de asignar.

### Sectores no aparecen
Verificar que:
1. Hay almacenes activos (activo = true)
2. Las migraciones se ejecutaron (tabla sectores existe)
3. El seeder se ejecutó sin errores

---

## 📝 Comandos Útiles

```bash
# Ejecutar todos los seeders
php artisan db:seed

# Ejecutar solo seeders de sectores
php artisan db:seed --class=SectorPermissionsSeeder
php artisan db:seed --class=SectorSeeder

# Migrar + seed (limpio)
php artisan migrate:fresh --seed

# Ver permisos de sectores
php artisan tinker
>>> Permission::where('name', 'like', '%sector%')->pluck('name')

# Ver sectores
>>> Sector::with('almacen')->get()

# Ver permisos de usuario admin
>>> User::find(2)->getAllPermissions()->pluck('name')
```

---

## 📌 Checklist para Producción

- [ ] Ejecutar `php artisan migrate`
- [ ] Ejecutar `php artisan db:seed --class=SectorPermissionsSeeder`
- [ ] Ejecutar `php artisan db:seed --class=SectorSeeder`
- [ ] Verificar permisos en BD
- [ ] Verificar sectores en BD
- [ ] Probar acceso a `/sectores` con usuario admin
- [ ] Verificar que otros roles tienen permisos correctos
- [ ] Limpiar caché: `php artisan cache:clear`

---

## 🔗 Relaciones

- **Sector** → pertenece a **Almacen**
- **StockProducto** → pertenece a **Sector** (migration: `add_sector_id_to_stock_productos`)
- **Permiso** → asignado a **Role**

---

**Última actualización:** 2026-04-10
**Versión:** 1.0
