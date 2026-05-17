import { useState, useMemo, useEffect } from 'react';
import { Card } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import SearchSelect from '@/presentation/components/ui/search-select';
import {
  Truck,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Check,
  TrendingUp,
  User,
} from 'lucide-react';
import type { VehiculoRecomendado } from '@/domain/entities/vehiculos';
import type { ChoferEntrega } from '@/domain/entities/entregas';
import type { Id } from '@/domain/entities/shared';

interface VehicleWithChofer extends VehiculoRecomendado {
  chofer_asignado_id?: Id | null;
}

interface VehicleRecommendationCardProps {
  recomendado: VehicleWithChofer | null;
  disponibles: VehicleWithChofer[];
  todosVehiculos?: VehicleWithChofer[]; // Para edit mode: búsqueda en lista completa
  pesoTotal: number;
  isLoading: boolean;
  error: string | null;
  alerta: string | null;
  selectedVehiculoId?: Id;
  selectedChoferId?: Id | null;
  selectedEntregadorId?: Id | null;
  choferes?: ChoferEntrega[];
  entregadores?: ChoferEntrega[];
  onSelectVehiculo: (vehiculoId: Id) => void;
  onSelectChofer?: (choferId: Id) => void;
  onSelectEntregador?: (entregadorId: Id) => void;
}

