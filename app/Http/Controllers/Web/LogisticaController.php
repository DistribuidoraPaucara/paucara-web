<?php
namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Entrega;
use App\Models\EstadoLogistica;
use App\Models\Localidad;
use App\Models\Proforma;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class LogisticaController extends Controller
{
    /**
     * Dashboard principal de logística
     */
    public function dashboard()
    {
        // ✅ NUEVO 2026-03-06: Log para verificar parámetros de entrada
        Log::info('LogisticaController::dashboard - Parámetros recibidos:', [
            'fecha_entrega_solicitada_desde' => request('fecha_entrega_solicitada_desde'),
            'fecha_entrega_solicitada_hasta' => request('fecha_entrega_solicitada_hasta'),
            'todos_los_params'               => request()->query(),
        ]);

        // proformas recientes con paginación y filtros
        // Mostrar TODAS las proformas, no solo APP_EXTERNA
        // ✅ ACTUALIZADO: Cargar roles del usuarioCreador
        // ✅ NUEVO: Cargar venta asociada cuando proforma está convertida
        $query = Proforma::with(['cliente.localidad', 'usuarioCreador.roles', 'usuarioAprobador', 'estadoLogistica', 'direccionSolicitada.localidad', 'venta']);

        // Aplicar filtros desde query params - default a PENDIENTE y APROBADA
        if (request()->has('estado')) {
            if (request('estado') !== 'TODOS') {
                // Filtro específico solicitado
                $estadoCodigo = request('estado');
                $estadoId     = Proforma::obtenerIdEstado($estadoCodigo, 'proforma');
                if ($estadoId) {
                    $query->where('estado_proforma_id', $estadoId);
                }
            }
            // Si estado === 'TODOS', no aplicar filtro (mostrar todos)
        } else {
            // Default: mostrar BORRADOR, PENDIENTE y APROBADA si no se proporciona filtro de estado
            $estadoBorradorId  = Proforma::obtenerIdEstado('BORRADOR', 'proforma');
            $estadoPendienteId = Proforma::obtenerIdEstado('PENDIENTE', 'proforma');
            $estadoAprobadaId  = Proforma::obtenerIdEstado('APROBADA', 'proforma');
            $estadoIds         = array_filter([$estadoBorradorId, $estadoPendienteId, $estadoAprobadaId]);
            if (! empty($estadoIds)) {
                $query->whereIn('estado_proforma_id', $estadoIds);
            }
        }

        // ✅ Búsqueda case-insensitive: ID, número, cliente, CI, teléfono, código_cliente, preventista
        if (request()->has('search') && request('search') !== '') {
            $search = strtolower(request('search'));
            $query->where(function ($q) use ($search) {
                // Búsqueda en ID (solo si es numérico)
                if (is_numeric($search)) {
                    $q->where('id', (int) $search);
                }
                // Búsqueda en número de proforma
                $q->orWhereRaw('LOWER(numero) like ?', ["%{$search}%"])
                // Búsqueda en cliente (nombre, CI, teléfono, código_cliente)
                    ->orWhereHas('cliente', function ($clienteQuery) use ($search) {
                        $clienteQuery->where(function ($innerQuery) use ($search) {
                            $innerQuery->whereRaw('LOWER(nombre) like ?', ["%{$search}%"])
                                ->orWhereRaw('LOWER(nit) like ?', ["%{$search}%"])
                                ->orWhereRaw('LOWER(telefono) like ?', ["%{$search}%"])
                                ->orWhereRaw('LOWER(codigo_cliente) like ?', ["%{$search}%"]);
                        });
                    })
                // Búsqueda en preventista (usuario que creó la proforma)
                    ->orWhereHas('usuarioCreador', function ($preventistaQuery) use ($search) {
                        $preventistaQuery->whereRaw('LOWER(name) like ?', ["%{$search}%"]);
                    });
            });
        }

        // ✅ Filtro por localidad
        if (request()->has('localidad_id') && request('localidad_id') !== '' && request('localidad_id') !== '0') {
            $localidadId = request('localidad_id');
            $query->whereHas('cliente', function ($clienteQuery) use ($localidadId) {
                $clienteQuery->where('localidad_id', $localidadId);
            });
        }

        // ✅ Filtro por tipo de entrega (DELIVERY/PICKUP)
        if (request()->has('tipo_entrega') && request('tipo_entrega') !== '' && request('tipo_entrega') !== 'TODOS') {
            $query->where('tipo_entrega', request('tipo_entrega'));
        }

        // ✅ Filtro por política de pago
        if (request()->has('politica_pago') && request('politica_pago') !== '' && request('politica_pago') !== 'TODOS') {
            $query->where('politica_pago', request('politica_pago'));
        }

        // ✅ Filtro por estado logístico
        if (request()->has('estado_logistica_id') && request('estado_logistica_id') !== '' && request('estado_logistica_id') !== '0') {
            $estadoId = request('estado_logistica_id');
            \Log::info('🔍 [LogisticaController] Filtrando por estado_logistica_id', [
                'estado_logistica_id_recibido' => $estadoId,
                'buscando_en_columna' => 'estado_proforma_id',
                'total_proformas_antes_filtro' => $query->count(),
            ]);

            $query->where('estado_proforma_id', $estadoId);

            \Log::info('📊 [LogisticaController] Resultado después del filtro', [
                'estado_logistica_id' => $estadoId,
                'total_proformas_encontradas' => $query->count(),
            ]);
        }

        // ✅ Filtro por coordinación completada
        if (request()->has('coordinacion_completada') && request('coordinacion_completada') !== '' && request('coordinacion_completada') !== 'TODOS') {
            $valor = request('coordinacion_completada') === 'true' ? 1 : 0;
            $query->where('coordinacion_completada', $valor);
        }

        // ✅ Filtro por usuario aprobador
        if (request()->has('usuario_aprobador_id') && request('usuario_aprobador_id') !== '' && request('usuario_aprobador_id') !== '0') {
            $query->where('usuario_aprobador_id', request('usuario_aprobador_id'));
        }

        // ✅ Filtro por fecha de vencimiento (desde/hasta)
        if (request()->has('fecha_vencimiento_desde') && request('fecha_vencimiento_desde') !== '') {
            $query->where('fecha_vencimiento', '>=', request('fecha_vencimiento_desde'));
        }

        if (request()->has('fecha_vencimiento_hasta') && request('fecha_vencimiento_hasta') !== '') {
            $query->where('fecha_vencimiento', '<=', request('fecha_vencimiento_hasta') . ' 23:59:59');
        }

        // ✅ Filtro por fecha de creación (desde/hasta)
        if (request()->has('fecha_creacion_desde') && request('fecha_creacion_desde') !== '') {
            $query->where('created_at', '>=', request('fecha_creacion_desde'));
        }

        if (request()->has('fecha_creacion_hasta') && request('fecha_creacion_hasta') !== '') {
            $query->where('created_at', '<=', request('fecha_creacion_hasta') . ' 23:59:59');
        }

        // ✅ Filtro por fecha de entrega solicitada (desde/hasta)
        // ✅ MEJORADO 2026-03-06: Asegurar que se filtra por fecha completa (00:00:00 a 23:59:59)
        // ✅ NUEVO: Al abrir el dashboard sin filtros, usar default: ayer-hoy.
        // Si el usuario ya está aplicando búsqueda u otros filtros, no forzar el rango de fechas.
        $fechaEntregaSolicitadaDesde = null;
        $fechaEntregaSolicitadaHasta = null;

        $tieneFechaDesde = request()->filled('fecha_entrega_solicitada_desde');
        $tieneFechaHasta = request()->filled('fecha_entrega_solicitada_hasta');
        $tieneFechaExplicita = $tieneFechaDesde || $tieneFechaHasta;

        $estadoExplicito = request()->filled('estado')
            && request('estado') !== ''
            && request('estado') !== 'TODOS'
            && request('estado') !== 'PENDIENTE';

        $tieneBusquedaOFilros = request()->filled('search')
            || $estadoExplicito
            || request()->hasAny([
                'localidad_id',
                'tipo_entrega',
                'politica_pago',
                'estado_logistica_id',
                'coordinacion_completada',
                'usuario_aprobador_id',
                'solo_vencidas',
                'fecha_vencimiento_desde',
                'fecha_vencimiento_hasta',
                'fecha_creacion_desde',
                'fecha_creacion_hasta',
                'hora_entrega_solicitada_desde',
                'hora_entrega_solicitada_hasta',
            ]);

        if ($tieneFechaExplicita) {
            if ($tieneFechaDesde) {
                $fechaEntregaSolicitadaDesde = request('fecha_entrega_solicitada_desde');
                if (strlen($fechaEntregaSolicitadaDesde) === 10) {
                    $fechaEntregaSolicitadaDesde .= ' 00:00:00';
                }
                $query->where('fecha_entrega_solicitada', '>=', $fechaEntregaSolicitadaDesde);
            }

            if ($tieneFechaHasta) {
                $fechaEntregaSolicitadaHasta = request('fecha_entrega_solicitada_hasta');
                if (strlen($fechaEntregaSolicitadaHasta) === 10) {
                    $fechaEntregaSolicitadaHasta .= ' 23:59:59';
                }
                $query->where('fecha_entrega_solicitada', '<=', $fechaEntregaSolicitadaHasta);
            }

            Log::info('LogisticaController::dashboard - Aplicando filtro de fecha explícito', [
                'fecha_desde' => $fechaEntregaSolicitadaDesde,
                'fecha_hasta' => $fechaEntregaSolicitadaHasta,
            ]);
        } elseif (! $tieneBusquedaOFilros) {
            $today = now();
            $fechaEntregaSolicitadaDesde = $today->copy()->startOfDay()->format('Y-m-d H:i:s');
            $fechaEntregaSolicitadaHasta = $today->copy()->endOfDay()->format('Y-m-d H:i:s');

            Log::info('LogisticaController::dashboard - SIN filtros explícitos, aplicando default (SOLO HOY)', [
                'fecha_desde' => $fechaEntregaSolicitadaDesde,
                'fecha_hasta' => $fechaEntregaSolicitadaHasta,
            ]);

            $query->where('fecha_entrega_solicitada', '>=', $fechaEntregaSolicitadaDesde);
            $query->where('fecha_entrega_solicitada', '<=', $fechaEntregaSolicitadaHasta);
        } else {
            Log::info('LogisticaController::dashboard - Búsqueda/filros activos, omitiendo rango de fechas por defecto', [
                'search' => request('search'),
                'estado' => request('estado'),
            ]);
        }

        Log::info('LogisticaController::dashboard - Resumen después de filtros de fecha', [
            'fecha_desde'           => $fechaEntregaSolicitadaDesde,
            'fecha_hasta'           => $fechaEntregaSolicitadaHasta,
            'proformas_encontradas' => $query->count(),
            'sql_query'             => $query->toSql(),
        ]);

        // ✅ Filtro por hora de entrega solicitada (desde/hasta)
        $horaDesde = request('hora_entrega_solicitada_desde');
        $horaHasta = request('hora_entrega_solicitada_hasta');

        if ($horaDesde && $horaDesde !== '') {
            // Si desde y hasta son iguales (hora específica), buscar el rango completo de esa hora
            if ($horaDesde === $horaHasta) {
                $horaFin = substr($horaDesde, 0, 5) . ':59'; // Ejemplo: 10:00 → 10:59
                $query->whereBetween('hora_entrega_solicitada', [$horaDesde, $horaFin]);
            } else {
                // Si son diferentes, buscar rango normal
                $query->where('hora_entrega_solicitada', '>=', $horaDesde);
            }
        }

        if ($horaHasta && $horaHasta !== '' && $horaDesde !== $horaHasta) {
            // Solo aplicar "hasta" si es diferente de "desde"
            $query->where('hora_entrega_solicitada', '<=', $horaHasta);
        }

        if (request()->has('solo_vencidas') && request('solo_vencidas') === 'true') {
            // ID 3 = RECHAZADA, ID 4 = CONVERTIDA
            $query->where('fecha_vencimiento', '<', now())
                ->whereNotIn('estado_proforma_id', [3, 4]);
        }

        // ✅ ACTUALIZADO 2026-03-06: Ordenar por fecha_entrega_solicitada para priorizar las más urgentes
        $proformasPaginated = $query
            ->orderBy('fecha_entrega_solicitada', 'asc')  // ✅ Entrega más próxima primero
            ->orderBy('id', 'desc')  // Secondary: ID descendente como tiebreaker
            ->paginate(15); // 15 por página

        $proformasRecientes = [
            'data'         => $proformasPaginated->map(function ($proforma) {
                return [
                    'id'                              => $proforma->id,
                    'numero'                          => $proforma->numero,
                    'cliente_nombre'                  => $proforma->cliente->nombre ?? 'N/A',
                    'localidad_id'                    => $proforma->cliente->localidad_id,
                    'localidad_nombre'                => $proforma->cliente->localidad->nombre ?? 'N/A',
                    'total'                           => $proforma->subtotal,
                    'fecha'                           => $proforma->fecha,
                    'estado'                          => $proforma->estado,
                    'canal_origen'                    => $proforma->canal_origen,
                    'usuario_creador_nombre'          => $proforma->usuarioCreador->name ?? 'Sistema',
                    // ✅ ACTUALIZADO: Devolver TODOS los roles (no solo el primero)
                    'usuario_creador_roles'           => $proforma->usuarioCreador && $proforma->usuarioCreador->roles->isNotEmpty()
                        ? $proforma->usuarioCreador->roles->pluck('name')->toArray()
                        : [],
                    // ✅ NUEVO: Booleano indicando si es preventista (case-insensitive)
                    'usuario_creador_es_preventista'  => $proforma->usuarioCreador && $proforma->usuarioCreador->roles->isNotEmpty()
                        ? $proforma->usuarioCreador->roles->pluck('name')->map(fn($rol) => strtolower($rol))->contains('preventista')
                        : false,
                    'usuario_aprobador_nombre'        => $proforma->usuarioAprobador->name ?? 'N/A',
                    'fecha_vencimiento'               => $proforma->fecha_vencimiento,
                    // ✅ Nuevos campos de filtro
                    'tipo_entrega'                    => $proforma->tipo_entrega ?? 'N/A',
                    'politica_pago'                   => $proforma->politica_pago ?? 'N/A',
                    // ✅ ACTUALIZADO: Devolver objeto completo estado_logistica con icono, nombre, código, color
                    'estado_logistica'                => $proforma->estadoLogistica ? [
                        'id'     => $proforma->estadoLogistica->id,
                        'codigo' => $proforma->estadoLogistica->codigo,
                        'nombre' => $proforma->estadoLogistica->nombre,
                        'color'  => $proforma->estadoLogistica->color,
                        'icono'  => $proforma->estadoLogistica->icono,
                    ] : null,
                    'estado_logistica_id'             => $proforma->estado_proforma_id,
                    'coordinacion_completada'         => (bool) $proforma->coordinacion_completada,
                    // Datos de solicitud
                    'fecha_entrega_solicitada'        => $proforma->fecha_entrega_solicitada,
                    'hora_entrega_solicitada'         => $proforma->hora_entrega_solicitada,
                    'hora_entrega_solicitada_fin'     => $proforma->hora_entrega_solicitada_fin,
                    'direccion_entrega_solicitada_id' => $proforma->direccion_entrega_solicitada_id,
                    'direccionSolicitada'             => $proforma->direccionSolicitada ? [
                        'id'         => $proforma->direccionSolicitada->id,
                        'direccion'  => $proforma->direccionSolicitada->direccion,
                        'latitud'    => $proforma->direccionSolicitada->latitud,
                        'longitud'   => $proforma->direccionSolicitada->longitud,
                        'referencia' => $proforma->direccionSolicitada->referencia,
                        'localidad'  => $proforma->direccionSolicitada->localidad ? [
                            'id'     => $proforma->direccionSolicitada->localidad->id,
                            'nombre' => $proforma->direccionSolicitada->localidad->nombre,
                        ] : null,
                    ] : null,
                    // ✅ NUEVO: Timestamps para mostrar fechas de creación y actualización
                    'created_at'                      => $proforma->created_at,
                    'updated_at'                      => $proforma->updated_at,
                    // ✅ NUEVO: Información de la venta si la proforma fue convertida
                    'venta_id'                        => $proforma->venta?->id,
                    'venta_numero'                    => $proforma->venta?->numero,
                ];
            }),
            'current_page' => $proformasPaginated->currentPage(),
            'last_page'    => $proformasPaginated->lastPage(),
            'per_page'     => $proformasPaginated->perPage(),
            'total'        => $proformasPaginated->total(),
            'from'         => $proformasPaginated->firstItem(),
            'to'           => $proformasPaginated->lastItem(),
        ];

        // ✅ Obtener lista de localidades para el filtro
        $localidades = Localidad::select('id', 'nombre')
            ->orderBy('nombre', 'asc')
            ->get()
            ->map(function ($localidad) {
                return [
                    'id'     => $localidad->id,
                    'nombre' => $localidad->nombre,
                ];
            });

        // ✅ Obtener usuarios aprobadores (que hayan aprobado proformas)
        $usuariosAprobadores = User::whereIn('id', function ($query) {
            $query->select('usuario_aprobador_id')
                ->from('proformas')
                ->whereNotNull('usuario_aprobador_id')
                ->distinct();
        })
            ->select('id', 'name')
            ->orderBy('name', 'asc')
            ->get()
            ->map(function ($user) {
                return [
                    'id'   => $user->id,
                    'name' => $user->name,
                ];
            });

        // ✅ Obtener estados logísticos disponibles
        $estadosLogistica = EstadoLogistica::whereIn('id', function ($query) {
            $query->select('estado_proforma_id')
                ->from('proformas')
                ->whereNotNull('estado_proforma_id')
                ->distinct();
        })
            ->select('id', 'nombre', 'codigo')
            ->orderBy('nombre', 'asc')
            ->get()
            ->map(function ($estado) {
                return [
                    'id'     => $estado->id,
                    'nombre' => $estado->nombre,
                    'codigo' => $estado->codigo,
                ];
            });

        return Inertia::render('logistica/dashboard', [
            'proformasRecientes'  => $proformasRecientes,
            'localidades'         => $localidades,
            'usuariosAprobadores' => $usuariosAprobadores,
            'estadosLogistica'    => $estadosLogistica,
        ]);
    }

    /**
     * Página de seguimiento de entrega (DEPRECATED)
     * Esta ruta sigue existiendo para compatibilidad pero debería usar /logistica/entregas/{id} en su lugar
     */
    public function seguimiento(Entrega $entrega)
    {
        $entrega->load(['ventas.cliente', 'ubicacionesTracking' => function ($query) {
            $query->orderBy('created_at', 'desc');
        }]);

        $primeraVenta = $entrega->ventas?->first();
        $cliente      = $primeraVenta?->cliente;

        $entregaData = [
            'id'                    => $entrega->id,
            'numero_referencia'     => $primeraVenta?->numero ?? 'N/A',
            'estado'                => $entrega->estado,
            'fecha_programada'      => $entrega->fecha_programada?->format('Y-m-d H:i'),
            'fecha_entrega'         => $entrega->fecha_entrega?->format('Y-m-d H:i'),
            'cliente_nombre'        => $cliente?->nombre ?? 'N/A',
            'historial_ubicaciones' => $entrega->ubicacionesTracking->map(function ($item) {
                return [
                    'fecha'     => $item->created_at->format('Y-m-d H:i'),
                    'latitud'   => $item->latitud,
                    'longitud'  => $item->longitud,
                    'precicion' => $item->presicion,
                ];
            }),
        ];

        return Inertia::render('logistica/seguimiento', [
            'entrega' => $entregaData,
        ]);
    }
}
