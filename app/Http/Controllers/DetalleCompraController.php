<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Http\Requests\StoreDetalleCompraRequest;
use App\Http\Requests\UpdateDetalleCompraRequest;
use App\Models\DetalleCompra;
use Illuminate\Http\Response;

class DetalleCompraController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:compras.detalles.index')->only('index');
        $this->middleware('permission:compras.detalles.store')->only('store');
        $this->middleware('permission:compras.detalles.update')->only('update');
        $this->middleware('permission:compras.detalles.destroy')->only('destroy');
        $this->middleware('permission:compras.detalles.index')->only('show');
    }

    public function index()
    {
        $detalles = DetalleCompra::with(['compra', 'producto'])->get();

        return ApiResponse::success($detalles);
    }

    public function show($id)
    {
        $detalle = DetalleCompra::with(['compra', 'producto'])->findOrFail($id);

        return ApiResponse::success($detalle);
    }

    public function store(StoreDetalleCompraRequest $request)
    {
        $data = $request->validated();
        $detalle = DetalleCompra::create($data);

        return ApiResponse::success($detalle->load(['compra', 'producto']), 'Detalle de compra creado', Response::HTTP_CREATED);
    }

    public function update(UpdateDetalleCompraRequest $request, $id)
    {
        $detalle = DetalleCompra::findOrFail($id);
        $data = $request->validated();
        $detalle->update($data);

        return ApiResponse::success($detalle->fresh(['compra', 'producto']), 'Detalle de compra actualizado');
    }

    public function destroy($id)
    {
        $detalle = DetalleCompra::findOrFail($id);
        $detalle->delete();

        return ApiResponse::success(null, 'Detalle de compra eliminado');
    }
}
