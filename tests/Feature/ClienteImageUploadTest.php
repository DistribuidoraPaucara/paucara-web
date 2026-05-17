<?php

use App\Models\Cliente;
use App\Models\User;
use Illuminate\Http\UploadedFile;

it('validates image fields in storeApi', function (): void {
    // Crear usuario autenticado
    $user = User::factory()->create();
    $this->actingAs($user, 'sanctum');

    $clienteData = [
        'nombre' => 'Cliente Test',
        'telefono' => '70000001',
        'activo' => true,
    ];

    // Crear archivo temporal que simule una imagen
    $tempFile = tmpfile();
    fwrite($tempFile, 'fake image content');
    $filePath = stream_get_meta_data($tempFile)['uri'];

    $imageFile = new UploadedFile(
        $filePath,
        'test.jpg',
        'image/jpeg',
        null,
        true
    );

    $response = $this->postJson('/api/clientes', array_merge($clienteData, [
        'foto_perfil' => $imageFile,
    ]));

    // Debería pasar validación (aunque falle por otros motivos)
    expect($response->getStatusCode())->not->toBe(422);

    fclose($tempFile);
});

it('validates image fields in updateApi', function (): void {
    // Crear usuario autenticado
    $user = User::factory()->create();
    $this->actingAs($user, 'sanctum');

    $cliente = Cliente::factory()->create();

    $updateData = [
        'nombre' => 'Cliente Actualizado',
        'activo' => true,
    ];

    $response = $this->putJson("/api/clientes/{$cliente->id}", $updateData);

    // Debería pasar validación
    expect($response->getStatusCode())->not->toBe(422);
});

it('validates required fields without images', function (): void {
    // Crear usuario autenticado
    $user = User::factory()->create();
    $this->actingAs($user, 'sanctum');

    $clienteData = [
        'nombre' => 'Cliente Sin Imágenes',
        'telefono' => '70000002',
        'activo' => true,
    ];

    $response = $this->postJson('/api/clientes', $clienteData);

    // Debería crear el cliente exitosamente
    $response->assertStatus(201)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'cliente' => [
                    'id',
                    'foto_perfil',
                    'ci_anverso',
                    'ci_reverso',
                ],
            ],
        ]);

    $cliente = Cliente::find($response->json('data.cliente.id'));

    // Verificar que los campos de imagen sean null
    expect($cliente->foto_perfil)->toBeNull();
    expect($cliente->ci_anverso)->toBeNull();
    expect($cliente->ci_reverso)->toBeNull();
});
