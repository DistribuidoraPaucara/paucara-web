<?php

use App\Models\Producto;
use Illuminate\Support\Facades\Route;

Route::get('/test-stock-scope', function () {
    try {
        $productosStockBajo = Producto::query()->stockBajo()->count();
        $productosStockAlto = Producto::query()->stockAlto()->count();

        return response()->json([
            'status'               => 'success',
            'productos_stock_bajo' => $productosStockBajo,
            'productos_stock_alto' => $productosStockAlto,
            'message'              => 'Query scopes funcionan correctamente',
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status'  => 'error',
            'message' => $e->getMessage(),
            'line'    => $e->getLine(),
            'file'    => $e->getFile(),
        ]);
    }
});
