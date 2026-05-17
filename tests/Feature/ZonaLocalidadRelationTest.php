<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Zona;
use App\Models\Localidad;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ZonaLocalidadRelationTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function zona_puede_tener_multiples_localidades()
    {
        $zona = Zona::factory()->create();
        $localidades = Localidad::factory()->count(3)->create();

        $zona->localidades()->attach($localidades->pluck('id'));

        $this->assertCount(3, $zona->localidades);
    }

    /** @test */
    public function localidad_puede_pertenecer_a_multiples_zonas()
    {
        $localidad = Localidad::factory()->create();
        $zonas = Zona::factory()->count(2)->create();

        $localidad->zonas()->attach($zonas->pluck('id'));

        $this->assertCount(2, $localidad->zonas);
    }

    /** @test */
    public function sync_actualiza_localidades_correctamente()
    {
        $zona = Zona::factory()->create();
        $localidades = Localidad::factory()->count(3)->create();

        // Primera sincronización
        $zona->localidades()->sync($localidades->take(2)->pluck('id'));
        $this->assertCount(2, $zona->fresh()->localidades);

        // Segunda sincronización (reemplaza)
        $zona->localidades()->sync([$localidades->last()->id]);
        $this->assertCount(1, $zona->fresh()->localidades);
    }

    /** @test */
    public function puede_filtrar_zonas_por_localidad()
    {
        $localidad = Localidad::factory()->create();
        $zona1 = Zona::factory()->create();
        $zona2 = Zona::factory()->create();

        $zona1->localidades()->attach($localidad);

        $zonasConLocalidad = Zona::whereHas('localidades', function ($q) use ($localidad) {
            $q->where('localidades.id', $localidad->id);
        })->get();

        $this->assertTrue($zonasConLocalidad->contains($zona1));
        $this->assertFalse($zonasConLocalidad->contains($zona2));
    }

    /** @test */
    public function metodo_tiene_localidad_funciona_correctamente()
    {
        $zona = Zona::factory()->create();
        $localidad = Localidad::factory()->create();

        $this->assertFalse($zona->tieneLocalidad($localidad->id));

        $zona->localidades()->attach($localidad);

        $this->assertTrue($zona->fresh()->tieneLocalidad($localidad->id));
    }

    /** @test */
    public function metodo_get_localidades_ids_retorna_ids()
    {
        $zona = Zona::factory()->create();
        $localidades = Localidad::factory()->count(3)->create();

        $zona->localidades()->attach($localidades->pluck('id'));

        $ids = $zona->getLocalidadesIds();

        $this->assertCount(3, $ids);
        $this->assertEquals($localidades->pluck('id')->toArray(), $ids);
    }

    /** @test */
    public function relacion_inversa_zona_principal_funciona()
    {
        $localidad = Localidad::factory()->create();
        $zona = Zona::factory()->create();

        $zona->localidades()->attach($localidad);

        $zonaPrincipal = $localidad->fresh()->zona_principal;

        $this->assertNotNull($zonaPrincipal);
        $this->assertEquals($zona->id, $zonaPrincipal->id);
    }
}
