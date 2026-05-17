<?php

it('uses the correct table name for DetalleCompra model', function () {
    $model = new \App\Models\DetalleCompra;
    expect($model->getTable())->toBe('detalle_compras');
});
