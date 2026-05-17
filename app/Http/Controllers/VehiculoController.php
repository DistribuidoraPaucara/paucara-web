<?php
namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Http\Requests\VehiculoRequest;
use App\Models\Empleado;
use App\Models\Vehiculo;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class VehiculoController extends Controller
{
    public function index(Request $request): Response
    {
        $q        = $request->string('q');
        $activo   = $request->query('activo');
        $orderBy  = $request->string('order_by', 'placa');
        $orderDir = $request->string('order_dir', 'asc');

        // Validar columnas permitidas para ordenamiento
        $allowedOrderColumns = ['id', 'placa', 'marca', 'modelo', 'anho', 'capacidad_kg'];
        if (! in_array($orderBy, $allowedOrderColumns)) {
            $orderBy = 'placa';
        }

        $items = Vehiculo::query()
            ->when($q, fn($qq) => $qq->where(function ($query) use ($q) {
                $query->where('placa', 'ilike', "%{$q}%")
                    ->orWhere('marca', 'ilike', "%{$q}%")
                    ->orWhere('modelo', 'ilike', "%{$q}%");
            }))
            ->when($activo !== null, fn($qq) => $qq->where('activo', $activo === '1'))
            ->orderBy($orderBy, $orderDir)
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('inventario/vehiculos/index', [
            'vehiculos' => $items,
            'filters'   => [
                'q'         => $q,
                'activo'    => $activo,
                'order_by'  => $orderBy,
                'order_dir' => $orderDir,
            ],
        ]);
    }

    public function create(): Response
    {
        // ✅ Obtener choferes desde empleados activos con rol de Chofer (case-insensitive)
        $choferesEmpleados = Empleado::query()
            ->with(['user', 'user.roles'])
            ->where('estado', 'activo')
            ->get()
            ->filter(fn($e) =>
                $e->user !== null &&
                $e->user->roles->some(fn($role) => strtolower($role->name) === 'chofer')
            )
            ->map(fn($e) => [
                'value' => $e->id,
                'label' => $e->user->name ?? $e->nombre,
            ]);

        // ✅ También buscar usuarios con rol de Chofer que no estén en empleados (case-insensitive)
        $choferesUsuarios = \App\Models\User::query()
            ->with('roles')
            ->whereHas('roles', fn($q) => $q->whereRaw('LOWER(name) = ?', ['chofer']))
            ->whereDoesntHave('empleado')
            ->get()
            ->map(fn($u) => [
                'value' => $u->id,
                'label' => $u->name . ' (Usuario)',
            ]);

        // Combinar ambas listas
        $choferes = $choferesEmpleados->merge($choferesUsuarios)->values();

        return Inertia::render('inventario/vehiculos/form', [
            'entity'   => null,
            'choferes' => $choferes,
        ]);
    }

    public function store(VehiculoRequest $request): RedirectResponse
    {
        $data           = $request->validated();
        $data['activo'] = $data['activo'] ?? true;

        Vehiculo::create($data);

        return redirect()->route('inventario.vehiculos.index')->with('success', 'Vehículo creado');
    }

    public function edit(Vehiculo $vehiculo): Response
    {
        // ✅ Obtener choferes desde empleados activos con rol de Chofer (case-insensitive)
        $choferesEmpleados = Empleado::query()
            ->with(['user', 'user.roles'])
            ->where('estado', 'activo')
            ->get()
            ->filter(fn($e) =>
                $e->user !== null &&
                $e->user->roles->some(fn($role) => strtolower($role->name) === 'chofer')
            )
            ->map(fn($e) => [
                'value' => $e->id,
                'label' => $e->user->name ?? $e->nombre,
            ]);

        // ✅ También buscar usuarios con rol de Chofer que no estén en empleados (case-insensitive)
        $choferesUsuarios = \App\Models\User::query()
            ->with('roles')
            ->whereHas('roles', fn($q) => $q->whereRaw('LOWER(name) = ?', ['chofer']))
            ->whereDoesntHave('empleado')
            ->get()
            ->map(fn($u) => [
                'value' => $u->id,
                'label' => $u->name . ' (Usuario)',
            ]);

        // Combinar ambas listas
        $choferes = $choferesEmpleados->merge($choferesUsuarios)->values();

        return Inertia::render('inventario/vehiculos/form', [
            'entity'   => $vehiculo,
            'choferes' => $choferes,
        ]);
    }

    public function update(VehiculoRequest $request, Vehiculo $vehiculo): RedirectResponse
    {
        $vehiculo->update($request->validated());

        return redirect()->route('inventario.vehiculos.index')->with('success', 'Vehículo actualizado');
    }

    public function destroy(Vehiculo $vehiculo): RedirectResponse
    {
        // En lugar de borrar, marcar inactivo por seguridad
        $vehiculo->update(['activo' => false]);

        return redirect()->route('inventario.vehiculos.index')->with('success', 'Vehículo desactivado');
    }

    // API
    public function apiIndex()
    {
        $vehiculos = Vehiculo::activos()->get();

        return ApiResponse::success($vehiculos);
    }

    public function apiShow(Vehiculo $vehiculo)
    {
        return ApiResponse::success($vehiculo);
    }

    /**
     * POST /api/vehiculos/sugerir
     * Sugerir vehículo recomendado basado en peso total
     *
     * Request:
     *   - peso_total: float (kg)
     *
     * Response:
     *   - recomendado: { id, placa, marca, modelo, capacidad_kg, porcentaje_uso }
     *   - disponibles: [ { id, placa, marca, modelo, capacidad_kg, porcentaje_uso, estado } ]
     */
    public function apiSugerir(Request $request)
    {
        try {
            $pesoTotal = (float) $request->input('peso_total', 0);
            $ventaIds  = $request->input('venta_ids', []);

            if ($pesoTotal <= 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'El peso total debe ser mayor a 0',
                ], 422);
            }

            // Obtener localidad de destino de las ventas seleccionadas
            $localidadesDestino = [];
            if (! empty($ventaIds)) {
                $localidadesDestino = \App\Models\Venta::whereIn('id', $ventaIds)
                    ->with('cliente')
                    ->get()
                    ->pluck('cliente.localidad_id')
                    ->filter()
                    ->unique()
                    ->values()
                    ->toArray();
            }

            // Permitir múltiples localidades de destino
            $localidadDestino = $localidadesDestino[0] ?? null;
            Log::info('Recomendación de vehículo', [
                'peso_total'        => $pesoTotal,
                'localidad_destino' => $localidadDestino,
                'venta_ids'         => $ventaIds,
            ]);

            // Obtener vehículos activos ordenados por capacidad (menor primero)
            // 🔧 MODIFICADO: Listar TODOS los vehículos activos (sin filtro de estado)
            $vehiculosDisponibles = Vehiculo::where('activo', true)
                ->with('choferAsignado', 'entregas')
                ->orderBy('capacidad_kg', 'asc')
                ->get()
                ->map(function ($vehiculo) use ($pesoTotal) {
                    $pesoCargado                 = $vehiculo->obtenerPesoCargado();
                    $capacidadDisponible         = $vehiculo->obtenerCapacidadDisponible();
                    $porcentajeUsoActual         = round(($pesoCargado / $vehiculo->capacidad_kg) * 100, 1);
                    $porcentajeUsoConNuevasCarga = round((($pesoCargado + $pesoTotal) / $vehiculo->capacidad_kg) * 100, 1);
                    $tieneCapacidad              = $vehiculo->tieneCapacidadPara($pesoTotal);

                    // Debug logging
                    Log::info('Mapeando vehículo (TODOS):', [
                        'vehiculo_id'                      => $vehiculo->id,
                        'placa'                            => $vehiculo->placa,
                        'capacidad_total_kg'               => $vehiculo->capacidad_kg,
                        'peso_cargado_actual'              => $pesoCargado,
                        'capacidad_disponible'             => $capacidadDisponible,
                        'peso_nuevas_cargas'               => $pesoTotal,
                        'porcentaje_uso_actual'            => $porcentajeUsoActual,
                        'porcentaje_uso_con_nuevas_cargas' => $porcentajeUsoConNuevasCarga,
                        'tiene_capacidad'                  => $tieneCapacidad,
                    ]);

                    return [
                        'id'                               => $vehiculo->id,
                        'placa'                            => $vehiculo->placa,
                        'marca'                            => $vehiculo->marca,
                        'modelo'                           => $vehiculo->modelo,
                        'anho'                             => $vehiculo->anho,
                        'capacidad_kg'                     => $vehiculo->capacidad_kg,
                        'peso_cargado_actual'              => $pesoCargado,
                        'capacidad_disponible'             => $capacidadDisponible,
                        'porcentaje_uso_actual'            => $porcentajeUsoActual,
                        'porcentaje_uso_con_nuevas_cargas' => $porcentajeUsoConNuevasCarga,
                        'estado'                           => $vehiculo->estado,
                        'activo'                           => $vehiculo->activo,
                        'tiene_capacidad'                  => $tieneCapacidad,
                        'choferAsignado'                   => $vehiculo->choferAsignado ? [
                            'id'       => $vehiculo->choferAsignado->id,
                            'name'     => $vehiculo->choferAsignado->name,
                            'nombre'   => $vehiculo->choferAsignado->name,
                            'telefono' => $vehiculo->choferAsignado->phone ?? null,
                        ] : null,
                    ];
                });

            // El primero con capacidad es el recomendado (menor capacidad que cabe el peso)
            $recomendado = $vehiculosDisponibles->firstWhere('tiene_capacidad', true);

            if (! $recomendado) {
                // Si no hay vehículos con capacidad suficiente, retornar TODOS con alerta
                return response()->json([
                    'success' => true,
                    'message' => 'No hay vehículos con capacidad suficiente',
                    'data'    => [
                        'recomendado'       => null,
                        'peso_total'        => $pesoTotal,
                        'disponibles_count' => $vehiculosDisponibles->count(),
                        'disponibles'       => $vehiculosDisponibles->toArray(),
                        'alerta'            => 'CARGA EXCEDE CAPACIDAD',
                    ],
                ], 200);
            }

            return response()->json([
                'success' => true,
                'message' => 'Vehículo recomendado obtenido',
                'data'    => [
                    'recomendado'       => $recomendado,
                    'peso_total'        => $pesoTotal,
                    'disponibles_count' => $vehiculosDisponibles->count(),
                    'disponibles'       => $vehiculosDisponibles->toArray(),
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error sugerindo vehículo', [
                'peso_total' => $request->input('peso_total'),
                'error'      => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al sugerir vehículo: ' . $e->getMessage(),
            ], 500);
        }
    }
}
