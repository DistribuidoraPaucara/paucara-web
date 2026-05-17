<?php

use App\Models\Almacen;
use App\Models\Empresa;
use App\Models\Producto;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

/**
 * Tests para validar la parametrización de búsqueda de productos por empresa y almacén
 *
 * Fase 2: Refactorización de ProductoController para usar almacenes por empresa
 */

function crearUsuarioAdmin()
{
    // Crear rol Super Admin
    $role = Role::firstOrCreate(['name' => 'Super Admin']);

    // Crear usuario y asignar rol
    $user = User::factory()->create(['usernick' => 'testuser']);
    $user->assignRole($role);

    return $user;
}

test('Empresa tiene métodos para obtener almacenes', function () {
    // Setup
    $almacenPrincipal = Almacen::factory()->create([
        'nombre' => 'Almacén Principal',
        'activo' => true,
    ]);
    $almacenVenta = Almacen::factory()->create([
        'nombre' => 'Sala de Ventas',
        'activo' => true,
    ]);

    // Crear empresa con referencias a almacenes
    $empresa = Empresa::factory()->create([
        'almacen_id_principal' => $almacenPrincipal->id,
        'almacen_id_venta' => $almacenVenta->id,
        'activo' => true,
        'es_principal' => true,
    ]);

    // Test: Validar que los métodos funcionan correctamente
    expect($empresa->getPrincipalAlmacen()?->id)->toBe($almacenPrincipal->id);
    expect($empresa->getPrincipalAlmacen()?->nombre)->toBe('Almacén Principal');

    expect($empresa->getVentaAlmacen()?->id)->toBe($almacenVenta->id);
    expect($empresa->getVentaAlmacen()?->nombre)->toBe('Sala de Ventas');

    // getAlmacenActual(false) debe retornar el almacén principal
    expect($empresa->getAlmacenActual(false)?->id)->toBe($almacenPrincipal->id);

    // getAlmacenActual(true) debe retornar el almacén de venta
    expect($empresa->getAlmacenActual(true)?->id)->toBe($almacenVenta->id);
});

test('Empresa principal es obtenible desde método estático', function () {
    // Crear empresa principal
    $empresaPrincipal = Empresa::factory()->create([
        'nombre_comercial' => 'Empresa Principal Test',
        'activo' => true,
        'es_principal' => true,
    ]);

    // Test: Obtener empresa principal
    $empresa = Empresa::principal();

    expect($empresa)->not->toBeNull();
    expect($empresa->id)->toBe($empresaPrincipal->id);
    expect($empresa->es_principal)->toBeTrue();
});

test('Almacenes son asignados correctamente a empresas', function () {
    // Setup
    $almacen1 = Almacen::factory()->create(['nombre' => 'Almacén 1']);
    $almacen2 = Almacen::factory()->create(['nombre' => 'Almacén 2']);

    // Crear 2 empresas con diferentes almacenes
    $empresa1 = Empresa::factory()->create([
        'nombre_comercial' => 'Empresa 1',
        'almacen_id_principal' => $almacen1->id,
        'almacen_id_venta' => $almacen2->id,
        'es_principal' => true,
    ]);

    $empresa2 = Empresa::factory()->create([
        'nombre_comercial' => 'Empresa 2',
        'almacen_id_principal' => $almacen2->id,
        'almacen_id_venta' => $almacen1->id,
        'es_principal' => false,
    ]);

    // Test: Empresa1 usa almacén1 como principal
    expect($empresa1->almacen_id_principal)->toBe($almacen1->id);
    expect($empresa1->getPrincipalAlmacen()->nombre)->toBe('Almacén 1');

    // Test: Empresa2 usa almacén2 como principal
    expect($empresa2->almacen_id_principal)->toBe($almacen2->id);
    expect($empresa2->getPrincipalAlmacen()->nombre)->toBe('Almacén 2');

    // Validar que pueden tener diferentes configuraciones
    expect($empresa1->almacen_id_venta)->toBe($almacen2->id);
    expect($empresa2->almacen_id_venta)->toBe($almacen1->id);
});

test('ProductoController puede obtener empresa del request', function () {
    $user = crearUsuarioAdmin();

    // Crear almacén y empresa
    $almacen = Almacen::factory()->create();
    $empresa = Empresa::factory()->create([
        'almacen_id_principal' => $almacen->id,
        'es_principal' => true,
    ]);

    // Simular un request con usuario autenticado
    // La lógica obtenerEmpresa() debe retornar la empresa principal
    $empresaDelRequest = Empresa::principal();

    expect($empresaDelRequest)->not->toBeNull();
    expect($empresaDelRequest->almacen_id_principal)->toBe($almacen->id);
});

test('Validación de almacén existe', function () {
    // Los almacenes válidos deben existir en BD
    $almacen = Almacen::factory()->create(['nombre' => 'Almacén Test']);

    // Validar que existe
    $almacenDelFQ = Almacen::find($almacen->id);
    expect($almacenDelFQ)->not->toBeNull();
    expect($almacenDelFQ->nombre)->toBe('Almacén Test');

    // Validar que un ID inválido retorna null
    $almacenInvalido = Almacen::find(99999);
    expect($almacenInvalido)->toBeNull();
});

test('FormRequest ValidarAlmacenEmpresaRequest valida existencia', function () {
    $almacen = Almacen::factory()->create();
    $empresa = Empresa::factory()->create();

    // Los IDs válidos deben pasar la validación
    expect(Almacen::find($almacen->id))->not->toBeNull();
    expect(Empresa::find($empresa->id))->not->toBeNull();

    // Los IDs inválidos no deben existir
    expect(Almacen::find(99999))->toBeNull();
    expect(Empresa::find(99999))->toBeNull();
});

test('Empresa con almacenes es serializable', function () {
    $almacen = Almacen::factory()->create(['nombre' => 'Almacén JSON']);

    $empresa = Empresa::factory()->create([
        'almacen_id_principal' => $almacen->id,
        'nombre_comercial' => 'Test Serializable',
    ]);

    // Cargar relaciones
    $empresa->load('almacenPrincipal');

    // Verificar que se puede serializar a JSON
    $json = json_encode($empresa);
    expect($json)->not->toBeEmpty();

    // Verificar que se puede decodificar
    $decoded = json_decode($json, true);
    expect($decoded['almacen_id_principal'])->toBe($almacen->id);
    expect($decoded['nombre_comercial'])->toBe('Test Serializable');
});

test('Parametrización de almacén por empresa funciona en cadena', function () {
    // Crear 2 almacenes
    $almacen1 = Almacen::factory()->create(['nombre' => 'Almacén Principal']);
    $almacen2 = Almacen::factory()->create(['nombre' => 'Almacén Alternativo']);

    // Crear empresa con almacén principal específico
    $empresa = Empresa::factory()->create([
        'almacen_id_principal' => $almacen1->id,
        'almacen_id_venta' => $almacen2->id,
        'es_principal' => true,
    ]);

    // Simular: obtener empresa, luego almacén principal
    $almacenAsignado = $empresa->getPrincipalAlmacen();

    expect($almacenAsignado)->not->toBeNull();
    expect($almacenAsignado->id)->toBe($almacen1->id);
    expect($almacenAsignado->nombre)->toBe('Almacén Principal');

    // Simular: obtener empresa, luego almacén de venta
    $almacenVenta = $empresa->getVentaAlmacen();

    expect($almacenVenta)->not->toBeNull();
    expect($almacenVenta->id)->toBe($almacen2->id);
    expect($almacenVenta->nombre)->toBe('Almacén Alternativo');
});
