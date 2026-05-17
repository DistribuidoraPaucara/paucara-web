<?php

namespace App\Http\Controllers;

use App\Models\Entrega;
use App\Services\ExcelExportService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

/**
 * EntregaPdfController - Generar PDFs de entregas
 *
 * RESPONSABILIDADES:
 * ✓ Generar PDF de entrega en diferentes formatos (A4, TICKET_80, TICKET_58)
 * ✓ Soportar descarga y vista previa
 * ✓ Manejar diferentes acciones (download, stream)
 */
class EntregaPdfController extends Controller
{
    /**
     * Debug - Ver datos de entrega
     */
    public function debug(Entrega $entrega)
    {
        $entrega->load([
            'ventas.cliente',
            'ventas.detalles.producto',
            'chofer',
            'vehiculo',
            'localidad',
            'reportes',
        ]);

        return response()->json([
            'entrega' => $entrega,
            'numero_entrega' => $entrega->numero_entrega,
            'peso_kg' => $entrega->peso_kg,
            'ventas_count' => $entrega->ventas?->count(),
            'vistas_disponibles' => [
                'A4' => view()->exists('impresion.entregas.hoja-completa'),
                'B1' => view()->exists('impresion.entregas.b1'),
                'TICKET_80' => view()->exists('impresion.entregas.ticket-80'),
                'TICKET_58' => view()->exists('impresion.entregas.ticket-58'),
            ],
        ]);
    }

