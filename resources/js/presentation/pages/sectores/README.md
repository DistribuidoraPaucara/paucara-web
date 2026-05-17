# 🏢 Módulo de Sectores

Gestión de sectores de almacén (clasificación de productos dentro de cada almacén).

## 📁 Estructura

```
sectores/
├── index.tsx                 # Página principal (CRUD genérico)
├── components/
│   ├── SectorSelector.tsx    # Selector dinámico de sectores
│   ├── SectorCard.tsx        # Tarjeta visual del sector
│   ├── SectoresGrid.tsx      # Grid agrupado por almacén
│   └── index.ts              # Exportes
└── README.md                 # Esta documentación
```

## 🎯 Componentes

### 1. **SectorSelector**
Selector dinámico que carga sectores según el almacén seleccionado.

**Propiedades:**
- `almacenId` (Id): ID del almacén para filtrar
- `value` (Id): Sector seleccionado actual
- `onChange` (function): Callback cuando se selecciona
- `disabled` (boolean): Deshabilitar selector
- `label` (string): Etiqueta del campo
- `placeholder` (string): Texto de placeholder
- `error` (string): Mensaje de error

**Ejemplo:**
```tsx
import { SectorSelector } from '@/presentation/pages/sectores/components';

export default function MiComponente() {
  const [almacenId, setAlmacenId] = useState<Id>(2);
  const [sectorId, setSectorId] = useState<Id>();

  return (
    <SectorSelector
      almacenId={almacenId}
      value={sectorId}
      onChange={(id) => setSectorId(id)}
      label="Seleccionar Sector"
    />
  );
}
```

### 2. **SectorCard**
Tarjeta visual que muestra información del sector con opciones de edición y eliminación.

**Propiedades:**
- `sector` (Sector): Objeto sector a mostrar
- `almacenNombre` (string): Nombre del almacén (opcional)
- `onEdit` (function): Callback para editar
- `onDelete` (function): Callback para eliminar
- `readonly` (boolean): Solo lectura

**Ejemplo:**
```tsx
import { SectorCard } from '@/presentation/pages/sectores/components';

export default function ListaSectores() {
  const handleEdit = (sector: Sector) => {
    console.log('Editar:', sector);
  };

  const handleDelete = (sectorId: number) => {
    console.log('Eliminar:', sectorId);
  };

  return (
    <SectorCard
      sector={sector}
      almacenNombre="Almacén Central"
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}
```

### 3. **SectoresGrid**
Grid que agrupa sectores por almacén.

**Propiedades:**
- `sectores` (Sector[]): Lista de sectores
- `almacenes` (Almacen[]): Lista de almacenes
- `onEdit` (function): Callback para editar
- `onDelete` (function): Callback para eliminar
- `loading` (boolean): Estado de carga

**Ejemplo:**
```tsx
import { SectoresGrid } from '@/presentation/pages/sectores/components';

export default function Dashboard() {
  const [sectores, setSectores] = useState<Sector[]>([]);
  const [almacenes, setAlmacenes] = useState<Almacen[]>([]);

  return (
    <SectoresGrid
      sectores={sectores}
      almacenes={almacenes}
      onEdit={(s) => console.log('Editar:', s)}
      onDelete={(id) => console.log('Eliminar:', id)}
    />
  );
}
```

## 🔗 Rutas API

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/sectores?almacen_id=2` | Listar sectores del almacén |
| `GET` | `/api/sectores/{id}` | Obtener sector específico |
| `POST` | `/api/sectores` | Crear nuevo sector |
| `PUT` | `/api/sectores/{id}` | Actualizar sector |
| `DELETE` | `/api/sectores/{id}` | Eliminar sector |
| `GET` | `/api/almacenes/{id}/sector-generico` | Obtener sector genérico |

## 📦 Página Principal

La página `/sectores` utiliza `GenericContainer` para CRUD automático.

**Ubicación:** `resources/js/presentation/pages/sectores/index.tsx`

**Características:**
- ✅ Tabla automática con búsqueda
- ✅ Crear nuevo sector (modal)
- ✅ Editar sector (modal)
- ✅ Eliminar sector (con confirmación)
- ✅ Validaciones automáticas
- ✅ Mensajes de éxito/error
- ✅ Paginación

## 🛠️ Servicios

### sectoresService

```typescript
import sectoresService from '@/infrastructure/services/sectores.service';

