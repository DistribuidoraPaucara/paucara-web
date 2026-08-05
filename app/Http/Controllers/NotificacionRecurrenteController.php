<?php

namespace App\Http\Controllers;

use App\Models\NotificacionRecurrente;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificacionRecurrenteController extends Controller
{
    /**
     * Mostrar lista de notificaciones recurrentes
     */
    public function index(Request $request)
    {
        $query = NotificacionRecurrente::query();

        // Filtros
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where('titulo', 'like', "%{$search}%")
                ->orWhere('descripcion', 'like', "%{$search}%");
        }

        if ($request->filled('tipo')) {
            $query->where('tipo', $request->get('tipo'));
        }

        if ($request->filled('frecuencia')) {
            $query->where('frecuencia', $request->get('frecuencia'));
        }

        if ($request->filled('estado')) {
            $estado = $request->get('estado');
            if ($estado === 'activo') {
                $query->where('activo', true);
            } elseif ($estado === 'inactivo') {
                $query->where('activo', false);
            }
        }

        $notificaciones = $query
            ->with('usuario:id,name')
            ->latest()
            ->paginate(15);

        return Inertia::render('admin/notificaciones-recurrentes', [
            'notificaciones' => $notificaciones,
            'filters' => $request->only(['search', 'tipo', 'frecuencia', 'estado']),
            'estadisticas' => [
                'total' => NotificacionRecurrente::count(),
                'activas' => NotificacionRecurrente::where('activo', true)->count(),
                'inactivas' => NotificacionRecurrente::where('activo', false)->count(),
                'proximas' => NotificacionRecurrente::activas()->vigentes()->count(),
            ],
        ]);
    }

    /**
     * Crear notificación recurrente
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'tipo' => 'required|in:promocion,informativo,evento,oferta,otro',
            'frecuencia' => 'required|in:una_vez,diario,semanal,mensual',
            'hora_envio' => 'required|date_format:H:i',
            'dias_semana' => 'nullable|json',
            'dia_mes' => 'nullable|integer|min:1|max:31',
            'fecha_inicio' => 'nullable|date',
            'fecha_fin' => 'nullable|date|after_or_equal:fecha_inicio',
            'activo' => 'boolean',
        ]);

        $validated['usuario_id'] = auth()->id();

        $notificacion = NotificacionRecurrente::create($validated);

        return response()->json([
            'success' => true,
            'message' => '✅ Notificación creada exitosamente',
            'notificacion' => $notificacion,
        ], 201);
    }

    /**
     * Obtener una notificación recurrente
     */
    public function show(NotificacionRecurrente $notificacion)
    {
        return response()->json($notificacion->load('usuario'));
    }

    /**
     * Actualizar notificación recurrente
     */
    public function update(Request $request, NotificacionRecurrente $notificacion)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'tipo' => 'required|in:promocion,informativo,evento,oferta,otro',
            'frecuencia' => 'required|in:una_vez,diario,semanal,mensual',
            'hora_envio' => 'required|date_format:H:i',
            'dias_semana' => 'nullable|json',
            'dia_mes' => 'nullable|integer|min:1|max:31',
            'fecha_inicio' => 'nullable|date',
            'fecha_fin' => 'nullable|date|after_or_equal:fecha_inicio',
            'activo' => 'boolean',
        ]);

        $notificacion->update($validated);

        return response()->json([
            'success' => true,
            'message' => '✅ Notificación actualizada exitosamente',
            'notificacion' => $notificacion,
        ]);
    }

    /**
     * Eliminar notificación recurrente
     */
    public function destroy(NotificacionRecurrente $notificacion)
    {
        $notificacion->delete();

        return response()->json([
            'success' => true,
            'message' => '✅ Notificación eliminada exitosamente',
        ]);
    }

    /**
     * Obtener notificaciones pendientes por enviar
     * (Llamado por el scheduler)
     */
    public function obtenerPendientes()
    {
        $hora_actual = now()->format('H:i');

        $pendientes = NotificacionRecurrente::activas()
            ->vigentes()
            ->whereTime('hora_envio', '<=', $hora_actual)
            ->where(function ($query) {
                // No se ha enviado hoy (para recurrentes) o nunca (para una_vez)
                $query->whereNull('ultimo_envio')
                    ->orWhereDate('ultimo_envio', '<', now());
            })
            ->get()
            ->filter(fn ($notif) => $notif->debeEnviarseHoy());

        return response()->json([
            'success' => true,
            'total' => $pendientes->count(),
            'notificaciones' => $pendientes->values(),
        ]);
    }

    /**
     * Enviar notificación a todos los clientes conectados por WebSocket
     */
    public function enviar(Request $request, NotificacionRecurrente $notificacion)
    {
        try {
            // Emitir por WebSocket a todos los clientes
            broadcast(new \App\Events\NotificacionRecurrenteEmitida($notificacion));

            // Registrar envío
            $notificacion->registrarEnvio(1);

            return response()->json([
                'success' => true,
                'message' => '✅ Notificación enviada exitosamente',
                'notificacion' => $notificacion,
            ]);
        } catch (\Exception $e) {
            \Log::error('Error enviando notificación recurrente: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => '❌ Error al enviar la notificación',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtener notificaciones pendientes para la app
     */
    public function pendientesApp()
    {
        $notificaciones = NotificacionRecurrente::activas()
            ->vigentes()
            ->latest('ultimo_envio')
            ->limit(10)
            ->get(['id', 'titulo', 'descripcion', 'tipo', 'ultimo_envio']);

        return response()->json([
            'success' => true,
            'notificaciones' => $notificaciones,
        ]);
    }
}
