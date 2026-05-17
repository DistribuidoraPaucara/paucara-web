<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cajas_auditoria', function (Blueprint $table) {
            $table->id();

            // Relaciones
            $table->foreignId('user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('caja_id')
                ->nullable()
                ->constrained('cajas')
                ->nullOnDelete();

            $table->foreignId('apertura_caja_id')
                ->nullable()
                ->constrained('aperturas_caja')
                ->nullOnDelete();

            // Auditoría
            $table->string('accion', 50); // INTENTO_SIN_CAJA, OPERACION_EXITOSA, CAJA_ABIERTA, CAJA_CERRADA
            $table->string('operacion_intentada', 255); // e.g., "POST /api/ventas"
            $table->string('operacion_tipo', 50)->nullable(); // VENTA, COMPRA, PAGO, etc
            $table->text('detalle_operacion')->nullable(); // JSON con detalles

            // Respuesta
            $table->integer('codigo_http')->default(500);
            $table->text('mensaje_error')->nullable();
            $table->boolean('exitosa')->default(false);

            // Información del cliente
            $table->ipAddress('ip_address')->nullable();
            $table->text('user_agent')->nullable();

            // Headers y metadata
            $table->json('request_headers')->nullable();
            $table->json('response_metadata')->nullable();

            // Información adicional
            $table->string('navegador', 100)->nullable(); // Chrome, Firefox, Safari
            $table->string('sistema_operativo', 100)->nullable(); // Windows, macOS, Linux
            $table->boolean('es_mobile')->default(false);

            // Timestamps
            $table->timestamp('fecha_intento')->useCurrent();
            $table->timestamps();

            // Índices para búsquedas rápidas
            $table->index('user_id');
            $table->index('caja_id');
            $table->index('accion');
            $table->index('fecha_intento');
            $table->index(['user_id', 'fecha_intento']);
            $table->index(['accion', 'exitosa']);
        });

        // Crear vista para estadísticas rápidas
        DB::statement("
            CREATE VIEW cajas_auditoria_estadisticas AS
            SELECT
                DATE(fecha_intento) as fecha,
                user_id,
                accion,
                COUNT(*) as total_intentos,
                SUM(CASE WHEN exitosa = true THEN 1 ELSE 0 END) as intentos_exitosos,
                SUM(CASE WHEN exitosa = false THEN 1 ELSE 0 END) as intentos_fallidos
            FROM cajas_auditoria
            GROUP BY DATE(fecha_intento), user_id, accion
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("DROP VIEW IF EXISTS cajas_auditoria_estadisticas");
        Schema::dropIfExists('cajas_auditoria');
    }
};
