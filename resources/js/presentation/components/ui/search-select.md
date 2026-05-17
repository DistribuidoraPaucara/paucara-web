// Documentation: SearchSelect - Guía de uso y ejemplos

## 📋 **SearchSelect System - Componentes Creados**

### 1. **SearchSelect** (`/presentation/components/ui/search-select.tsx`)
Componente base con búsqueda local y todas las funcionalidades modernas.

### 2. **AsyncSearchSelect** (`/presentation/components/ui/async-search-select.tsx`)
Extensión para búsqueda en servidor (para grandes volúmenes de datos).

### 3. **useSearchSelect & useEntitySelect** (`/hooks/use-search-select.ts`)
Hooks para manejar la lógica de búsqueda y transformación de datos.

---

## 🚀 **Ejemplos de Uso**

### **Uso Básico (Como en el formulario de productos)**
```tsx
import SearchSelect from '@/presentation/components/ui/search-select';
import { useEntitySelect } from '@/hooks/use-search-select';

// En tu componente
const categoriasSelect = useEntitySelect(categorias);

<SearchSelect
  label="Categoría"
  placeholder="Seleccione una categoría"
  value={formData.categoria_id}
  options={categoriasSelect.filteredOptions}
  onChange={(value) => setFormData('categoria_id', Number(value))}
  error={errors.categoria_id}
  allowClear={true}
/>
```

### **Uso con Renderizado Personalizado**
```tsx
<SearchSelect
  label="Unidad de Medida"
  options={unidades}
  value={selectedUnidad}
  onChange={handleChange}
  renderOption={(option, isSelected) => (
    <div className={`flex justify-between ${isSelected ? 'bg-blue-50' : ''}`}>
      <span>{option.label}</span>
      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
        {option.description}
      </span>
    </div>
  )}
/>
```

### **Uso con Búsqueda en Servidor**
```tsx
import AsyncSearchSelect from '@/presentation/components/ui/async-search-select';

<AsyncSearchSelect
  label="Cliente"
  placeholder="Buscar cliente..."
  value={clienteId}
  onChange={setClienteId}
  searchEndpoint="/api/clientes/search"
  minSearchLength={3}
  debounceMs={500}
/>
```

---

## 🛠 **Cómo Aplicar en Otros Formularios**

### **1. Para formularios existentes (ej: Categorías, Marcas)**
```tsx
// Reemplazar este código:
<select value={data.parent_id} onChange={e => setData('parent_id', e.target.value)}>
  <option value="">Sin categoría padre</option>
  {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
</select>

// Por este:
<SearchSelect
  label="Categoría Padre"
  placeholder="Seleccione categoría padre"
  value={data.parent_id}
  options={categoriasSelect.filteredOptions}
  onChange={(value) => setData('parent_id', value)}
  allowClear={true}
/>
```

### **2. Para nuevos formularios**
```tsx
import SearchSelect from '@/presentation/components/ui/search-select';
import { useEntitySelect } from '@/hooks/use-search-select';

function NuevoFormulario({ proveedores, categorias }) {
  const proveedoresSelect = useEntitySelect(proveedores);
  const categoriasSelect = useEntitySelect(categorias);
  
  return (
    <form>
      <SearchSelect
        label="Proveedor"
        options={proveedoresSelect.filteredOptions}
        value={data.proveedor_id}
        onChange={(value) => setData('proveedor_id', value)}
      />
      
      <SearchSelect
        label="Categoría"
        options={categoriasSelect.filteredOptions}
        value={data.categoria_id}
        onChange={(value) => setData('categoria_id', value)}
      />
    </form>
  );
}
```

---

## 🎯 **Características del Sistema**

### **✅ Funcionalidades Incluidas:**
- 🔍 **Búsqueda en tiempo real** con debounce
- 🎨 **Interfaz moderna** con hover effects y transiciones
- 📱 **Completamente responsive** (móvil y escritorio)
- ♿ **Accesible** con navegación por teclado
- 🧹 **Botón de limpiar** opcional
- 🎭 **Renderizado personalizable** para opciones
- 💾 **Estados de loading** para búsquedas asíncronas
- 🚫 **Manejo de errores** integrado
- 🎪 **Estados vacíos** informativos

### **🔧 Props Disponibles:**
- `label` - Etiqueta del campo
- `placeholder` - Texto placeholder
- `value` - Valor seleccionado
- `options` - Array de opciones
- `onChange` - Callback al cambiar selección
- `onSearch` - Callback para búsqueda externa
- `error` - Mensaje de error a mostrar
- `disabled` - Deshabilitado
- `required` - Campo requerido
- `allowClear` - Mostrar botón limpiar
- `loading` - Estado de carga
- `maxHeight` - Altura máxima del dropdown
- `renderOption` - Función para renderizado personalizado

---

## 🚀 **Beneficios del Sistema**

1. **Escalabilidad**: Maneja desde 10 hasta 10,000+ opciones
2. **Performance**: Búsqueda optimizada con debounce
3. **UX**: Interfaz intuitiva y moderna  
4. **Reutilización**: Un componente para todos los casos
5. **Mantenimiento**: Código centralizado y tipado
6. **Futuro-proof**: Fácil de extender con nuevas funcionalidades
