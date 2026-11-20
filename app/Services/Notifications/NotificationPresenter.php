<?php

namespace App\Services\Notifications;

use App\Models\Notification;

/**
 * Convierte una notificación persistida en lo que muestra la campana / historial:
 * categoría, título, mensaje y enlace a la pantalla relacionada.
 *
 * Centraliza los textos para que web (y a futuro la app) no tengan que conocer
 * la forma del campo `data` de cada tipo.
 */
class NotificationPresenter
{
    /** Categorías visibles en la campana (pestañas). */
    public const CATEGORIAS = ['proformas', 'entregas', 'creditos', 'avisos'];

    public static function categoria(string $type): string
    {
        return match (true) {
            str_starts_with($type, 'proforma.') => 'proformas',
            str_starts_with($type, 'entrega.'),
            str_starts_with($type, 'venta.'),
            str_starts_with($type, 'cliente.'),
            str_starts_with($type, 'preventista.') => 'entregas',
            str_starts_with($type, 'credito.'),
            str_starts_with($type, 'cuenta.')  => 'creditos',
            default                            => 'avisos', // recurrente.*, stock.*, etc.
        };
    }

    /**
     * Prefijos de `type` que pertenecen a una categoría (para filtrar en SQL).
     *
     * @return string[]|null  null = "avisos" (todo lo que no cae en otra categoría)
     */
    public static function prefijos(string $categoria): ?array
    {
        return match ($categoria) {
            'proformas' => ['proforma.'],
            'entregas'  => ['entrega.', 'venta.', 'cliente.', 'preventista.'],
            'creditos'  => ['credito.', 'cuenta.'],
            default     => null,
        };
    }

    /**
     * Filtra una consulta sobre `notifications` por categoría (columna `type`).
     *
     * @param  \Illuminate\Database\Eloquent\Builder|\Illuminate\Database\Query\Builder  $query
     */
    public static function aplicarCategoria($query, string $categoria, string $columna = 'type'): void
    {
        $prefijos = self::prefijos($categoria);

        if ($prefijos !== null) {
            $query->where(function ($q) use ($prefijos, $columna) {
                foreach ($prefijos as $p) {
                    $q->orWhere($columna, 'like', $p . '%');
                }
            });
            return;
        }

        // "avisos": todo lo que no pertenece a otra categoría
        foreach (['proformas', 'entregas', 'creditos'] as $otra) {
            foreach (self::prefijos($otra) as $p) {
                $query->where($columna, 'not like', $p . '%');
            }
        }
    }

    public static function present(Notification $n): array
    {
        $d    = is_array($n->data) ? $n->data : (json_decode((string) $n->data, true) ?: []);
        $type = (string) $n->type;

        [$titulo, $mensaje] = self::textos($type, $d);

        return [
            'id'         => $n->id,
            'type'       => $type,
            'categoria'  => self::categoria($type),
            'titulo'     => $titulo,
            'mensaje'    => $mensaje,
            'url'        => self::url($n, $d),
            // Ids para que la app móvil navegue a su propia pantalla
            'proforma_id' => $n->proforma_id,
            'venta_id'    => $n->venta_id ?: (isset($d['venta_id']) ? (int) $d['venta_id'] : null),
            'entrega_id'  => isset($d['entrega_id']) ? (int) $d['entrega_id'] : null,
            'leida'      => (bool) $n->read,
            'created_at' => $n->created_at?->toIso8601String(),
        ];
    }

