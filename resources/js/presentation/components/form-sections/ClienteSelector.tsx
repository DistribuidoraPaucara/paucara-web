import { useState, useMemo } from 'react';
import SearchSelect, { SelectOption } from '@/presentation/components/ui/search-select';
import ModalCrearCliente from '@/presentation/components/ui/modal-crear-cliente';
import { Label } from '@/presentation/components/ui/label';
import type { Cliente } from '@/domain/entities/clientes';

interface ClienteSelectorProps {
  value: string | number | null;
  display: string;
  onSelect: (cliente: Cliente) => void;
  clientesDisponibles: Cliente[];
  onSearchChange: (query: string) => void;
  isSearching?: boolean;
  onCreateClick?: () => void;
  label?: string;
  showCreateButton?: boolean;
}

export default function ClienteSelector({
  value,
  display,
  onSelect,
  clientesDisponibles,
  onSearchChange,
  isSearching = false,
  onCreateClick,
  label = '👥 Cliente',
  showCreateButton = true,
}: ClienteSelectorProps) {
  const [mostrarModalCliente, setMostrarModalCliente] = useState(false);

  // Opciones para SearchSelect
  const clientesOptions: SelectOption[] = useMemo(() =>
    clientesDisponibles.map(cliente => ({
      value: cliente.id,
      label: cliente.nombre,
      description: cliente.nit ? `NIT: ${cliente.nit}` : undefined
    })), [clientesDisponibles]
  );

  const clienteSeleccionado = useMemo(() =>
    clientesDisponibles.find(c => c.id === value),
    [value, clientesDisponibles]
  );

  const handleCrearCliente = () => {
    setMostrarModalCliente(true);
    if (onCreateClick) {
      onCreateClick();
    }
  };

  const handleClienteCreado = (nuevoCliente: Cliente) => {
    setMostrarModalCliente(false);
    onSelect(nuevoCliente);
  };

  return (
    <>
      <div>
        <Label htmlFor="cliente" className="text-sm font-medium">
          {label}
        </Label>
        <div className="flex gap-2">
          <div className="flex-1">
            <SearchSelect
              id="cliente"
              value={value}
              onChange={(newValue) => {
                const cliente = clientesDisponibles.find(c => c.id === Number(newValue));
                if (cliente) {
                  onSelect(cliente);
                }
              }}
              onSearch={(query) => onSearchChange(query)}
              options={clientesOptions}
              searchPlaceholder="Buscar cliente por nombre o NIT..."
              emptyText={isSearching ? "Buscando..." : "No se encontraron clientes"}
              isLoading={isSearching}
            />
          </div>
          {showCreateButton && (
            <button
              type="button"
              onClick={handleCrearCliente}
              className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-sm text-sm font-medium transition-colors dark:bg-green-700 dark:hover:bg-green-600"
              title="Crear nuevo cliente"
            >
              ➕
            </button>
          )}
        </div>

        {/* Mostrar datos del cliente seleccionado */}
        {clienteSeleccionado && (
          <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
            {clienteSeleccionado.telefono && <span>📱 {clienteSeleccionado.telefono}</span>}
            {clienteSeleccionado.nit && <span>{clienteSeleccionado.telefono ? ' • ' : ''}NIT: {clienteSeleccionado.nit}</span>}
            {clienteSeleccionado.email && <span>{clienteSeleccionado.telefono || clienteSeleccionado.nit ? ' • ' : ''}Email: {clienteSeleccionado.email}</span>}
          </p>
        )}
      </div>

      {/* Modal para crear cliente */}
      {mostrarModalCliente && (
        <ModalCrearCliente
          onClienteCreado={handleClienteCreado}
          onCancel={() => setMostrarModalCliente(false)}
        />
      )}
    </>
  );
}
