<?php

namespace App\Http\Controllers;

use App\Models\CuentaPorCobrar;
use App\Models\User;
use Illuminate\Http\Request;

class AlertasController extends Controller
{
    /**
     * Obtiene todas las cuentas por cobrar vencidas del usuario autenticado
     * Agrupa por empresa y filtra por usuarios de la misma empresa
     */
    public function cuentasVencidas(Request $request)
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $empresaId = $user->empresa_id;

        // Obtener IDs de todos los usuarios de la empresa
        $userIds = User::where('empresa_id', $empresaId)->pluck('id');

        $cuentas = CuentaPorCobrar::with(['cliente:id,nombre'])
            ->vencidas()          // fecha_vencimiento < now()
            ->pendientes()        // saldo_pendiente > 0
            ->where('estado', '!=', 'PAGADO')
            ->where(function($q) use ($userIds) {
                $q->whereIn('usuario_id', $userIds)
                  ->orWhereNull('usuario_id'); // incluir cuentas sin usuario asignado (migradas)
            })
            ->orderByDesc('dias_vencido')
            ->limit(50)
            ->get();

        return response()->json([
            'total'        => $cuentas->count(),
            'monto_total'  => (float) $cuentas->sum('saldo_pendiente'),
            'cuentas'      => $cuentas->map(fn($c) => [
                'id'                   => $c->id,
                'cliente_nombre'       => $c->cliente?->nombre ?? 'Sin cliente',
                'saldo_pendiente'      => (float) $c->saldo_pendiente,
                'dias_vencido'         => $c->dias_vencido ?? 0,
                'fecha_vencimiento'    => $c->fecha_vencimiento?->format('Y-m-d'),
                'referencia_documento' => $c->referencia_documento,
                'estado'               => $c->estado,
            ]),
        ]);
    }
}
