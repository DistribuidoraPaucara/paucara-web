<?php

namespace App\Http\Controllers;

use App\Models\ConfiguracionGlobal;
use Illuminate\Http\Request;

class ConfiguracionGlobalController extends Controller
{
    /**
     * Mostrar todas las configuraciones
     */
    public function index()
    {
        $configuraciones = ConfiguracionGlobal::activos()
            ->orderBy('categoria')
            ->orderBy('nombre')
            ->get()
            ->groupBy('categoria');

        return response()->json([
            'configuraciones' => $configuraciones,
            'categorias' => $configuraciones->keys(),
        ]);
    }

    /**
     * Obtener configuración específica por clave
     */
    public function show(string $clave)
    {
        $configuracion = ConfiguracionGlobal::where('clave', $clave)
            ->where('activo', true)
            ->first();

        if (! $configuracion) {
            return response()->json(['error' => 'Configuración no encontrada'], 404);
        }

        return response()->json($configuracion);
    }

    /**
     * Actualizar configuración
     */
    public function update(Request $request, string $clave)
    {
        $configuracion = ConfiguracionGlobal::where('clave', $clave)->first();

        if (! $configuracion) {
            return response()->json(['error' => 'Configuración no encontrada'], 404);
        }

        // Validaciones según el tipo de valor
        $rules = match ($configuracion->tipo_valor) {
            'decimal' => ['valor' => 'required|numeric|min:0'],
            'integer' => ['valor' => 'required|integer|min:0'],
            'boolean' => ['valor' => 'required|boolean'],
            'string' => ['valor' => 'required|string|max:255'],
            default => ['valor' => 'required'],
        };

        $request->validate($rules);

        $valor = $request->input('valor');
        $valorNumerico = is_numeric($valor) ? (float) $valor : null;

        $configuracion->update([
            'valor' => $this->convertirATexto($valor),
            'valor_numerico' => $valorNumerico,
            'descripcion' => $request->input('descripcion', $configuracion->descripcion),
        ]);

        // Limpiar cache
        ConfiguracionGlobal::limpiarCache();

        return response()->json([
            'message' => 'Configuración actualizada correctamente',
            'configuracion' => $configuracion->fresh(),
        ]);
    }

    /**
     * Obtener configuraciones de ganancias
     */
    public function configuracionesGanancias()
    {
        $configuraciones = ConfiguracionGlobal::configuracionesGanancias();

        return response()->json([
            'porcentaje_interes_general' => $configuraciones['porcentaje_interes_general'] ?? 20.0,
            'margen_minimo_global' => $configuraciones['margen_minimo_global'] ?? 10.0,
            'aplicar_interes_automatico' => $configuraciones['aplicar_interes_automatico'] ?? true,
        ]);
    }

    /**
     * Actualizar configuraciones de ganancias en lote
     */
    public function actualizarConfiguracionesGanancias(Request $request)
    {
        $request->validate([
            'porcentaje_interes_general' => 'required|numeric|min:0|max:100',
            'margen_minimo_global' => 'required|numeric|min:0|max:100',
            'aplicar_interes_automatico' => 'required|boolean',
        ]);

        $configuraciones = [
            'porcentaje_interes_general' => $request->input('porcentaje_interes_general'),
            'margen_minimo_global' => $request->input('margen_minimo_global'),
            'aplicar_interes_automatico' => $request->input('aplicar_interes_automatico'),
        ];

        foreach ($configuraciones as $clave => $valor) {
            ConfiguracionGlobal::establecer($clave, $valor, null, null, 'ganancias');
        }

        return response()->json([
            'message' => 'Configuraciones de ganancias actualizadas correctamente',
            'configuraciones' => ConfiguracionGlobal::configuracionesGanancias(),
        ]);
    }

    /**
     * Crear nueva configuración
     */
    public function store(Request $request)
    {
        $request->validate([
            'clave' => 'required|string|unique:configuracion_global,clave',
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'valor' => 'required',
            'tipo_valor' => 'required|in:string,integer,decimal,boolean,array',
            'categoria' => 'required|string|max:50',
        ]);

        $valor = $request->input('valor');
        $valorNumerico = is_numeric($valor) ? (float) $valor : null;

        $configuracion = ConfiguracionGlobal::create([
            'clave' => $request->input('clave'),
            'nombre' => $request->input('nombre'),
            'descripcion' => $request->input('descripcion'),
            'tipo_valor' => $request->input('tipo_valor'),
            'valor' => $this->convertirATexto($valor),
            'valor_numerico' => $valorNumerico,
            'categoria' => $request->input('categoria'),
            'activo' => true,
            'es_sistema' => false,
            'metadatos' => $request->input('metadatos', []),
        ]);

        return response()->json([
            'message' => 'Configuración creada correctamente',
            'configuracion' => $configuracion,
        ], 201);
    }

    /**
     * Resetear configuración a valores por defecto
     */
    public function resetear(string $clave)
    {
        $configuracion = ConfiguracionGlobal::where('clave', $clave)->first();

        if (! $configuracion) {
            return response()->json(['error' => 'Configuración no encontrada'], 404);
        }

        if (! $configuracion->es_sistema) {
            return response()->json(['error' => 'Solo se pueden resetear configuraciones del sistema'], 400);
        }

        // Valores por defecto según la clave
        $valoresPorDefecto = [
            'porcentaje_interes_general' => '20.00',
            'margen_minimo_global' => '10.00',
            'aplicar_interes_automatico' => 'true',
        ];

        if (! isset($valoresPorDefecto[$clave])) {
            return response()->json(['error' => 'No hay valor por defecto para esta configuración'], 400);
        }

        $valor = $valoresPorDefecto[$clave];
        $valorNumerico = is_numeric($valor) ? (float) $valor : null;

        $configuracion->update([
            'valor' => $valor,
            'valor_numerico' => $valorNumerico,
        ]);

        // Limpiar cache
        ConfiguracionGlobal::limpiarCache();

        return response()->json([
            'message' => 'Configuración reseteada a valor por defecto',
            'configuracion' => $configuracion->fresh(),
        ]);
    }

    /**
     * Convertir valor a texto para almacenamiento
     */
    private function convertirATexto($valor): string
    {
        if (is_bool($valor)) {
            return $valor ? 'true' : 'false';
        }
        if (is_array($valor)) {
            return json_encode($valor);
        }

        return (string) $valor;
    }
}
