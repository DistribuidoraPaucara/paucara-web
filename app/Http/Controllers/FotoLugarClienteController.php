<?php
namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Http\Traits\ApiInertiaUnifiedResponse;
use App\Models\Cliente;
use App\Models\FotoLugarCliente;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FotoLugarClienteController extends Controller
{
    use ApiInertiaUnifiedResponse;

    /**
     * Mostrar todas las fotos de un cliente
     */
    public function index(Request $request, Cliente $cliente)
    {
        try {
            // ✅ Autorizar: Solo el Preventista del cliente o Admin pueden ver las fotos
            $this->authorize('view', $cliente);

            $fotos = $cliente->fotosLugar()
                ->when($request->has('direccion_id'), function ($query) use ($request) {
                    return $query->where('direccion_cliente_id', $request->direccion_id);
                })
                ->orderByDesc('fecha_captura')
                ->get();

            if ($this->isApiRequest()) {
                return ApiResponse::success($fotos);
            }

            return $this->dataResponse('clientes.fotos.index', [
                'cliente' => $cliente,
                'fotos'   => $fotos,
            ]);
        } catch (\Exception $e) {
            return $this->handleException($e, 'obtener fotos del cliente');
        }
    }

    /**
     * Formulario para subir nuevas fotos
     */
    public function create(Cliente $cliente)
    {
        try {
            // ✅ Autorizar: Solo el Preventista del cliente o Admin pueden crear fotos
            $this->authorize('update', $cliente);

            $direcciones = $cliente->direcciones()->where('activa', true)->get();

            return $this->dataResponse('clientes.fotos.form', [
                'cliente'     => $cliente,
                'direcciones' => $direcciones,
                'foto'        => null,
            ]);
        } catch (\Exception $e) {
            return $this->handleException($e, 'formulario de subida de fotos');
        }
    }

    /**
     * Guardar una nueva foto
     */
    public function store(Request $request, Cliente $cliente)
    {
        try {
            // ✅ Autorizar: Solo el Preventista del cliente o Admin pueden guardar fotos
            $this->authorize('update', $cliente);

            $validated = $request->validate([
                'foto'                 => 'required|image|max:10240', // Max 10MB
                'descripcion'          => 'nullable|string|max:255',
                'direccion_cliente_id' => 'nullable|exists:direcciones_cliente,id',
            ]);
            // Generar ruta dinámica para la imagen
            $folderPath = 'clientes/' . $cliente->id . '/fotos_lugar';

            // Procesar y guardar la imagen
            $fotoPath = $request->file('foto')->store($folderPath, 'public');

            // Crear el registro en la base de datos
            $foto = new FotoLugarCliente([
                'cliente_id'           => $cliente->id,
                'direccion_cliente_id' => $request->direccion_cliente_id,
                'url'                  => $fotoPath,
                'descripcion'          => $request->descripcion,
                'fecha_captura'        => now(),
            ]);

            $foto->save();

            if ($this->isApiRequest()) {
                return ApiResponse::success($foto, 'Foto subida exitosamente', 201);
            }

            return $this->resourceResponse(
                $foto,
                'Foto subida exitosamente',
                route('clientes.fotos.index', $cliente->id)
            );
        } catch (\Exception $e) {
            return $this->handleException($e, 'subir foto del lugar');
        }
    }

    /**
     * Mostrar una foto específica
     */
    public function show(Cliente $cliente, FotoLugarCliente $foto)
    {
        try {
            // ✅ Autorizar: Solo el Preventista del cliente o Admin pueden ver las fotos
            $this->authorize('view', $cliente);

            // Validar que la foto pertenezca al cliente
            if ($foto->cliente_id !== $cliente->id) {
                return $this->errorResponse('La foto no pertenece a este cliente');
            }

            if ($this->isApiRequest()) {
                return ApiResponse::success($foto);
            }

            return $this->dataResponse('clientes.fotos.show', [
                'cliente' => $cliente,
                'foto'    => $foto,
            ]);
        } catch (\Exception $e) {
            return $this->handleException($e, 'ver foto del lugar');
        }
    }

    /**
     * Formulario para editar una foto
     */
    public function edit(Cliente $cliente, FotoLugarCliente $foto)
    {
        try {
            // ✅ Autorizar: Solo el Preventista del cliente o Admin pueden editar fotos
            $this->authorize('update', $cliente);

            // Validar que la foto pertenezca al cliente
            if ($foto->cliente_id !== $cliente->id) {
                return $this->errorResponse('La foto no pertenece a este cliente');
            }

            $direcciones = $cliente->direcciones()->where('activa', true)->get();

            return $this->dataResponse('clientes.fotos.form', [
                'cliente'     => $cliente,
                'direcciones' => $direcciones,
                'foto'        => $foto,
            ]);
        } catch (\Exception $e) {
            return $this->handleException($e, 'formulario de edición de foto');
        }
    }

    /**
     * Actualizar una foto existente
     */
    public function update(Request $request, Cliente $cliente, FotoLugarCliente $foto)
    {
        try {
            // ✅ Autorizar: Solo el Preventista del cliente o Admin pueden actualizar fotos
            $this->authorize('update', $cliente);

            // Validar que la foto pertenezca al cliente
            if ($foto->cliente_id !== $cliente->id) {
                return $this->errorResponse('La foto no pertenece a este cliente');
            }

            $validated = $request->validate([
                'foto'                 => 'nullable|image|max:10240', // Max 10MB
                'descripcion'          => 'nullable|string|max:255',
                'direccion_cliente_id' => 'nullable|exists:direcciones_cliente,id',
            ]);
            $updates = [
                'descripcion'          => $request->descripcion,
                'direccion_cliente_id' => $request->direccion_cliente_id,
            ];

            // Procesar y guardar nueva imagen si se proporcionó
            if ($request->hasFile('foto')) {
                // Eliminar imagen anterior
                if ($foto->url) {
                    Storage::disk('public')->delete($foto->url);
                }

                // Guardar nueva imagen
                $folderPath     = 'clientes/' . $cliente->id . '/fotos_lugar';
                $fotoPath       = $request->file('foto')->store($folderPath, 'public');
                $updates['url'] = $fotoPath;
            }

            $foto->update($updates);

            if ($this->isApiRequest()) {
                return ApiResponse::success($foto, 'Foto actualizada exitosamente');
            }

            return $this->resourceResponse(
                $foto,
                'Foto actualizada exitosamente',
                route('clientes.fotos.index', $cliente->id)
            );
        } catch (\Exception $e) {
            return $this->handleException($e, 'actualizar foto del lugar');
        }
    }

    /**
     * Eliminar una foto
     */
    public function destroy(Cliente $cliente, FotoLugarCliente $foto)
    {
        try {
            // ✅ Autorizar: Solo el Preventista del cliente o Admin pueden eliminar fotos
            $this->authorize('update', $cliente);

            // Validar que la foto pertenezca al cliente
            if ($foto->cliente_id !== $cliente->id) {
                return $this->errorResponse('La foto no pertenece a este cliente');
            }
            // Eliminar el archivo físico
            if ($foto->url) {
                Storage::disk('public')->delete($foto->url);
            }

            // Eliminar el registro de la base de datos
            $foto->delete();

            if ($this->isApiRequest()) {
                return ApiResponse::success(null, 'Foto eliminada exitosamente');
            }

            return $this->deleteResponse(
                'Foto eliminada exitosamente',
                route('clientes.fotos.index', $cliente->id)
            );
        } catch (\Exception $e) {
            return $this->handleException($e, 'eliminar foto del lugar');
        }
    }

    /**
     * API: Subir múltiples fotos a la vez
     */
    public function uploadMultiple(Request $request, Cliente $cliente): JsonResponse
    {
        $validated = $request->validate([
            'fotos'                => 'required|array',
            'fotos.*'              => 'required|image|max:10240', // Max 10MB cada imagen
            'descripcion'          => 'nullable|string|max:255',
            'direccion_cliente_id' => 'nullable|exists:direcciones_cliente,id',
        ]);

        try {
            $folderPath   = 'clientes/' . $cliente->id . '/fotos_lugar';
            $fotosSubidas = [];

            foreach ($request->file('fotos') as $foto) {
                $fotoPath = $foto->store($folderPath, 'public');

                $fotoLugar = new FotoLugarCliente([
                    'cliente_id'           => $cliente->id,
                    'direccion_cliente_id' => $request->direccion_cliente_id,
                    'url'                  => $fotoPath,
                    'descripcion'          => $request->descripcion,
                    'fecha_captura'        => now(),
                ]);

                $fotoLugar->save();
                $fotosSubidas[] = $fotoLugar;
            }

            return ApiResponse::success([
                'fotos'         => $fotosSubidas,
                'total_subidas' => count($fotosSubidas),
            ], 'Fotos subidas exitosamente', 201);
        } catch (\Exception $e) {
            return $this->handleException($e, 'subir múltiples fotos');
        }
    }
}
