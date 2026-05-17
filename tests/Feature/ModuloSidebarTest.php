<?php

use App\Models\ModuloSidebar;
use App\Models\User;

it('puede obtener módulos del sidebar desde la API', function () {
    // Crear un usuario de prueba
    $user = User::factory()->create();

    // Actuar como el usuario autenticado
    $this->actingAs($user);

    // Llamar al endpoint de la API
    $response = $this->get('/api/modulos-sidebar');

    // Verificar que la respuesta es exitosa
    $response->assertStatus(200);

    // Verificar que la respuesta tiene el formato correcto
    $data = $response->json();
    expect($data)->toBeArray();

    if (count($data) > 0) {
        expect($data[0])->toHaveKeys(['title', 'href', 'icon']);
    }
});

it('puede obtener módulos usando el modelo', function () {
    // Probar el método del modelo
    $modulos = ModuloSidebar::obtenerParaSidebar();

    expect($modulos)->toBeInstanceOf(\Illuminate\Database\Eloquent\Collection::class);

    if ($modulos->count() > 0) {
        $navItem = $modulos->first()->toNavItem();
        expect($navItem)->toHaveKeys(['title', 'href', 'icon']);
    }
});

it('convierte correctamente un módulo a formato NavItem', function () {
    // Crear un módulo de prueba
    $modulo = ModuloSidebar::factory()->create([
        'titulo' => 'Test Module',
        'ruta' => '/test',
        'icono' => 'Package',
        'activo' => true,
        'es_submenu' => false,
    ]);

    $navItem = $modulo->toNavItem();

    expect($navItem)->toEqual([
        'title' => 'Test Module',
        'href' => '/test',
        'icon' => 'Package',
    ]);
});

it('incluye submódulos en el formato NavItem', function () {
    // Crear módulo padre
    $padre = ModuloSidebar::factory()->create([
        'titulo' => 'Parent Module',
        'ruta' => '/parent',
        'icono' => 'Package',
        'activo' => true,
        'es_submenu' => false,
    ]);

    // Crear submódulo
    $submodulo = ModuloSidebar::factory()->create([
        'titulo' => 'Child Module',
        'ruta' => '/parent/child',
        'icono' => 'Tags',
        'activo' => true,
        'es_submenu' => true,
        'modulo_padre_id' => $padre->id,
    ]);

    $navItem = $padre->fresh(['submodulos'])->toNavItem();

    expect($navItem['children'])->toHaveCount(1);
    expect($navItem['children'][0])->toEqual([
        'title' => 'Child Module',
        'href' => '/parent/child',
        'icon' => 'Tags',
    ]);
});
