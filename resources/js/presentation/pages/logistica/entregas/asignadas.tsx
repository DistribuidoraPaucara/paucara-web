import { useState, useEffect, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/presentation/components/ui/dialog';
import SearchSelect from '@/presentation/components/ui/search-select';
import { toast } from 'react-toastify';
import {
    Truck,
    User,
    Package,
    Clock,
    ChevronRight,
    Plus,
    Weight,
} from 'lucide-react';
import logisticaService, { type Entrega, type FiltrosEntregas } from '@/infrastructure/services/logistica.service';
import type { Id } from '@/domain/entities/shared';
import { PageHeader } from '@/presentation/components/entrega/PageHeader';
import { EntregaListFilters } from '@/presentation/components/entrega/EntregaListFilters';
import { EntregaEstadoBadge } from '@/presentation/components/entrega/EntregaEstadoBadge';
import { LoadingState } from '@/presentation/components/entrega/LoadingState';
import { EmptyState } from '@/presentation/components/entrega/EmptyState';

interface Props {
    entregas?: Entrega[];
    estadisticas?: {
        entregas_asignadas: number;
        entregas_en_transito: number;
    };
}

interface AsignacionFormData {
    chofer_id: Id;
    vehiculo_id: Id;
}

interface Vehiculo {
    id: Id;
    placa: string;
    marca: string;
    modelo: string;
    estado?: string;
}

interface Chofer {
    id: Id;
    nombre: string;
    email: string;
}

export default function EntregasAsignadas({ entregas: initialEntregas = [] }: Props) {
    const [entregas, setEntregas] = useState<Entrega[]>(initialEntregas);
    const [loading, setLoading] = useState(false);
    const [filtros, setFiltros] = useState<FiltrosEntregas>({});
    const [showFilters, setShowFilters] = useState(false);
    const [mostraAsignacionModal, setMostrarAsignacionModal] = useState(false);
    const [entregaSeleccionada, setEntregaSeleccionada] = useState<Entrega | null>(null);
    const [vehículos, setVehículos] = useState<Vehiculo[]>([]);
    const [choferes, setChoferes] = useState<Chofer[]>([]);
    const [datosAsignacion, setDatosAsignacion] = useState<AsignacionFormData>({
        chofer_id: 0,
        vehiculo_id: 0,
    });
    const [asignandoId, setAsignandoId] = useState<Id | null>(null);

    // Cargar entregas
    const cargarEntregas = useCallback(async () => {
        setLoading(true);
        try {
            const resultado = await logisticaService.obtenerEntregasAsignadas(1, filtros);
            setEntregas(resultado.data);
        } catch (error) {
            toast.error('Error al cargar entregas');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [filtros]);

    useEffect(() => {
        cargarEntregas();
    }, [cargarEntregas]);

    // Cargar vehículos y choferes al abrir modal
    useEffect(() => {
        if (mostraAsignacionModal) {
            cargarVehiculosYChoferes();
        }
    }, [mostraAsignacionModal]);

    const cargarVehiculosYChoferes = async () => {
        try {
            const [vehiculosData, choferesData] = await Promise.all([
                logisticaService.obtenerVehiculosDisponibles(),
                logisticaService.obtenerChoferesDisponibles(),
            ]);
            setVehículos(vehiculosData);
            setChoferes(choferesData);
        } catch (error) {
            toast.error('Error al cargar opciones de asignación');
            console.log(error);
        }
    };

    const abrirModalAsignacion = (entrega: Entrega) => {
        setEntregaSeleccionada(entrega);
        setDatosAsignacion({
            chofer_id: entrega.chofer_id || 0,
            vehiculo_id: entrega.vehiculo_id || 0,
        });
        setMostrarAsignacionModal(true);
    };

    const cerrarModalAsignacion = () => {
        setMostrarAsignacionModal(false);
        setEntregaSeleccionada(null);
        setDatosAsignacion({ chofer_id: 0, vehiculo_id: 0 });
    };

    const asignarEntrega = async () => {
        if (!entregaSeleccionada) return;

        const errores = logisticaService.validateAsignarEntrega(datosAsignacion);
        if (errores.length > 0) {
            errores.forEach(error => toast.error(error));
            return;
        }

        setAsignandoId(entregaSeleccionada.id);
        try {
            await logisticaService.asignarEntrega(entregaSeleccionada.id, datosAsignacion);
            cerrarModalAsignacion();
            cargarEntregas();
        } catch (error) {
            console.error(error);
        } finally {
            setAsignandoId(null);
        }
    };

    const handleFiltroChange = (key: keyof FiltrosEntregas, value: string) => {
        const nuevosFiltros = { ...filtros, [key]: value || undefined };
        setFiltros(nuevosFiltros);
    };

    const limpiarFiltros = () => {
        setFiltros({});
        setShowFilters(false);
    };

    return (
        <AppLayout>
            <Head title="Entregas Asignadas" />
            <div className="space-y-6 p-4">
                {/* Header */}
                <PageHeader
                    title="Entregas Asignadas"
                    description="Gestiona y asigna entregas a choferes"
                />

                {/* Filtros */}
                {/* Fase 3.6: Usar hook dinámico en EntregaListFilters para estado options */}
                <EntregaListFilters
                    filtros={filtros}
                    onFiltroChange={handleFiltroChange}
                    onLimpiar={limpiarFiltros}
                    showFilters={showFilters}
                    onToggleFilters={() => setShowFilters(!showFilters)}
                />

                {/* Entregas */}
                <div className="space-y-3">
                    {loading ? (
                        <LoadingState variant="card" count={3} />
                    ) : entregas.length === 0 ? (
                        <EmptyState
                            icon={Package}
                            title="No hay entregas asignadas"
                        />
                    ) : (
                        entregas.map((entrega) => (
                            <Card key={entrega.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="pt-6">
                                    <div className="space-y-4">
                                        {/* Header entrega */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-lg">{entrega.numero_entrega || `Entrega #${entrega.id}`}</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {entrega.proforma_id ? `Proforma: #${entrega.proforma_id}` : `${entrega.ventas?.length || 0} ventas`}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <EntregaEstadoBadge estado={entrega.estado} />
                                            </div>
                                        </div>

                                        {/* Detalles */}
                                        <div className="grid md:grid-cols-3 gap-4 border-y py-4">
                                            {/* Chofer */}
                                            <div className="flex items-center gap-3">
                                                <User className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                                <div className="min-w-0">
                                                    <p className="text-xs text-muted-foreground">Chofer</p>
                                                    <p className="font-medium truncate">
                                                        {entrega.chofer?.nombre || (entrega.chofer_id ? `#${entrega.chofer_id}` : 'No asignado')}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Vehículo */}
                                            <div className="flex items-center gap-3">
                                                <Truck className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                                <div className="min-w-0">
                                                    <p className="text-xs text-muted-foreground">Vehículo</p>
                                                    <p className="font-medium truncate">
                                                        {entrega.vehiculo?.placa || (entrega.vehiculo_id ? `#${entrega.vehiculo_id}` : 'No asignado')}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Peso */}
                                            <div className="flex items-center gap-3">
                                                <Weight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                                <div>
                                                    <p className="text-xs text-muted-foreground">Peso</p>
                                                    <p className="font-medium">
                                                        {entrega.peso_kg ? `${entrega.peso_kg} kg` : '-'}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Fecha asignación */}
                                            {entrega.fecha_asignacion && (
                                                <div className="flex items-center gap-3">
                                                    <Clock className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Asignada</p>
                                                        <p className="font-medium text-sm">
                                                            {new Date(entrega.fecha_asignacion).toLocaleDateString('es-ES')}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Total general */}
                                            <div>
                                                <p className="text-xs text-muted-foreground">Total</p>
                                                <p className="font-medium">
                                                    Bs. {(entrega.total_general || entrega.total_consolidado || 0).toFixed(2)}
                                                </p>
                                            </div>

                                            {/* Cantidad de ventas */}
                                            <div>
                                                <p className="text-xs text-muted-foreground">Ventas</p>
                                                <p className="font-medium">
                                                    {entrega.ventas?.length || entrega.cantidad_ventas || 0}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Acciones */}
                                        <div className="flex gap-2 justify-end">
                                            {(!entrega.chofer_id || !entrega.vehiculo_id) && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => abrirModalAsignacion(entrega)}
                                                    className="gap-2"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                    Asignar
                                                </Button>
                                            )}
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="gap-2"
                                                onClick={() => window.location.href = `/logistica/entregas/${entrega.id}`}
                                            >
                                                Ver detalles
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>

            {/* Modal Asignación */}
            <Dialog open={mostraAsignacionModal} onOpenChange={setMostrarAsignacionModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Asignar Entrega #{entregaSeleccionada?.id}</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* Seleccionar Chofer */}
                        <SearchSelect
                            label="Chofer"
                            placeholder="Buscar chofer..."
                            value={datosAsignacion.chofer_id}
                            options={choferes.map((chofer) => ({
                                value: chofer.id,
                                label: chofer.name,
                                description: chofer.email,
                            }))}
                            onChange={(value) => setDatosAsignacion({
                                ...datosAsignacion,
                                chofer_id: value,
                            })}
                        />

                        {/* Seleccionar Vehículo */}
                        <SearchSelect
                            label="Vehículo"
                            placeholder="Buscar vehículo..."
                            value={datosAsignacion.vehiculo_id}
                            options={vehículos.map((vehiculo) => ({
                                value: vehiculo.id,
                                label: vehiculo.placa,
                                description: `${vehiculo.marca} ${vehiculo.modelo}`,
                            }))}
                            onChange={(value) => setDatosAsignacion({
                                ...datosAsignacion,
                                vehiculo_id: value,
                            })}
                        />
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={cerrarModalAsignacion}
                            disabled={asignandoId === entregaSeleccionada?.id}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={asignarEntrega}
                            disabled={asignandoId === entregaSeleccionada?.id}
                            className="gap-2"
                        >
                            {asignandoId === entregaSeleccionada?.id ? 'Asignando...' : 'Asignar'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