export function VehicleRecommendationCard({
  recomendado,
  disponibles,
  todosVehiculos = [],
  pesoTotal,
  isLoading,
  error,
  alerta,
  selectedVehiculoId,
  selectedChoferId,
  selectedEntregadorId,
  choferes = [],
  entregadores = [],
  onSelectVehiculo,
  onSelectChofer,
  onSelectEntregador,
}: VehicleRecommendationCardProps) {
  console.log('Renderizando VehicleRecommendationCard con props:', {
    recomendado,
    disponibles,
    pesoTotal,
  });
  const [showAllVehiculos, setShowAllVehiculos] = useState(false);
  const [seleccionarChoferManualmente, setSeleccionarChoferManualmente] = useState(false);
  const [seleccionarEntregadorManualmente, setSeleccionarEntregadorManualmente] = useState(false);

  // Determinar qué vehículo mostrar: recomendado o seleccionado
  const vehiculoActual = useMemo(() => {
    // ✅ CORRECCIÓN: En edit mode, buscar en todosVehiculos cuando no hay recomendado
    if (selectedVehiculoId) {
      // 1️⃣ Buscar en disponibles (si hay recomendación)
      if (disponibles.length > 0) {
        const found = disponibles.find((v) => v.id === selectedVehiculoId);
        if (found) return found;
      }
      // 2️⃣ Buscar en todosVehiculos (fallback para edit mode)
      if (todosVehiculos.length > 0) {
        const found = todosVehiculos.find((v) => v.id === selectedVehiculoId);
        if (found) return found;
      }
    }
    // 3️⃣ Si no hay seleccionado, retornar recomendado
    return recomendado;
  }, [selectedVehiculoId, recomendado, disponibles, todosVehiculos]);

  // Calcular dinámicamente el porcentaje de capacidad basado en pesoTotal
  const capacidadDinamica = useMemo(() => {
    if (!vehiculoActual) return { porcentaje: 0, pesoCalculado: 0 };

    const capacidad = Number(vehiculoActual.capacidad_kg ?? 0);
    const peso = Number(pesoTotal ?? 0);

    if (capacidad === 0) return { porcentaje: 0, pesoCalculado: 0 };

    const porcentaje = Math.min((peso / capacidad) * 100, 100);
    return {
      porcentaje: Math.round(porcentaje * 10) / 10, // 1 decimal
      pesoCalculado: peso,
    };
  }, [pesoTotal, vehiculoActual?.capacidad_kg]);

  // Auto-seleccionar vehículo y chofer recomendado cuando se carga
  useEffect(() => {
    if (recomendado && !selectedVehiculoId) {
      // Auto-seleccionar el vehículo recomendado
      onSelectVehiculo(recomendado.id);

      // ✅ CORREGIDO: Solo auto-seleccionar el chofer si existe en la lista de choferes disponibles
      // Esto evita seleccionar choferes que no tienen permisos
      if (recomendado.choferAsignado && onSelectChofer && choferes?.length > 0) {
        const choferEnLista = choferes.find(c => c.id === recomendado.choferAsignado.id);
        if (choferEnLista) {
          console.log('✅ Auto-seleccionando chofer válido:', {
            id: recomendado.choferAsignado.id,
            nombre: recomendado.choferAsignado.nombre,
          });
          onSelectChofer(recomendado.choferAsignado.id);
          setSeleccionarChoferManualmente(false);
        } else {
          console.warn('⚠️ Chofer asignado del vehículo NO está en lista de choferes válidos, requiere selección manual', {
            chofer_id: recomendado.choferAsignado.id,
            choferes_disponibles: choferes.map(c => c.id),
          });
          setSeleccionarChoferManualmente(true);
        }
      } else {
        // Si no hay chofer asignado o no hay choferes disponibles, forzar selección manual
        if (onSelectChofer) {
          setSeleccionarChoferManualmente(true);
        }
      }
    }
  }, [recomendado?.id, selectedVehiculoId, choferes]);

  // Pre-llenar datos en modo edición (cuando llegan del backend)
  useEffect(() => {
    // Si NO hay recomendación pero SÍ hay datos seleccionados del backend (edit mode)
    // NO usar !pesoTotal porque cambia dinámicamente
    if (!recomendado && selectedVehiculoId) {
      console.log('📝 MODO EDICIÓN: Pre-llenando datos del backend', {
        selectedVehiculoId,
        selectedChoferId,
        selectedEntregadorId,
      });

      // El vehículo ya viene seleccionado en los props

      // Pre-seleccionar chofer si viene del backend
      if (selectedChoferId && onSelectChofer) {
        console.log('📝 Auto-seleccionando chofer:', selectedChoferId);
        onSelectChofer(selectedChoferId);
        // Marcar como seleccionado manualmente si no hay chofer asignado al vehículo
        setSeleccionarChoferManualmente(true);
      }

      // Pre-seleccionar entregador si viene del backend
      if (selectedEntregadorId && onSelectEntregador) {
        console.log('📝 Auto-seleccionando entregador:', selectedEntregadorId);
        onSelectEntregador(selectedEntregadorId);
        setSeleccionarEntregadorManualmente(true);
      }
    }
  }, [selectedVehiculoId, selectedChoferId, selectedEntregadorId]);

  // Generar opciones de choferes para SearchSelect
  const choferesOptions = useMemo(() => {
    return choferes.map((chofer) => ({
      value: chofer.id,
      label: chofer.nombre || chofer.name,
      description: chofer.telefono ? `Tel: ${chofer.telefono}` : undefined,
    }));
  }, [choferes]);

  // Generar opciones de entregadores para SearchSelect
  const entregadoresOptions = useMemo(() => {
    return entregadores.map((entregador) => ({
      value: entregador.id,
      label: entregador.nombre || entregador.name,
      description: entregador.telefono ? `Tel: ${entregador.telefono}` : undefined,
    }));
  }, [entregadores]);

  // No mostrar nada si está cargando, hay error o no hay recomendación
  if (isLoading) {
    return (
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-blue-50/50 dark:from-slate-900 dark:to-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Calculando vehículo recomendado...
          </span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900 dark:text-red-200">Error</p>
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      </Card>
    );
  }

  if (!recomendado && pesoTotal > 0 && alerta) {
    return (
      <Card className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-yellow-900 dark:text-yellow-200">{alerta}</p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Carga total: <strong>{pesoTotal.toFixed(1)} kg</strong>
              </p>
            </div>
          </div>

          {/* Ver todos los vehículos */}
          <button
            onClick={() => setShowAllVehiculos(!showAllVehiculos)}
            className="text-sm font-medium text-yellow-700 dark:text-yellow-300 hover:text-yellow-900 dark:hover:text-yellow-200 flex items-center gap-1"
          >
            Ver todos los vehículos disponibles
            {showAllVehiculos ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {/* Listado de vehículos */}
          {showAllVehiculos && disponibles.length > 0 && (
            <div className="space-y-2 mt-3 pt-3 border-t border-yellow-200 dark:border-yellow-700">
              {disponibles.map((vehiculo) => (
                <VehicleOption
                  key={vehiculo.id}
                  vehiculo={vehiculo}
                  isSelected={selectedVehiculoId === vehiculo.id}
                  onSelect={() => onSelectVehiculo(vehiculo.id)}
                  warning
                />
              ))}
            </div>
          )}
        </div>
      </Card>
    );
  }

  // En modo edición, mostrar incluso si no hay recomendación
  // Si hay vehículo seleccionado, mostrar (sin depender de pesoTotal que cambia dinámicamente)
  const hasBackendData = Boolean(selectedVehiculoId);
  if (!recomendado && !hasBackendData) {
    return null;
  }

  // En modo edición, usar datos del backend en lugar del recomendado
  // Buscar en disponibles primero, luego en todosVehiculos (para edit mode cuando disponibles está vacío)
  const vehiculoParaMostrar =
    recomendado ||
    disponibles.find((v) => v.id === selectedVehiculoId) ||
    todosVehiculos.find((v) => v.id === selectedVehiculoId);

  // Calcular color según porcentaje de uso
  const getCapacityColor = (porcentaje: number) => {
    if (porcentaje <= 50) return 'bg-green-500';
    if (porcentaje <= 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getCapacityTextColor = (porcentaje: number) => {
    if (porcentaje <= 50)
      return 'text-green-600 dark:text-green-400';
    if (porcentaje <= 80)
      return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  if (!vehiculoParaMostrar) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* Vehículo Recomendado o Seleccionado (edit mode) */}
      <Card className="p-5 bg-gradient-to-r from-green-50 to-green-50/50 dark:from-slate-900 dark:to-slate-900/50 border-green-200 dark:border-green-800 border-2">
        <div className="space-y-4">
          {/* Encabezado */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <Truck className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                  ✨ {vehiculoActual?.id === recomendado?.id ? 'Vehículo Recomendado' : 'Vehículo Seleccionado'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {recomendado ? 'Selecciona para continuar' : 'Datos de edición'}
                </p>
              </div>
            </div>
            <Badge className={`${vehiculoActual?.id === recomendado?.id ? 'bg-green-600 dark:bg-green-700 text-white' : 'bg-blue-600 dark:bg-blue-700 text-white'} hover:bg-opacity-90`}>
              {vehiculoActual?.id === recomendado?.id ? 'ÓPTIMO' : 'SELECCIONADO'}
            </Badge>
          </div>

          {/* Detalles del vehículo */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                Placa
              </p>
              <p className="text-base font-bold text-gray-900 dark:text-white">
                {vehiculoActual?.placa}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                Modelo
              </p>
              <p className="text-base font-bold text-gray-900 dark:text-white">
                {vehiculoActual?.marca} {vehiculoActual?.modelo}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                Capacidad
              </p>
              <p className="text-base font-bold text-gray-900 dark:text-white">
                {vehiculoActual?.capacidad_kg} kg
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                Carga Total
              </p>
              <p className="text-base font-bold text-gray-900 dark:text-white">
                {pesoTotal.toFixed(1)} kg
              </p>
            </div>
          </div>
          {/* Barra de capacidad */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Uso de Capacidad
              </span>
              <div className="flex flex-col items-end gap-0.5">
                {/* ✅ Mostrar porcentaje dinámico basado en pesoTotal actual */}
                <span
                  className={`text-sm font-bold ${getCapacityTextColor(
                    capacidadDinamica.porcentaje
                  )}`}
                >
                  {capacidadDinamica.porcentaje}%
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {Math.round(capacidadDinamica.pesoCalculado)} / {Number(vehiculoActual?.capacidad_kg ?? 0)} kg
                </span>
              </div>
            </div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${getCapacityColor(
                  capacidadDinamica.porcentaje
                )}`}
                style={{ width: `${capacidadDinamica.porcentaje}%` }}
              ></div>
            </div>
          </div>

          {/* Sección de Chofer */}
          <div className="space-y-3 pt-3 border-t border-green-200 dark:border-green-700">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-green-600 dark:text-green-400" />
              <h4 className="font-semibold text-gray-900 dark:text-white">Chofer Asignado</h4>
            </div>

            {/* Chofer por defecto */}
            {!seleccionarChoferManualmente && (
              <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-green-200 dark:border-green-700">
                {vehiculoActual?.choferAsignado ? (
                  <>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Chofer del vehículo:
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {vehiculoActual.choferAsignado.nombre || vehiculoActual.choferAsignado.name}
                    </p>
                    {vehiculoActual.choferAsignado.telefono && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Tel: {vehiculoActual.choferAsignado.telefono}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    Sin chofer asignado al vehículo - Selecciona uno manualmente
                  </p>
                )}
              </div>
            )}

            {/* Checkbox para seleccionar manualmente */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={seleccionarChoferManualmente}
                onChange={(e) => setSeleccionarChoferManualmente(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 dark:border-slate-600"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Seleccionar chofer manualmente
              </span>
            </label>

            {/* SearchSelect de choferes si está marcado */}
            {seleccionarChoferManualmente && (
              <SearchSelect
                placeholder="Busca y selecciona un chofer..."
                searchPlaceholder="Buscar por nombre o teléfono..."
                value={selectedChoferId || ''}
                options={choferesOptions}
                onChange={(value) => {
                  if (value && onSelectChofer) {
                    onSelectChofer(parseInt(String(value)));
                  }
                }}
                allowClear={true}
                emptyText="No se encontraron choferes"
              />
            )}
          </div>

          {/* Sección de Entregador */}
          <div className="space-y-3 pt-3 border-t border-green-200 dark:border-green-700">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h4 className="font-semibold text-gray-900 dark:text-white">Entregador</h4>
            </div>

            {/* Checkbox para seleccionar entregador */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={seleccionarEntregadorManualmente}
                onChange={(e) => setSeleccionarEntregadorManualmente(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 dark:border-slate-600"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Seleccionar entregador
              </span>
            </label>

            {/* SearchSelect de entregadores si está marcado */}
            {seleccionarEntregadorManualmente && (
              <SearchSelect
                placeholder="Busca y selecciona un entregador..."
                searchPlaceholder="Buscar por nombre o teléfono..."
                value={selectedEntregadorId || ''}
                options={entregadoresOptions}
                onChange={(value) => {
                  if (value && onSelectEntregador) {
                    onSelectEntregador(parseInt(String(value)));
                  }
                }}
                allowClear={true}
                emptyText="No se encontraron entregadores"
              />
            )}
          </div>

          

          {/* Sección Otras Opciones - Collapsible dentro del card */}
          {(() => {
            const vehiculosParaListado = disponibles.length > 0 ? disponibles : todosVehiculos;
            return vehiculosParaListado.length > 1 ? (
              <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-slate-700">
                <button
                  onClick={() => setShowAllVehiculos(!showAllVehiculos)}
                  className="w-full flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Otras opciones de vehiculos ({vehiculosParaListado.length})
                    </span>
                  </div>
                  {showAllVehiculos ? (
                    <ChevronUp className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  )}
                </button>

                {/* Listado de otras opciones - dentro del card */}
                {showAllVehiculos && (
                  <div className="space-y-1.5">
                    {vehiculosParaListado
                      .filter((v) => v.id !== recomendado?.id) // Excluir recomendado
                      .map((vehiculo) => (
                        <VehicleOption
                          key={vehiculo.id}
                          vehiculo={vehiculo}
                          isSelected={selectedVehiculoId === vehiculo.id}
                          isRecommended={false}
                          onSelect={() => {
                            onSelectVehiculo(vehiculo.id);
                            // Auto-seleccionar el chofer asignado del vehículo
                            if (vehiculo.choferAsignado && onSelectChofer) {
                              onSelectChofer(vehiculo.choferAsignado.id);
                              // Resetear el estado de "Seleccionar manualmente"
                              setSeleccionarChoferManualmente(false);
                            }
                          }}
                        />
                      ))}
                  </div>
                )}
              </div>
            ) : null;
          })()}

        </div>
      </Card>

    </div>
  );
}

/**
 * Componente para mostrar una opción de vehículo individual
 */
function VehicleOption({
  vehiculo,
  isSelected,
  onSelect,
  warning = false,
  isRecommended = false,
}: {
  vehiculo: VehiculoRecomendado;
  isSelected: boolean;
  onSelect: () => void;
  warning?: boolean;
  isRecommended?: boolean;
}) {
  const getStatusColor = () => {
    if (warning || vehiculo.estado === 'excede_capacidad')
      return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
    if (isRecommended)
      return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
    return 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700';
  };

  return (
    <button
      onClick={onSelect}
      className={`w-full p-3 rounded-lg border transition-all text-left ${getStatusColor()} ${isSelected ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''
        }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-semibold text-gray-900 dark:text-white text-sm">
              {vehiculo.placa} • {vehiculo.marca} {vehiculo.modelo}
            </p>
            {isRecommended && (
              <Badge className="bg-green-600 dark:bg-green-700 text-xs">
                ⭐ RECOMENDADO
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
            <span>{vehiculo.capacidad_kg} kg</span>
            <span>•</span>
            <span
              className={
                (vehiculo.porcentaje_uso_actual ?? 0) > 80
                  ? 'text-red-600 dark:text-red-400 font-semibold'
                  : ''
              }
            >
              {vehiculo.porcentaje_uso_actual ?? 0}% uso
            </span>
          </div>
        </div>
        {isSelected && <Check className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
      </div>
    </button>
  );
}