    /**
     * Descargar o ver preview de PDF de entrega con formato variable
     *
     * GET /api/entregas/{entrega}/descargar?formato={formato}&accion={accion}
     * GET /api/entregas/{entrega}/preview?formato={formato}
     *
     * @param Entrega $entrega
     * @param Request $request
     * @return Response PDF
     */
    public function descargar(Entrega $entrega, Request $request)
    {
        try {
            $formato = $request->query('formato', 'A4');
            $accion = $request->query('accion', 'download');

            // Cargar relaciones necesarias (SIN entregador - lo haremos después)
            $entrega->load([
                'ventas.cliente.localidad',  // ✅ NUEVO: Cargar localidades de clientes
                'ventas.detalles.producto.unidad',
                'chofer',
                'vehiculo',
                'localidad',
                'reportes',
            ]);

            // ✅ NUEVO (2026-04-23): Cargar componentes de combos en los detalles de ventas
            // Para cada venta en la entrega, para cada detalle, si el producto es combo, cargar sus items
            foreach ($entrega->ventas as $venta) {
                foreach ($venta->detalles as $detalle) {
                    if ($detalle->producto->es_combo) {
                        $detalle->load('producto.comboItems.producto');
                    }
                }
            }

            // ✅ IMPORTANTE: Cargar entregador manualmente usando query builder
            // Debido a un comportamiento de Eloquent, las formas estándar (load/with) no funcionan
            // El problema es que load() anterior CACHE una relación entregador vacía
            // Por eso usamos setAttribute() que funciona correctamente
            $entregador = $entrega->entregador()->first();
            if ($entregador) {
                $entrega->setAttribute('entregador', $entregador);
            }

            // 🔍 DEBUG: Loguear información de la entrega para inspección
            \Log::info('📦 [EntregaPdfController::descargar] Datos de entrega para imprimir', [
                'entrega_id'            => $entrega->id,
                'entrega_numero'        => $entrega->numero_entrega,
                'fecha_asignacion'      => $entrega->fecha_asignacion,
                'estado'                => $entrega->estado,
                'peso_kg'               => $entrega->peso_kg,
                'chofer_id'             => $entrega->chofer_id,
                'chofer_tipo'           => gettype($entrega->chofer),
                'chofer_es_null'        => $entrega->chofer === null,
                'chofer_nombre'         => $entrega->chofer?->nombre ?? 'NULL',
                'chofer_email'          => $entrega->chofer?->email ?? 'NULL',
                'chofer_phone'          => $entrega->chofer?->phone ?? 'NULL',
                'chofer_full_data'      => $entrega->chofer ? [
                    'id' => $entrega->chofer->id,
                    'name' => $entrega->chofer->name ?? $entrega->chofer->nombre ?? null,
                    'email' => $entrega->chofer->email,
                    'phone' => $entrega->chofer->phone ?? null,
                ] : 'SIN CHOFER',
                'entregador_id'         => $entrega->entregador_id,
                'entregador_nombre'     => $entrega->entregador?->name ?? 'SIN ENTREGADOR',
                'entregador_full_data'  => $entrega->entregador ? [
                    'id' => $entrega->entregador->id,
                    'name' => $entrega->entregador->name,
                    'email' => $entrega->entregador->email,
                    'phone' => $entrega->entregador->phone ?? null,
                ] : 'SIN ENTREGADOR',
                'vehiculo_id'           => $entrega->vehiculo_id,
                'vehiculo_placa'        => $entrega->vehiculo?->placa ?? 'NULL',
                'vehiculo_marca'        => $entrega->vehiculo?->marca ?? 'NULL',
                'vehiculo_modelo'       => $entrega->vehiculo?->modelo ?? 'NULL',
                'vehiculo_capacidad'    => $entrega->vehiculo?->capacidad_kg ?? 'NULL',
                'ventas_count'          => $entrega->ventas?->count(),
                'formato'               => $formato,
                'accion'                => $accion,
            ]);

            // Obtener empresa principal
            $empresa = \App\Models\Empresa::principal();
            if (!$empresa) {
                throw new \Exception('No hay empresa configurada');
            }

            // Convertir logos a base64 para embebimiento en PDF
            $logoPrincipalBase64 = $this->logoToBase64($empresa->logo_principal);
            $logoFooterBase64 = $this->logoToBase64($empresa->logo_footer);

            // ✅ NUEVO: Obtener localidades e información del entregador
            $localidadesService = app(\App\Services\EntregaLocalidadesService::class);
            $localidades = $localidadesService->obtenerLocalidades($entrega);
            $localidadesResumen = $localidadesService->obtenerLocalidadesResumen($entrega);

            // ✅ NUEVA 2026-02-12: Obtener resumen de pagos para la impresión
            \Log::info('[EntregaPdfController::descargar] 🔄 Obteniendo resumen de pagos', [
                'entrega_id' => $entrega->id,
                'numero_entrega' => $entrega->numero_entrega,
            ]);

            $resumenPagos = $this->obtenerResumenPagos($entrega);

            \Log::info('[EntregaPdfController::descargar] ✅ Resumen de pagos obtenido', [
                'entrega_id' => $entrega->id,
                'resumen_es_null' => $resumenPagos === null,
                'resumen_existe' => $resumenPagos !== null,
                'estructura_resumen' => $resumenPagos ? json_encode([
                    'keys' => array_keys($resumenPagos),
                    'pagos_count' => count($resumenPagos['pagos'] ?? []),
                    'pagos' => array_map(function($p) {
                        return [
                            'tipo_pago' => $p['tipo_pago'] ?? null,
                            'tipo_pago_codigo' => $p['tipo_pago_codigo'] ?? null,
                            'total' => $p['total'] ?? 0,
                        ];
                    }, $resumenPagos['pagos'] ?? []),
                    'sin_registrar_count' => count($resumenPagos['sin_registrar'] ?? []),
                ], JSON_UNESCAPED_UNICODE) : 'null',
            ]);

            $data = [
                'entrega' => $entrega,
                'fecha_generacion' => now()->format('d/m/Y H:i'),
                'fecha_impresion' => now(),
                'empresa' => $empresa,
                'usuario' => auth()->user(),
                'formato' => $formato,
                'logo_principal_base64' => $logoPrincipalBase64,
                'logo_footer_base64' => $logoFooterBase64,
                'localidades' => $localidades,              // ✅ NUEVO
                'localidades_resumen' => $localidadesResumen,  // ✅ NUEVO
                'resumen_pagos' => $resumenPagos,           // ✅ NUEVA 2026-02-12: Resumen de pagos
            ];

            // Crear PDF con configuración según formato
            $viewName = $this->obtenerVistaEntrega($formato);
            $pdf = Pdf::loadView($viewName, $data);

            // Configurar papel y márgenes según formato
            match ($formato) {
                'TICKET_80' => $this->configurarTicket80($pdf),
                'TICKET_58' => $this->configurarTicket58($pdf),
                'B1' => $this->configurarB1($pdf),
                'A4_COPIA' => $this->configurarA4Copia($pdf),
                default => $this->configurarA4($pdf),
            };

            // Retornar según acción
            if ($accion === 'stream') {
                return $pdf->stream("entrega-{$entrega->numero_entrega}.pdf");
            }

            return $pdf->download("entrega-{$entrega->numero_entrega}.pdf");
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error generando PDF',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Vista previa del PDF en el navegador
     *
     * GET /api/entregas/{entrega}/preview?formato={formato}
     *
     * @param Entrega $entrega
     * @param Request $request
     * @return Response PDF para ver en navegador
     */
    public function preview(Entrega $entrega, Request $request)
    {
        try {
            $formato = $request->query('formato', 'A4');

            // ✅ Cargar relaciones (SIN entregador - lo haremos después)
            $entrega = Entrega::with([
                'ventas.cliente.localidad',  // ✅ NUEVO: Cargar localidades de clientes
                'ventas.detalles.producto.unidad',
                'chofer',
                'vehiculo',
                'localidad',
                'reportes',
            ])->find($entrega->id);

            // ✅ IMPORTANTE: Cargar entregador manualmente usando query builder
            // Debido a un comportamiento de Eloquent, las formas estándar (with/load) no funcionan
            // El problema es que with() anterior CACHE una relación entregador vacía
            // Por eso usamos setAttribute() que funciona correctamente
            $entregador = $entrega->entregador()->first();
            if ($entregador) {
                $entrega->setAttribute('entregador', $entregador);
            }

            // 🔍 DEBUG: Loguear información de la entrega para inspección
            \Log::info('📦 [EntregaPdfController::preview] Datos de entrega para previsualizar', [
                'entrega_id'            => $entrega->id,
                'entrega_numero'        => $entrega->numero_entrega,
                'estado'                => $entrega->estado,
                'entregador_id'         => $entrega->entregador_id,
                'entregador_nombre'     => $entrega->entregador?->name ?? 'SIN ENTREGADOR',
                'formato'               => $formato,
            ]);

            // Obtener empresa principal
            $empresa = \App\Models\Empresa::principal();
            if (!$empresa) {
                throw new \Exception('No hay empresa configurada');
            }

            // Convertir logos a base64 para embebimiento en PDF
            $logoPrincipalBase64 = $this->logoToBase64($empresa->logo_principal);
            $logoFooterBase64 = $this->logoToBase64($empresa->logo_footer);

            // ✅ NUEVO: Obtener localidades e información del entregador
            $localidadesService = app(\App\Services\EntregaLocalidadesService::class);
            $localidades = $localidadesService->obtenerLocalidades($entrega);
            $localidadesResumen = $localidadesService->obtenerLocalidadesResumen($entrega);

            // ✅ NUEVA 2026-02-12: Obtener resumen de pagos para la impresión
            \Log::info('[EntregaPdfController::preview] 🔄 Obteniendo resumen de pagos', [
                'entrega_id' => $entrega->id,
                'numero_entrega' => $entrega->numero_entrega,
            ]);

            $resumenPagos = $this->obtenerResumenPagos($entrega);

            \Log::info('[EntregaPdfController::preview] ✅ Resumen de pagos obtenido', [
                'entrega_id' => $entrega->id,
                'resumen_es_null' => $resumenPagos === null,
                'estructura_resumen' => $resumenPagos ? json_encode([
                    'keys' => array_keys($resumenPagos),
                    'pagos_count' => count($resumenPagos['pagos'] ?? []),
                    'pagos_preview' => array_slice($resumenPagos['pagos'] ?? [], 0, 2),
                ], JSON_UNESCAPED_UNICODE) : 'null',
            ]);

            $data = [
                'entrega' => $entrega,
                'fecha_generacion' => now()->format('d/m/Y H:i'),
                'fecha_impresion' => now(),
                'empresa' => $empresa,
                'usuario' => auth()->user(),
                'formato' => $formato,
                'logo_principal_base64' => $logoPrincipalBase64,
                'logo_footer_base64' => $logoFooterBase64,
                'localidades' => $localidades,              // ✅ NUEVO
                'localidades_resumen' => $localidadesResumen,  // ✅ NUEVO
                'resumen_pagos' => $resumenPagos,           // ✅ NUEVA 2026-02-12: Resumen de pagos
            ];

            // Crear PDF
            $viewName = $this->obtenerVistaEntrega($formato);
            \Log::info('[EntregaPdfController::preview] 🎨 Cargando vista para PDF', [
                'entrega_id' => $entrega->id,
                'vista_name' => $viewName,
                'formato' => $formato,
            ]);
            $pdf = Pdf::loadView($viewName, $data);

            // Configurar papel y márgenes según formato
            match ($formato) {
                'TICKET_80' => $this->configurarTicket80($pdf),
                'TICKET_58' => $this->configurarTicket58($pdf),
                'B1' => $this->configurarB1($pdf),
                'A4_COPIA' => $this->configurarA4Copia($pdf),
                default => $this->configurarA4($pdf),
            };

            // Retornar como stream (abre en navegador)
            \Log::info('[EntregaPdfController::preview] 📤 PDF stream iniciado', [
                'entrega_id' => $entrega->id,
                'numero_entrega' => $entrega->numero_entrega,
            ]);
            return $pdf->stream("entrega-{$entrega->numero_entrega}.pdf");
        } catch (\Exception $e) {
            \Log::error('[EntregaPdfController::preview] ❌ ERROR generando PDF', [
                'entrega_id' => $entrega->id ?? 'unknown',
                'error_mensaje' => $e->getMessage(),
                'error_linea' => $e->getLine(),
                'error_archivo' => $e->getFile(),
                'error_trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error generando vista previa',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Configurar PDF para formato A4
     */
    private function configurarA4($pdf)
    {
        return $pdf
            ->setPaper('A4', 'landscape')
            ->setOption('margin-top', 10)
            ->setOption('margin-bottom', 10)
            ->setOption('margin-left', 10)
            ->setOption('margin-right', 10);
    }

    /**
     * Configurar PDF para formato A4 con 2 copias lado a lado
     */
    private function configurarA4Copia($pdf)
    {
        return $pdf
            ->setPaper('A4', 'landscape')
            ->setOption('margin-top', 5)
            ->setOption('margin-bottom', 5)
            ->setOption('margin-left', 5)
            ->setOption('margin-right', 5);
    }

    /**
     * Configurar PDF para formato TICKET 80mm
     */
    private function configurarTicket80($pdf)
    {
        return $pdf
            ->setPaper([0, 0, 227, 1000], 'portrait')  // 80mm = 227pt
            ->setOption('margin-top', 5)
            ->setOption('margin-bottom', 5)
            ->setOption('margin-left', 5)
            ->setOption('margin-right', 5);
    }

    /**
     * Configurar PDF para formato TICKET 58mm
     */
    private function configurarTicket58($pdf)
    {
        return $pdf
            ->setPaper([0, 0, 164, 1000], 'portrait')  // 58mm = 164pt
            ->setOption('margin-top', 5)
            ->setOption('margin-bottom', 5)
            ->setOption('margin-left', 5)
            ->setOption('margin-right', 5);
    }

    /**
     * Configurar PDF para formato B1 (1000mm × 707mm - Landscape)
     */
    private function configurarB1($pdf)
    {
        return $pdf
            ->setPaper([0, 0, 2834, 2004], 'landscape')  // B1 = 1000mm × 707mm (≈ 2834 × 2004 pt)
            ->setOption('margin-top', 20)
            ->setOption('margin-bottom', 20)
            ->setOption('margin-left', 20)
            ->setOption('margin-right', 20);
    }

    /**
     * Obtener vista Blade según el formato de entrega
     *
     * @param string $formato A4|TICKET_80|TICKET_58|B1
     * @return string Vista Blade
     */
    private function obtenerVistaEntrega(string $formato): string
    {
        return match ($formato) {
            'TICKET_80' => 'impresion.entregas.ticket-80',
            'TICKET_58' => 'impresion.entregas.ticket-58',
            'B1' => 'impresion.entregas.b1',
            'A4' => 'impresion.entregas.a4-2-copias',
            'A4_COPIA' => 'impresion.entregas.a4-2-copias',
            default => 'impresion.entregas.hoja-completa',
        };
    }

    /**
     * Convertir URL de logo a data URI base64
     *
     * @param string|null $logoUrl URL de la imagen (ej: /storage/logos/logo.png)
     * @return string|null Data URI para uso en HTML/CSS
     */
    private function logoToBase64(?string $logoUrl): ?string
    {
        if (!$logoUrl) {
            return null;
        }

        try {
            // Si ya es un data URI, devolverlo tal cual
            if (str_starts_with($logoUrl, 'data:')) {
                return $logoUrl;
            }

            // Resolver la ruta absoluta
            $logoPath = public_path($logoUrl);

            if (!file_exists($logoPath)) {
                \Log::warning('Logo no encontrado: ' . $logoPath);
                return null;
            }

            $imageData = file_get_contents($logoPath);
            $base64 = base64_encode($imageData);

            // Detectar el tipo MIME desde la extensión del archivo
            $extension = strtolower(pathinfo($logoPath, PATHINFO_EXTENSION));
            $mimeTypes = [
                'png' => 'image/png',
                'jpg' => 'image/jpeg',
                'jpeg' => 'image/jpeg',
                'gif' => 'image/gif',
                'webp' => 'image/webp',
                'svg' => 'image/svg+xml',
            ];
            $mimeType = $mimeTypes[$extension] ?? 'image/png';

            return "data:{$mimeType};base64,{$base64}";
        } catch (\Exception $e) {
            \Log::warning('Error al convertir logo a base64', [
                'error' => $e->getMessage(),
                'logo_url' => $logoUrl
            ]);
            return null;
        }
    }

    /**
     * Obtener logo convertido a base64 para incrustar en PDF
     */
    private function getLogoBase64(): ?string
    {
        try {
            $logoPng = config('branding.png', '/logo.png');
            $logoPath = public_path($logoPng);

            if (!file_exists($logoPath)) {
                return null;
            }

            $imageData = file_get_contents($logoPath);
            $base64 = base64_encode($imageData);

            // Detectar el tipo MIME
            $mimeType = mime_content_type($logoPath) ?: 'image/png';

            return "data:{$mimeType};base64,{$base64}";
        } catch (\Exception $e) {
            \Log::warning('Error al convertir logo a base64', [
                'error' => $e->getMessage()
            ]);
            return null;
        }
    }

    /**
     * Obtener productos agrupados de una entrega
     *
     * Agrupa productos de todas las ventas consolidando cantidades
     *
     * GET /api/entregas/{entrega}/productos-agrupados
     *
     * @param Entrega $entrega
     * @return \Illuminate\Http\JsonResponse
     *
     * EJEMPLO DE RESPUESTA:
     * {
     *   "success": true,
     *   "data": {
     *     "entrega_id": 10,
     *     "numero_entrega": "ENT-20260121-10",
     *     "productos": [
     *       {
     *         "producto_id": 1,
     *         "producto_nombre": "Agua Alma 500ml (BOLSITA)",
     *         "codigo_producto": "A500B",
     *         "cantidad_total": 4,
     *         "precio_unitario": "15.00",
     *         "subtotal": "60.00",
     *         "unidad_medida": "Paquete",
     *         "ventas": [
     *           {
     *             "venta_id": 20,
     *             "venta_numero": "VEN20260121-0004",
     *             "cantidad": 1,
     *             "cliente_id": 27,
     *             "cliente_nombre": "Fernando Pinto"
     *           },
     *           {
     *             "venta_id": 19,
     *             "venta_numero": "VEN20260121-0003",
     *             "cantidad": 3,
     *             "cliente_id": 27,
     *             "cliente_nombre": "Fernando Pinto"
     *           }
     *         ]
     *       }
     *     ],
     *     "total_items": 1,
     *     "cantidad_total": 4
     *   }
     * }
     */
    public function obtenerProductosAgrupados(Entrega $entrega)
    {
        try {
            // Cargar relaciones necesarias
            $entrega->load([
                'ventas.cliente',
                'ventas.detalles.producto.unidad',
            ]);

            // Agrupar productos consolidando cantidades
            $productosAgrupados = [];
            $cantidadTotal = 0;

            foreach ($entrega->ventas as $venta) {
                foreach ($venta->detalles as $detalle) {
                    $productoId = $detalle->producto_id;

                    // Si el producto ya existe en el array, sumar cantidad
                    if (isset($productosAgrupados[$productoId])) {
                        $productosAgrupados[$productoId]['cantidad_total'] += (float) $detalle->cantidad;
                        $productosAgrupados[$productoId]['subtotal'] = round(
                            $productosAgrupados[$productoId]['subtotal'] +
                            ($detalle->cantidad * $detalle->precio_unitario),
                            2
                        );
                        // Agregar venta a la lista
                        $productosAgrupados[$productoId]['ventas'][] = [
                            'venta_id' => $venta->id,
                            'venta_numero' => $venta->numero,
                            'cantidad' => (float) $detalle->cantidad,
                            'cliente_id' => $venta->cliente_id,
                            'cliente_nombre' => $venta->cliente?->nombre ?? 'Sin cliente',
                        ];
                    } else {
                        // Crear nuevo producto en el array
                        $productosAgrupados[$productoId] = [
                            'producto_id' => $productoId,
                            'producto_nombre' => $detalle->producto?->nombre ?? 'Producto desconocido',
                            'codigo_producto' => $detalle->producto?->codigo_barras ?? '',
                            'cantidad_total' => (float) $detalle->cantidad,
                            'precio_unitario' => (float) $detalle->precio_unitario,
                            'subtotal' => round($detalle->cantidad * $detalle->precio_unitario, 2),
                            'unidad_medida' => $detalle->producto?->unidad?->nombre ?? 'Unidad',
                            'ventas' => [
                                [
                                    'venta_id' => $venta->id,
                                    'venta_numero' => $venta->numero,
                                    'cantidad' => (float) $detalle->cantidad,
                                    'cliente_id' => $venta->cliente_id,
                                    'cliente_nombre' => $venta->cliente?->nombre ?? 'Sin cliente',
                                ]
                            ]
                        ];
                    }

                    $cantidadTotal += (float) $detalle->cantidad;
                }
            }

            // Reindexar array para que sea una lista en lugar de object
            $productosAgrupados = array_values($productosAgrupados);

            return response()->json([
                'success' => true,
                'data' => [
                    'entrega_id' => $entrega->id,
                    'numero_entrega' => $entrega->numero_entrega,
                    'productos' => $productosAgrupados,
                    'total_items' => count($productosAgrupados),
                    'cantidad_total' => $cantidadTotal,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error obteniendo productos agrupados',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Exportar entrega a Excel
     *
     * GET /api/entregas/{entrega}/exportar-excel
     *
     * @param Entrega $entrega
     * @return \Symfony\Component\HttpFoundation\StreamedResponse
     */
    public function exportarExcel(Entrega $entrega)
    {
        try {
            $excelService = new ExcelExportService();
            return $excelService->exportarEntrega($entrega);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error generando Excel',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * ✅ NUEVA 2026-02-12: Obtener resumen de pagos de una entrega para impresión
     *
     * @param Entrega $entrega
     * @return array|null Resumen de pagos o null si no hay datos
     */
    private function obtenerResumenPagos(Entrega $entrega): ?array
    {
        try {
            // ✅ REFACTORIZADO 2026-02-16: Usar MISMA lógica que endpoint API para evitar discrepancias
            // Cargar ventas con relaciones necesarias
            $ventasCargas = $entrega->load(['ventas' => function ($q) {
                $q->select('id', 'entrega_id', 'numero', 'total', 'estado_pago', 'tipo_pago_id', 'cliente_id')
                  ->with('tipoPago:id,codigo,nombre', 'cliente:id,nombre');
            }])->ventas;

            // Filtrar SOLO ventas NO a crédito (CRÍTICO: excluir CREDITO del resumen)
            $ventasParaResumen = $ventasCargas->filter(function ($v) {
                return $v->estado_pago !== 'CREDITO';
            });

            // Obtener todas las confirmaciones de las ventas NO crédito de esta entrega
            $ventasIds = $ventasParaResumen->pluck('id')->toArray();

            if (empty($ventasIds)) {
                return null;
            }

            $confirmaciones = \App\Models\EntregaVentaConfirmacion::with('tipoPago')
                ->whereIn('venta_id', $ventasIds)
                ->get();

            if ($confirmaciones->isEmpty()) {
                return null;
            }

            // Construir resumen con soporte para múltiples pagos (IGUAL QUE ENDPOINT API)
            $resumen = [
                'entrega_id' => $entrega->id,
                'numero_entrega' => $entrega->numero_entrega,
                'total_esperado' => (float) $ventasParaResumen->sum('total'),  // ✅ Solo no-crédito
                'pagos' => [],
                'sin_registrar' => [],
                'total_recibido' => 0,
                'confirmaciones' => [],  // ✅ NUEVO 2026-02-21: Información de confirmaciones para el ticket
            ];

            // Procesar confirmaciones agrupadas por tipo de pago
            $porTipoPago = $confirmaciones->groupBy(function ($item) {
                // Si tiene desglose_pagos (múltiples pagos), agrupar por cada tipo en el desglose
                if (!empty($item->desglose_pagos)) {
                    return 'multiple';
                }
                // Si tiene tipo_pago_id único, agrupar por eso
                return $item->tipo_pago_id;
            });

            foreach ($porTipoPago as $grupoKey => $confirmacionesGrupo) {
                if ($grupoKey === 'multiple') {
                    // Procesar múltiples pagos por desglose
                    foreach ($confirmacionesGrupo as $confirmacion) {
                        if (!empty($confirmacion->desglose_pagos)) {
                            foreach ($confirmacion->desglose_pagos as $pago) {
                                $tipoPagoNombre = $pago['tipo_pago_nombre'] ?? 'Desconocido';
                                $tipoPagoCodigo = $this->obtenerCodigoTipoPago($tipoPagoNombre);
                                $montoPago = (float) ($pago['monto'] ?? 0);

                                // Buscar si ya existe este tipo en el resumen
                                $existeIndex = null;
                                foreach ($resumen['pagos'] as $idx => $p) {
                                    if ($p['tipo_pago'] === $tipoPagoNombre) {
                                        $existeIndex = $idx;
                                        break;
                                    }
                                }

                                if ($existeIndex !== null) {
                                    // Actualizar existente
                                    $resumen['pagos'][$existeIndex]['total'] += $montoPago;
                                    $resumen['pagos'][$existeIndex]['cantidad_ventas']++;
                                } else {
                                    // Crear nuevo tipo
                                    $resumen['pagos'][] = [
                                        'tipo_pago_id' => $pago['tipo_pago_id'] ?? null,
                                        'tipo_pago' => $tipoPagoNombre,
                                        'tipo_pago_codigo' => $tipoPagoCodigo,
                                        'total' => $montoPago,
                                        'cantidad_ventas' => 1,
                                    ];
                                }

                                $resumen['total_recibido'] += $montoPago;
                            }
                        }
                    }
                } else {
                    // Procesar pago único (backward compatible)
                    // ✅ FIX: Usar null-safe operator para acceder a first() y tipoPago
                    $tipoPago = $confirmacionesGrupo->first()?->tipoPago;
                    $totalPago = (float) $confirmacionesGrupo->sum('total_dinero_recibido');
                    if ($totalPago == 0) {
                        $totalPago = (float) $confirmacionesGrupo->sum('monto_recibido');
                    }
                    $cantidad = $confirmacionesGrupo->count();

                    $resumen['pagos'][] = [
                        'tipo_pago_id' => $grupoKey,
                        'tipo_pago' => $tipoPago?->nombre ?? 'Sin especificar',
                        'tipo_pago_codigo' => $tipoPago?->codigo ?? 'N/A',
                        'total' => $totalPago,
                        'cantidad_ventas' => $cantidad,
                    ];

                    $resumen['total_recibido'] += $totalPago;
                }
            }

            // ✅ NUEVO 2026-02-21: Agregar información de confirmaciones (tipo_entrega, tipo_novedad, etc.)
            foreach ($confirmaciones as $confirmacion) {
                $resumen['confirmaciones'][] = [
                    'venta_id' => $confirmacion->venta_id,
                    'tipo_entrega' => $confirmacion->tipo_entrega ?? 'COMPLETA',
                    'tipo_novedad' => $confirmacion->tipo_novedad,
                    'tuvo_problema' => $confirmacion->tuvo_problema,
                    'productos_devueltos' => $confirmacion->productos_devueltos,  // JSON array
                    'monto_devuelto' => (float) ($confirmacion->monto_devuelto ?? 0),
                    'monto_aceptado' => (float) ($confirmacion->monto_aceptado ?? 0),
                ];
            }

            // Ventas sin confirmación de pago (SOLO NO crédito)
            $ventasConfirmadas = $confirmaciones->pluck('venta_id')->unique()->toArray();
            $ventasSinPago = $ventasParaResumen->whereNotIn('id', $ventasConfirmadas);

            if ($ventasSinPago->isNotEmpty()) {
                $resumen['sin_registrar'] = array_values(
                    $ventasSinPago->map(function ($v) {
                        return [
                            'venta_id' => $v->id,
                            'venta_numero' => $v->numero,
                            'monto' => (float) $v->total,
                        ];
                    })->toArray()
                );
            }

            // Calcular totales
            $totalEsperado = $resumen['total_esperado'];
            $totalRecibido = $resumen['total_recibido'];
            $totalCredito = (float) $entrega->ventas->where('estado_pago', 'CREDITO')->sum('total');

            $resumenFinal = array_merge($resumen, [
                'total_credito' => $totalCredito,
                'diferencia' => max(0, $totalEsperado - $totalRecibido - $totalCredito),
                'porcentaje_recibido' => $totalEsperado > 0 ? (int) (($totalRecibido / $totalEsperado) * 100) : 0,
            ]);

            // 🔍 LOGGING DETALLADO: Validar estructura de datos antes de retornar
            \Log::info('[EntregaPdfController::obtenerResumenPagos] ✅ Resumen generado', [
                'entrega_id' => $entrega->id,
                'total_esperado' => $totalEsperado,
                'total_recibido' => $totalRecibido,
                'cantidad_pagos' => count($resumenFinal['pagos']),
                'pagos_estructura' => json_encode($resumenFinal['pagos'], JSON_UNESCAPED_UNICODE),
                'sin_registrar_count' => count($resumenFinal['sin_registrar']),
            ]);

            return $resumenFinal;
        } catch (\Exception $e) {
            \Log::error('[EntregaPdfController::obtenerResumenPagos] ❌ ERROR en obtenerResumenPagos', [
                'entrega_id' => $entrega->id,
                'error_mensaje' => $e->getMessage(),
                'error_linea' => $e->getLine(),
                'error_archivo' => $e->getFile(),
                'error_trace' => $e->getTraceAsString(),
            ]);
            return null;
        }
    }

    /**
     * ✅ NUEVO 2026-02-16: Obtener código de tipo de pago por nombre
     * (Reutilizado del endpoint API para consistencia)
     */
    private function obtenerCodigoTipoPago(?string $nombre): string
    {
        if (!$nombre) {
            return 'N/A';
        }

        $codigo = \App\Models\TipoPago::where('nombre', 'like', "%{$nombre}%")
            ->select('codigo')
            ->first();

        return $codigo?->codigo ?? 'N/A';
    }
}
