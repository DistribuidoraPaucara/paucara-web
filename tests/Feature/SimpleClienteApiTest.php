<?php

it('has working API response helper', function () {
    $response = \App\Helpers\ApiResponse::success(['test' => 'data'], 'Test successful');

    expect($response)->toBeInstanceOf(\Illuminate\Http\JsonResponse::class);
    expect($response->getData()->success)->toBe(true);
    expect($response->getData()->message)->toBe('Test successful');
    expect($response->getData()->data->test)->toBe('data');
});

it('has error API response helper', function () {
    $response = \App\Helpers\ApiResponse::error('Test error', 400);

    expect($response)->toBeInstanceOf(\Illuminate\Http\JsonResponse::class);
    expect($response->getData()->success)->toBe(false);
    expect($response->getData()->message)->toBe('Test error');
    expect($response->getStatusCode())->toBe(400);
});

it('has ClienteController with API methods', function () {
    $controller = new \App\Http\Controllers\ClienteController;

    expect(method_exists($controller, 'indexApi'))->toBe(true);
    expect(method_exists($controller, 'storeApi'))->toBe(true);
    expect(method_exists($controller, 'updateApi'))->toBe(true);
    expect(method_exists($controller, 'destroyApi'))->toBe(true);
    expect(method_exists($controller, 'buscarApi'))->toBe(true);
});

it('has DireccionClienteApiController methods exist', function () {
    expect(method_exists(\App\Http\Controllers\DireccionClienteApiController::class, 'index'))->toBe(true);
    expect(method_exists(\App\Http\Controllers\DireccionClienteApiController::class, 'store'))->toBe(true);
    expect(method_exists(\App\Http\Controllers\DireccionClienteApiController::class, 'update'))->toBe(true);
    expect(method_exists(\App\Http\Controllers\DireccionClienteApiController::class, 'destroy'))->toBe(true);
    expect(method_exists(\App\Http\Controllers\DireccionClienteApiController::class, 'establecerPrincipal'))->toBe(true);
});
