<?php

use App\Models\Cliente;
use App\Models\Envio;
use App\Models\Proforma;
use App\Models\User;
use App\Models\Venta;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

it('puede ver el dashboard de logística', function () {
    $response = $this->get(route('logistica.dashboard'));

    $response->assertStatus(200);
    $response->assertInertia(fn($assert) => $assert
            ->component('logistica/dashboard')
            ->has('estadisticas')
            ->has('proformasRecientes')
            ->has('enviosActivos')
    );
});

it('muestra estadísticas correctas en el dashboard', function () {
    // Crear datos de prueba
    $cliente = Cliente::factory()->create();

    // proformas pendientes de app externa
    Proforma::factory()->count(3)->create([
        'estado'       => 'PENDIENTE',
        'canal_origen' => 'APP_EXTERNA',
        'cliente_id'   => $cliente->id,
    ]);

    // Envíos en tránsito
    $venta = Venta::factory()->create(['cliente_id' => $cliente->id]);
    Envio::factory()->count(2)->create([
        'estado'   => 'EN_RUTA',
        'venta_id' => $venta->id,
    ]);

    // Envíos entregados hoy
    Envio::factory()->create([
        'estado'        => 'ENTREGADO',
        'fecha_entrega' => today(),
        'venta_id'      => $venta->id,
    ]);

    $response = $this->get(route('logistica.dashboard'));

    $response->assertStatus(200);
    $response->assertInertia(fn($assert) => $assert
            ->component('logistica/dashboard')
            ->where('estadisticas.proformas_pendientes', 3)
            ->where('estadisticas.envios_en_transito', 2)
            ->where('estadisticas.envios_entregados_hoy', 1)
    );
});

it('puede ver el seguimiento de un envío', function () {
    $cliente = Cliente::factory()->create();
    $venta   = Venta::factory()->create(['cliente_id' => $cliente->id]);
    $envio   = Envio::factory()->create([
        'venta_id'           => $venta->id,
        'numero_seguimiento' => 'TEST123',
        'estado'             => 'EN_TRANSITO',
    ]);

    $response = $this->get(route('logistica.envios.seguimiento', $envio));

    $response->assertStatus(200);
    $response->assertInertia(fn($assert) => $assert
            ->component('logistica/seguimiento')
            ->has('envio')
            ->where('envio.numero_seguimiento', 'TEST123')
            ->where('envio.estado', 'EN_TRANSITO')
    );
});

it('puede aprobar una proforma desde la API', function () {
    $cliente  = Cliente::factory()->create();
    $proforma = Proforma::factory()->create([
        'estado'       => 'PENDIENTE',
        'canal_origen' => 'APP_EXTERNA',
        'cliente_id'   => $cliente->id,
    ]);

    $response = $this->postJson("/api/dashboard/proformas/{$proforma->id}/aprobar", [
        'comentario' => 'Aprobada para procesamiento',
    ]);

    $response->assertStatus(200);
    $response->assertJson([
        'success' => true,
        'message' => 'Proforma aprobada exitosamente',
    ]);

    $this->assertDatabaseHas('proformas', [
        'id'     => $proforma->id,
        'estado' => 'APROBADA',
    ]);
});

it('puede rechazar una proforma desde la API', function () {
    $cliente  = Cliente::factory()->create();
    $proforma = Proforma::factory()->create([
        'estado'       => 'PENDIENTE',
        'canal_origen' => 'APP_EXTERNA',
        'cliente_id'   => $cliente->id,
    ]);

    $response = $this->postJson("/api/dashboard/proformas/{$proforma->id}/rechazar", [
        'comentario' => 'Datos incorrectos',
    ]);

    $response->assertStatus(200);
    $response->assertJson([
        'success' => true,
        'message' => 'Proforma rechazada',
    ]);

    $this->assertDatabaseHas('proformas', [
        'id'                    => $proforma->id,
        'estado'                => 'RECHAZADA',
        'observaciones_rechazo' => 'Datos incorrectos',
    ]);
});

it('puede actualizar el estado de un envío', function () {
    $cliente = Cliente::factory()->create();
    $venta   = Venta::factory()->create(['cliente_id' => $cliente->id]);
    $envio   = Envio::factory()->create([
        'venta_id' => $venta->id,
        'estado'   => 'EN_TRANSITO',
    ]);

    $response = $this->postJson("/api/dashboard/envios/{$envio->id}/estado", [
        'estado' => 'ENTREGADO',
    ]);

    $response->assertStatus(200);
    $response->assertJson([
        'success' => true,
        'message' => 'Estado actualizado correctamente',
    ]);

    $this->assertDatabaseHas('envios', [
        'id'     => $envio->id,
        'estado' => 'ENTREGADO',
    ]);
});

it('puede actualizar la ubicación de un envío', function () {
    $cliente = Cliente::factory()->create();
    $venta   = Venta::factory()->create(['cliente_id' => $cliente->id]);
    $envio   = Envio::factory()->create([
        'venta_id' => $venta->id,
        'estado'   => 'EN_TRANSITO',
    ]);

    $response = $this->postJson("/api/dashboard/envios/{$envio->id}/ubicacion", [
        'latitud'  => -17.7833,
        'longitud' => -63.1667,
    ]);

    $response->assertStatus(200);
    $response->assertJson([
        'success' => true,
        'message' => 'Ubicación actualizada correctamente',
    ]);

    $this->assertDatabaseHas('envios', [
        'id'              => $envio->id,
        'latitud_actual'  => -17.7833,
        'longitud_actual' => -63.1667,
    ]);
});

it('puede listar proformas con filtros para el dashboard', function () {
    $cliente = Cliente::factory()->create();

    // Crear proformas con diferentes estados
    Proforma::factory()->create([
        'estado'       => 'PENDIENTE',
        'canal_origen' => 'APP_EXTERNA',
        'cliente_id'   => $cliente->id,
        'fecha'        => today(),
    ]);

    Proforma::factory()->create([
        'estado'       => 'APROBADA',
        'canal_origen' => 'APP_EXTERNA',
        'cliente_id'   => $cliente->id,
        'fecha'        => today(),
    ]);

    // Filtrar solo pendientes
    $response = $this->getJson('/api/dashboard/proformas?estado=PENDIENTE');

    $response->assertStatus(200);
    $response->assertJson([
        'success' => true,
    ]);

    $data = $response->json('data');
    expect($data)->toHaveCount(1);
    expect($data[0]['estado'])->toBe('PENDIENTE');
});

it('valida que solo se puedan aprobar proformas pendientes', function () {
    $cliente  = Cliente::factory()->create();
    $proforma = Proforma::factory()->create([
        'estado'       => 'APROBADA',
        'canal_origen' => 'APP_EXTERNA',
        'cliente_id'   => $cliente->id,
    ]);

    $response = $this->postJson("/api/dashboard/proformas/{$proforma->id}/aprobar", [
        'comentario' => 'Intentando aprobar una ya aprobada',
    ]);

    $response->assertStatus(400);
    $response->assertJson([
        'success' => false,
        'message' => 'Solo se pueden aprobar proformas pendientes',
    ]);
});

it('requiere comentario al rechazar una proforma', function () {
    $cliente  = Cliente::factory()->create();
    $proforma = Proforma::factory()->create([
        'estado'       => 'PENDIENTE',
        'canal_origen' => 'APP_EXTERNA',
        'cliente_id'   => $cliente->id,
    ]);

    $response = $this->postJson("/api/dashboard/proformas/{$proforma->id}/rechazar", [
        // Sin comentario
    ]);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors('comentario');
});
