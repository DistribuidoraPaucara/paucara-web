<?php

namespace App\Http\Controllers;

use App\Models\ConfiguracionSitio;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ConfiguracionSitioController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('configuracion-sitio/index', [
            'configuracion' => ConfiguracionSitio::actual(),
        ]);
    }

    public function edit(): Response
    {
        return Inertia::render('configuracion-sitio/form', [
            'configuracion' => ConfiguracionSitio::actual(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'nombre' => ['required', 'string', 'max:255'],
            'imagen' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:5120'],
        ]);

        $configuracion = ConfiguracionSitio::actual()
            ?? ConfiguracionSitio::query()->create([
                'nombre' => $data['nombre'],
                'activo' => true,
            ]);

        if ($request->hasFile('imagen')) {
            $this->eliminarImagenAnterior($configuracion->imagen);
            $ruta = $request->file('imagen')->store('configuracion-sitio', 'public');
            $data['imagen'] = '/storage/' . $ruta;
        }

        $configuracion->update($data);

        return to_route('configuracion-sitio.index')
            ->with('success', 'La configuración del sitio fue actualizada correctamente.');
    }

    private function eliminarImagenAnterior(?string $imagen): void
    {
        if (! $imagen || ! str_starts_with($imagen, '/storage/configuracion-sitio/')) {
            return;
        }

        Storage::disk('public')->delete(ltrim(str_replace('/storage/', '', $imagen), '/'));
    }
}