    /** @return array{0:string,1:string} */
    private static function textos(string $type, array $d): array
    {
        $cliente  = $d['cliente_nombre'] ?? 'Cliente';
        $proforma = $d['proforma_numero'] ?? '';
        $venta    = $d['venta_numero'] ?? '';
        $entrega  = ($d['entrega_numero'] ?? '') ?: ($d['numero_entrega'] ?? '');
        $total    = isset($d['total']) ? ' · Bs. ' . number_format((float) $d['total'], 2) : '';
        $chofer   = $d['chofer_nombre'] ?? ($d['chofer'] ?? null);

        return match ($type) {
            'proforma.creada'      => ['📋 Nueva proforma', trim("{$proforma} · {$cliente}{$total}", ' ·')],
            'proforma.actualizada' => ['📝 Proforma actualizada', trim("{$proforma} · {$cliente}{$total}", ' ·')],
            'proforma.aprobada'    => ['✅ Proforma aprobada', trim("{$proforma} · {$cliente}" . (isset($d['aprobador']) ? " · por {$d['aprobador']}" : ''), ' ·')],
            'proforma.rechazada'   => ['❌ Proforma rechazada', trim("{$proforma} · {$cliente}" . (isset($d['motivo_rechazo']) ? " · {$d['motivo_rechazo']}" : ''), ' ·')],
            'proforma.convertida'  => ['🔄 Proforma convertida', trim("{$proforma} → {$venta} · {$cliente}", ' ·→')],
            'proforma.coordinacion.actualizada' => ['🗓️ Coordinación actualizada', trim("{$proforma} · {$cliente}", ' ·')],

            'entrega.creada'          => ['📦 Nueva entrega', trim(($entrega ?: '#' . ($d['entrega_id'] ?? '')) . ($chofer ? " · {$chofer}" : ''), ' ·')],
            'entrega.asignada',
            'entrega.chofer_asignado' => ['🚚 Entrega asignada', trim("{$entrega}" . ($chofer ? " · {$chofer}" : '') . (isset($d['vehiculo_placa']) ? " · {$d['vehiculo_placa']}" : ''), ' ·')],
            'entrega.venta_asignada'  => ['🧾 Venta asignada a entrega', trim("{$venta} → {$entrega} · {$cliente}", ' ·→')],
            'entrega.estado_cambio'   => ['🔁 Entrega cambió de estado', trim("{$entrega} · " . self::estado($d['estado_nuevo'] ?? ''), ' ·')],
            'entrega.listo_para_entrega' => ['📤 Entrega lista para salir', trim("{$entrega}" . ($chofer ? " · {$chofer}" : ''), ' ·')],

            'venta.en-transito', 'venta.en_transito' => ['🚚 Venta en camino', trim(($venta ?: $entrega) . " · {$cliente}", ' ·')],
            'venta.preparacion_carga'                => ['📦 Preparando carga', trim("{$entrega} · {$cliente}", ' ·')],
            'venta.estado_logistico_cambio'          => ['🔁 Cambio de estado logístico', trim("{$entrega} · " . self::estado($d['estado_nuevo'] ?? ''), ' ·')],
            'venta.confirmada.entrega',
            'cliente.venta.confirmada',
            'preventista.venta.confirmada'           => ['✅ Venta entregada', trim("{$venta} · {$cliente} · " . self::estado($d['tipo_confirmacion'] ?? ''), ' ·')],
            'cliente.entrega_listo'                  => ['📤 Pedido salió a entrega', trim("{$venta}" . ($chofer ? " · {$chofer}" : ''), ' ·')],

            'stock.disponible' => [$d['titulo'] ?? '📦 Nuevo stock disponible', trim(($d['compra_numero'] ?? '') . ' · ' . ($d['proveedor_nombre'] ?? ''), ' ·')],

            default => self::generico($type, $d),
        };
    }

    /** @return array{0:string,1:string} */
    private static function generico(string $type, array $d): array
    {
        if (str_starts_with($type, 'recurrente.')) {
            return ['🔔 ' . ($d['titulo'] ?? 'Aviso'), (string) ($d['descripcion'] ?? '')];
        }

        $titulo = $d['titulo'] ?? ucfirst(str_replace(['.', '_', '-'], ' ', $type));

        return ['🔔 ' . $titulo, (string) ($d['mensaje'] ?? '')];
    }

    private static function url(Notification $n, array $d): ?string
    {
        if ($n->proforma_id && str_starts_with($n->type, 'proforma.') && ! ($n->type === 'proforma.convertida' && $n->venta_id)) {
            return "/proformas/{$n->proforma_id}";
        }
        if ($n->venta_id) {
            return "/ventas/{$n->venta_id}";
        }
        if (! empty($d['entrega_id'])) {
            return "/logistica/entregas/{$d['entrega_id']}";
        }
        if ($n->proforma_id) {
            return "/proformas/{$n->proforma_id}";
        }

        return null;
    }

    private static function estado(string $codigo): string
    {
        return ucfirst(strtolower(str_replace('_', ' ', $codigo)));
    }
}