// Obtener sector genérico de un almacén
const sectorGenerico = await sectoresService.obtenerGenerico(almacenId);

// Listar sectores de un almacén
const sectores = await sectoresService.listarPorAlmacen(almacenId);

// URLs para enrutamiento
const indexUrl = sectoresService.indexUrl();
const createUrl = sectoresService.createUrl();
const editUrl = sectoresService.editUrl(sectorId);
const storeUrl = sectoresService.storeUrl();
const updateUrl = sectoresService.updateUrl(sectorId);
const destroyUrl = sectoresService.destroyUrl(sectorId);

// Validación
const errors = sectoresService.validateData(formData);
```

## 📋 Tipos TypeScript

```typescript
// Entidad Sector
interface Sector extends BaseEntity {
  id: Id;
  almacen_id: Id;
  nombre: string;
  es_generico: boolean;
  descripcion?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Datos de formulario
interface SectorFormData extends BaseFormData {
  id?: Id;
  almacen_id: Id;
  nombre: string;
  es_generico?: boolean;
  descripcion?: string | null;
}
```

## 🔐 Validaciones

El service incluye validaciones automáticas:

- ✅ Almacén requerido
- ✅ Nombre requerido (1-100 caracteres)
- ✅ Descripción máximo 500 caracteres
- ✅ Nombre único por almacén

## 🎨 Configuración

**Archivo:** `resources/js/config/modules/sectores.config.tsx`

Contiene:
- Columnas de tabla
- Campos de formulario
- Opciones de búsqueda
- Mensajes personalizados
- Permisos requeridos

## 📝 Ejemplo Completo

```tsx
import { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { SectorSelector, SectorCard } from '@/presentation/pages/sectores/components';
import sectoresService from '@/infrastructure/services/sectores.service';
import type { Sector, SectorFormData } from '@/domain/entities/sectores';
import type { Id } from '@/domain/entities/shared';

export default function MiPagina() {
  const [almacenId, setAlmacenId] = useState<Id>(2);
  const [sectorId, setSectorId] = useState<Id>();
  const [sector, setSector] = useState<Sector | null>(null);
  const [loading, setLoading] = useState(false);

  // Cargar información del sector cuando se selecciona
  useEffect(() => {
    if (!sectorId) {
      setSector(null);
      return;
    }

    setLoading(true);
    fetch(`/api/sectores/${sectorId}`)
      .then((res) => res.json())
      .then((data) => setSector(data.data))
      .finally(() => setLoading(false));
  }, [sectorId]);

  const handleEditSector = async (updatedSector: Sector) => {
    const formData: SectorFormData = {
      almacen_id: updatedSector.almacen_id,
      nombre: updatedSector.nombre,
      descripcion: updatedSector.descripcion,
    };

    const errors = sectoresService.validateData(formData);
    if (errors.length > 0) {
      alert('Errores: ' + errors.join(', '));
      return;
    }

    try {
      const response = await fetch(`/api/sectores/${updatedSector.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSector(updatedSector);
        alert('Sector actualizado');
      }
    } catch (error) {
      console.error('Error al actualizar sector:', error);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Selector */}
        <SectorSelector
          almacenId={almacenId}
          value={sectorId}
          onChange={setSectorId}
          label="Seleccionar Sector"
        />

        {/* Información */}
        {sector && (
          <SectorCard
            sector={sector}
            almacenNombre="Almacén Central"
            onEdit={handleEditSector}
            readonly={false}
          />
        )}

        {loading && <p>Cargando...</p>}
      </div>
    </AppLayout>
  );
}
```

## 🚀 Próximos Pasos

1. Integrar componentes en otras páginas (stock, ventas, compras)
2. Agregar filtros avanzados
3. Crear reportes por sector
4. Agregar estadísticas de sector

---

**Última actualización:** 2026-04-10
