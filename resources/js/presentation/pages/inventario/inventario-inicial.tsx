import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import NotificationService from '@/infrastructure/services/notification.service';
import { AlertCircle, Info, Save, HelpCircle, X } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/presentation/components/ui/tabs';
import ModoManual from './components/modo-manual';
import ModoTabla from './components/modo-tabla';
import ModoImportacion from './components/modo-importacion';
import InventarioInicialAvanzado from './inventario-inicial-avanzado';
import { store as storeInventarioInicial } from '@/routes/inventario/inicial';
import { TipoAjusteInventario } from '@/domain/entities/tipos-ajuste-inventario';
import { InventarioItem } from '@/domain/entities/inventario-inicial';
import { Almacen } from '@/domain/entities/almacenes';


interface Borrador {
    id: number;
    usuario_id: number;
    usuario_nombre: string;
    usuario_email: string;
    cantidad_items: number;
    created_at: string;
    updated_at: string;
    es_tuyo: boolean;
}

interface Props {
    almacenes: Almacen[];
    tipoInventarioInicial?: TipoAjusteInventario;
    borradores?: Borrador[];
}

export default function InventarioInicial({ almacenes, tipoInventarioInicial, borradores = [] }: Props) {
    const { data, setData, post, processing } = useForm<{ items: InventarioItem[] }>({
        items: []
    });

    const [showHelp, setShowHelp] = useState(false);
    const [tabActivo, setTabActivo] = useState('avanzado');
    const [borradorSeleccionado, setBorradorSeleccionado] = useState<number | null>(null);

    const agregarItem = () => {
        setData('items', [
            ...data.items,
            {
                producto_id: '',
                almacen_id: '',
                cantidad: '',
                lote: '',
                fecha_vencimiento: '',
                observaciones: ''
            }
        ]);
    };

    const eliminarItem = (index: number) => {
        const newItems = data.items.filter((_, i) => i !== index);
        setData('items', newItems);
    };

    const actualizarItem = (index: number, field: keyof InventarioItem, value: unknown) => {
        const newItems = [...data.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setData('items', newItems);
    };

    const cargarItemsImportados = (items: InventarioItem[]) => {
        setData('items', [...data.items, ...items]);
    };

    const validarYGuardar = async () => {
        try {
            // Validaciones
            if (data.items.length === 0) {
                NotificationService.error('Debe agregar al menos un item');
                return;
            }

            const errores: string[] = [];

            data.items.forEach((item, index) => {
                if (!item.producto_id) {
                    errores.push(`Item ${index + 1}: Debe seleccionar un producto`);
                }
                if (!item.almacen_id) {
                    errores.push(`Item ${index + 1}: Debe seleccionar un almacén`);
                }
                // Convertir cantidad a número y validar
                const cantidad = Number(item.cantidad);
                if (!item.cantidad || isNaN(cantidad) || cantidad <= 0) {
                    errores.push(`Item ${index + 1}: La cantidad debe ser un número mayor a 0`);
                }
            });

            if (errores.length > 0) {
                errores.forEach(err => NotificationService.error(err));
                return;
            }

            // Confirmar antes de guardar
            const confirmado = await NotificationService.confirm(
                'Esta acción registrará el inventario inicial en los almacenes seleccionados.',
                {
                    title: `¿Confirmar carga de ${data.items.length} items?`,
                    confirmText: 'Sí, cargar inventario',
                    cancelText: 'Cancelar'
                }
            );

            if (!confirmado) return;

            // Enviar al backend
            post(storeInventarioInicial().url, {
                onSuccess: () => {
                    NotificationService.success('Inventario inicial cargado exitosamente');
                    setData('items', []);
                },
                onError: (errorsResponse: unknown) => {
                    console.error('Errores del backend:', errorsResponse);

                    // Manejar diferentes tipos de errores
                    if (errorsResponse && typeof errorsResponse === 'object') {
                        if (Array.isArray(errorsResponse)) {
                            // Si es un array
                            errorsResponse.forEach((error: string) => {
                                NotificationService.error(String(error));
                            });
                        } else {
                            // Si es un objeto
                            Object.entries(errorsResponse).forEach(([key, value]: [string, unknown]) => {
                                console.log('Manejando error de campo:', key, value);
                                const errorMsg = Array.isArray(value) ? value[0] : String(value);
                                NotificationService.error(errorMsg);
                            });
                        }
                    } else {
                        NotificationService.error('Error desconocido al guardar. Por favor, intenta de nuevo.');
                    }
                }
            });
        } catch (error) {
            console.error('Error en validarYGuardar:', error);
            NotificationService.error('Error inesperado. Revisa la consola para más detalles.');
        }
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Inventario', href: '/inventario' },
            { title: 'Carga Inicial', href: '/inventario/inventario-inicial' }
        ]}>
            <Head title={borradorSeleccionado ? `Editar Inventario Inicial #${borradorSeleccionado}` : "Carga Masiva de Inventario Inicial"} />

            <div className="flex flex-col h-full gap-4">
                {/* Breadcrumb actualizado */}
                {borradorSeleccionado && (
                    <div className="px-6 text-sm">
                        <button
                            onClick={() => setBorradorSeleccionado(null)}
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                        >
                            ← Volver a la lista
                        </button>
                    </div>
                )}

                {/* Header con título y botón de ayuda */}
                <div className="flex items-center justify-between px-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                            {borradorSeleccionado ? 'Continuar Carga de Inventario' : 'Cargar Inventario'}
                        </h1>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            {borradorSeleccionado && `Borrador #${borradorSeleccionado} • `}
                            {data.items.length} item{data.items.length !== 1 ? 's' : ''} agregado{data.items.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {tabActivo !== 'avanzado' && (
                            <Button
                                variant="outline"
                                onClick={() => setTabActivo('avanzado')}
                                title="Ir al módulo avanzado con escáner de códigos de barras"
                            >
                                Modo Avanzado
                            </Button>
                        )}
                        {/* {tabActivo === 'avanzado' && (
                            <Button
                                variant="outline"
                                onClick={() => setTabActivo('manual')}
                                title="Volver al módulo manual simple"
                            >
                                Modo Manual
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowHelp(!showHelp)}
                            className="rounded-full"
                            title="Ver información y ayuda"
                        >
                            <HelpCircle className="h-6 w-6 text-purple-600" />
                        </Button> */}
                    </div>
                </div>

                {/* Borradores en Progreso - Solo mostrar si NO estamos editando uno */}
                {!borradorSeleccionado && borradores.length > 0 && (
                    <div className="px-6">
                        <Card className={borradores.some(b => b.es_tuyo)
                            ? "border-blue-300 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-700"
                            : "border-amber-300 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-700"}>
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <Info className={`h-5 w-5 ${borradores.some(b => b.es_tuyo) ? 'text-blue-600' : 'text-amber-600'}`} />
                                        <div>
                                            <CardTitle className="text-base">Inventarios Iniciales en Progreso</CardTitle>
                                            <CardDescription className="text-xs">
                                                {borradores.length} borrador{borradores.length !== 1 ? 'es' : ''} en edición
                                            </CardDescription>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {borradores.map((borrador) => (
                                    <div
                                        key={borrador.id}
                                        className={`p-3 rounded-lg border flex items-center justify-between ${borrador.es_tuyo
                                                ? 'bg-white dark:bg-slate-900 border-blue-200 dark:border-blue-800'
                                                : 'bg-white dark:bg-slate-900 border-amber-200 dark:border-amber-800'
                                            }`}
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-sm text-slate-900 dark:text-slate-100">
                                                    {borrador.usuario_nombre}
                                                </span>
                                                {borrador.es_tuyo && (
                                                    <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                                                        Tu borrador
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                <div>{borrador.cantidad_items} producto{borrador.cantidad_items !== 1 ? 's' : ''} cargado{borrador.cantidad_items !== 1 ? 's' : ''}</div>
                                                <div>Actualizado: {borrador.updated_at}</div>
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant={borrador.es_tuyo ? "default" : "outline"}
                                            onClick={() => {
                                                if (borrador.es_tuyo) {
                                                    setBorradorSeleccionado(borrador.id);
                                                    setTabActivo('avanzado');
                                                }
                                            }}
                                            className="ml-3 flex-shrink-0"
                                            disabled={!borrador.es_tuyo}
                                        >
                                            {borrador.es_tuyo ? 'Continuar' : 'Es de otro usuario'}
                                        </Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Tabs */}
                <div className="px-6 flex-1 flex flex-col overflow-hidden">
                    <Tabs value={tabActivo} onValueChange={setTabActivo} className="h-full flex flex-col">
                        <TabsList className="w-full justify-start mb-4">
                            <TabsTrigger value="avanzado" className="gap-2">
                                Modo Avanzado
                            </TabsTrigger>
                            <TabsTrigger value="manual" className="gap-2">
                                Formulario Manual
                            </TabsTrigger>
                            <TabsTrigger value="tabla" className="gap-2">
                                Tabla Editable
                            </TabsTrigger>
                            <TabsTrigger value="importar" className="gap-2">
                                Importar Archivo
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="manual" className="space-y-4 flex-1 overflow-auto">
                            <ModoManual
                                items={data.items}
                                almacenes={almacenes}
                                onAgregarItem={agregarItem}
                                onEliminarItem={eliminarItem}
                                onActualizarItem={actualizarItem}
                                onGuardar={validarYGuardar}
                                processing={processing}
                            />
                        </TabsContent>

                        <TabsContent value="tabla" className="flex-1 overflow-hidden flex flex-col">
                            <ModoTabla
                                items={data.items}
                                almacenes={almacenes}
                                onAgregarItem={agregarItem}
                                onActualizarItem={actualizarItem}
                                onEliminarItem={eliminarItem}
                                onGuardar={validarYGuardar}
                                processing={processing}
                            />
                        </TabsContent>

                        <TabsContent value="importar" className="space-y-4 flex-1 overflow-auto">
                            <ModoImportacion
                                almacenes={almacenes}
                                onCargarItems={cargarItemsImportados}
                            />
                        </TabsContent>

                        <TabsContent value="avanzado" className="flex-1 overflow-hidden flex flex-col">
                            <InventarioInicialAvanzado
                                almacenes={almacenes}
                                borradorId={borradorSeleccionado}
                            />
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Botones de acción globales */}
                {data.items.length > 0 && (
                    <div className="flex justify-end gap-3 p-6 border-t bg-white dark:bg-slate-950">
                        <Button
                            variant="outline"
                            onClick={() => router.visit('/inventario')}
                            disabled={processing}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={validarYGuardar}
                            disabled={processing || data.items.length === 0}
                        >
                            {processing ? (
                                <>
                                    <span className="mr-2">Procesando...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Cargar Inventario Inicial ({data.items.length} items)
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </div>

            {/* Floating Help Panel */}
            {showHelp && (
                <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
                    <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <div className="flex items-center gap-2">
                                <Info className="h-6 w-6 text-purple-600" />
                                <div>
                                    <CardTitle>Información de Ayuda</CardTitle>
                                    <CardDescription>Carga Masiva de Inventario Inicial</CardDescription>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowHelp(false)}
                                className="h-8 w-8"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 space-y-2">
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                                    <div className="space-y-2">
                                        {tipoInventarioInicial && (
                                            <>
                                                <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
                                                    Tipo de ajuste: {tipoInventarioInicial.label}
                                                </p>
                                                <p className="text-xs text-purple-700 dark:text-purple-300">
                                                    {tipoInventarioInicial.descripcion}
                                                </p>
                                            </>
                                        )}
                                        <ul className="text-xs text-purple-700 dark:text-purple-300 space-y-1 list-disc list-inside">
                                            <li>Usa este módulo solo UNA VEZ al implementar el sistema</li>
                                            <li>Registra el stock real que tienes actualmente en cada almacén</li>
                                            <li>Puedes filtrar estos movimientos en reportes para ver solo operaciones del día a día</li>
                                            <li>Si un producto ya tiene inventario inicial, se agregará como ajuste adicional</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </AppLayout>
    );
}
