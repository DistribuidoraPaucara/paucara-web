import { useMemo, useCallback } from 'react';
import SearchSelect, { SelectOption } from '@/presentation/components/ui/search-select';
import { Label } from '@/presentation/components/ui/label';

interface Proveedor {
  id: number;
  nombre: string;
  razon_social?: string;
  nit?: string;
  telefono?: string;
  email?: string;
}

interface ProveedorSelectorProps {
  value: number | null;
  onSelect: (proveedor: Proveedor) => void;
  proveedoresDisponibles: Proveedor[];
  onSearchChange: (query: string) => void;
  isSearching?: boolean;
  label?: string;
}

export default function ProveedorSelector({
  value,
  onSelect,
  proveedoresDisponibles,
  onSearchChange,
  isSearching = false,
  label = '🏢 Proveedor',
}: ProveedorSelectorProps) {
  // Opciones para SearchSelect
  const proveedoresOptions: SelectOption[] = useMemo(() =>
    proveedoresDisponibles.map(proveedor => ({
      value: proveedor.id,
      label: proveedor.nombre,
      description: proveedor.nit ? `NIT: ${proveedor.nit}` : undefined
    })), [proveedoresDisponibles]
  );

  const proveedorSeleccionado = useMemo(() =>
    proveedoresDisponibles.find(p => p.id === value),
    [value, proveedoresDisponibles]
  );

  const handleChange = useCallback((newValue: string | number | '') => {
    const proveedor = proveedoresDisponibles.find(p => p.id === Number(newValue));
    if (proveedor) {
      onSelect(proveedor);
    }
  }, [proveedoresDisponibles, onSelect]);

  return (
    <div>
      <Label htmlFor="proveedor" className="text-sm font-medium">
        {label}
      </Label>
      <SearchSelect
        id="proveedor"
        value={value || ''}
        onChange={handleChange}
        onSearch={onSearchChange}
        options={proveedoresOptions}
        searchPlaceholder="Buscar proveedor por nombre o NIT..."
        emptyText={isSearching ? "Buscando..." : "No se encontraron proveedores"}
        loading={isSearching}
        allowClear={true}
      />

      {/* Mostrar datos del proveedor seleccionado */}
      {proveedorSeleccionado && (
        <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
          {proveedorSeleccionado.razon_social && <span>🏢 {proveedorSeleccionado.razon_social}</span>}
          {proveedorSeleccionado.telefono && <span>{proveedorSeleccionado.razon_social ? ' • ' : ''}📱 {proveedorSeleccionado.telefono}</span>}
          {proveedorSeleccionado.email && <span>{proveedorSeleccionado.razon_social || proveedorSeleccionado.telefono ? ' • ' : ''}📧 {proveedorSeleccionado.email}</span>}
        </p>
      )}
    </div>
  );
}
