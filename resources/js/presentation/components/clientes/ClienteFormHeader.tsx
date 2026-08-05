import type { Cliente } from '@/domain/entities/clientes';

interface ClienteFormHeaderProps {
    cliente?: Cliente | null;
    isEditing: boolean;
}

export default function ClienteFormHeader({ cliente, isEditing }: ClienteFormHeaderProps) {
    if (!isEditing || !cliente) {
        return (
            <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 px-6 py-4 dark:border-blue-800 dark:bg-blue-950/20">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-200 dark:bg-blue-800">
                        <span className="text-xl">➕</span>
                    </div>
                    <div>
                        <h3 className="font-semibold text-blue-900 dark:text-blue-100">Nuevo Cliente</h3>
                        <p className="text-sm text-blue-700 dark:text-blue-300">Completa el formulario para crear un nuevo cliente</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mb-6 rounded-lg border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 dark:border-amber-800 dark:from-amber-950/20 dark:to-orange-950/20">
            <div className="flex items-center gap-4">
                {/* Foto del cliente */}
                <div className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 border-amber-200 bg-gray-200 dark:border-amber-700 dark:bg-gray-700">
                    {cliente.foto_perfil ? (
                        <>
                            <img
                                src={`/storage/${cliente.foto_perfil}`}
                                alt={cliente.nombre}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    const fallback = e.currentTarget.nextElementSibling;
                                    if (fallback) (fallback as HTMLElement).style.display = 'flex';
                                }}
                            />
                            <div className="absolute inset-0 flex hidden items-center justify-center bg-gray-200 text-2xl dark:bg-gray-700">👤</div>
                        </>
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-2xl">👤</div>
                    )}
                </div>

                {/* Información del cliente */}
                <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                        <h3 className="text-lg font-bold text-amber-900 dark:text-amber-100">{cliente.nombre}</h3>
                        <span className="rounded-full bg-amber-200 px-2 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-800 dark:text-amber-200">
                            {cliente.codigo_cliente}
                        </span>
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-sm items-end">
                        <div>
                            <span className="text-amber-700 dark:text-amber-400">Teléfono:</span>
                            <p className="font-medium text-amber-900 dark:text-amber-100">{cliente.telefono || '—'}</p>
                        </div>
                        <div>
                            <span className="text-amber-700 dark:text-amber-400">Localidad:</span>
                            <p className="font-medium text-amber-900 dark:text-amber-100">
                                {typeof cliente.localidad === 'object' && cliente.localidad?.nombre ? cliente.localidad.nombre : '—'}
                            </p>
                        </div>
                        <div>
                            <span className="text-amber-700 dark:text-amber-400">Registro:</span>
                            <p className="font-medium text-amber-900 dark:text-amber-100">
                                {cliente.fecha_registro ? new Date(String(cliente.fecha_registro)).toLocaleDateString('es-ES') : '—'}
                            </p>
                        </div>
                        {cliente.razon_social && (
                            <div className="mt-2 text-sm">
                                <span className="text-amber-700 dark:text-amber-400">Razón Social:</span>
                                <p className="font-medium text-amber-900 dark:text-amber-100">{cliente.razon_social}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Estado del cliente */}
                <div className="text-right">
                    <div className="mb-2 text-xs text-amber-600 dark:text-amber-400">Estado</div>
                    <div className="flex flex-col gap-2">
                        <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                cliente.activo
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}
                        >
                            {cliente.activo ? '✓ Activo' : '✗ Inactivo'}
                        </span>
                        {cliente.puede_tener_credito && (
                            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                💳 Con Crédito
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
