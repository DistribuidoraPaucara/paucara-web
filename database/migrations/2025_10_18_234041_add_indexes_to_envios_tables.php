<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Agrega índices para optimizar consultas frecuentes en el módulo de logística:
     * 1. Índices simples en columnas de búsqueda frecuente
     * 2. Índices compuestos para consultas complejas
     * 3. Índices para relaciones (foreign keys)
     */
    public function up(): void
    {
        // ==========================================
        // TABLA: envios
        // ==========================================
        Schema::table('envios', function (Blueprint $table) {
            // Índice para búsqueda por número de envío
            if (!Schema::hasIndex('envios', 'envios_numero_envio_index')) {
                $table->index('numero_envio');
            }

            // Índice para filtros por estado
            if (!Schema::hasIndex('envios', 'envios_estado_index')) {
                $table->index('estado');
            }

            // Índice compuesto para búsquedas por vehículo+estado (ej: vehículos en ruta)
            if (!Schema::hasIndex('envios', 'idx_envios_vehiculo_estado')) {
                $table->index(['vehiculo_id', 'estado'], 'idx_envios_vehiculo_estado');
            }

            // Índice compuesto para búsquedas por chofer+estado (ej: envíos del chofer activos)
            if (!Schema::hasIndex('envios', 'idx_envios_chofer_estado')) {
                $table->index(['chofer_id', 'estado'], 'idx_envios_chofer_estado');
            }

            // Índice compuesto para búsquedas por fecha programada+estado (dashboard)
            if (!Schema::hasIndex('envios', 'idx_envios_fecha_estado')) {
                $table->index(['fecha_programada', 'estado'], 'idx_envios_fecha_estado');
            }

            // Índice para filtros por rango de fechas de entrega
            if (!Schema::hasIndex('envios', 'envios_fecha_entrega_index')) {
                $table->index('fecha_entrega');
            }

            // Índice para filtros por rango de fechas de salida
            if (!Schema::hasIndex('envios', 'envios_fecha_salida_index')) {
                $table->index('fecha_salida');
            }

            // Índice para búsquedas por venta (único, pero útil para joins)
            if (!Schema::hasIndex('envios', 'envios_venta_id_index')) {
                $table->index('venta_id');
            }

            // Índice para coordenadas (para búsquedas geográficas futuras)
            if (!Schema::hasIndex('envios', 'idx_envios_coordenadas')) {
                $table->index(['coordenadas_lat', 'coordenadas_lng'], 'idx_envios_coordenadas');
            }

            // Índice para timestamps (ordenamiento por creación/actualización)
            if (!Schema::hasIndex('envios', 'envios_created_at_index')) {
                $table->index('created_at');
            }

            if (!Schema::hasIndex('envios', 'envios_updated_at_index')) {
                $table->index('updated_at');
            }
        });

        // ==========================================
        // TABLA: seguimientos_envio
        // ==========================================
        if (Schema::hasTable('seguimientos_envio')) {
            Schema::table('seguimientos_envio', function (Blueprint $table) {
                // Índice para relación con envío
                if (!Schema::hasIndex('seguimientos_envio', 'seguimientos_envio_envio_id_index')) {
                    $table->index('envio_id');
                }

                // Índice compuesto para obtener seguimientos de un envío ordenados
                if (!Schema::hasIndex('seguimientos_envio', 'idx_seguimiento_envio_fecha')) {
                    $table->index(['envio_id', 'fecha_hora'], 'idx_seguimiento_envio_fecha');
                }

                // Índice para búsquedas por estado
                if (!Schema::hasIndex('seguimientos_envio', 'seguimientos_envio_estado_index')) {
                    $table->index('estado');
                }

                // Índice para búsquedas por usuario (auditoría)
                if (!Schema::hasIndex('seguimientos_envio', 'seguimientos_envio_user_id_index')) {
                    $table->index('user_id');
                }

                // Índice para coordenadas (tracking GPS)
                if (!Schema::hasIndex('seguimientos_envio', 'idx_seguimiento_coordenadas')) {
                    $table->index(['coordenadas_lat', 'coordenadas_lng'], 'idx_seguimiento_coordenadas');
                }

                // Índice para timestamps
                if (!Schema::hasIndex('seguimientos_envio', 'seguimientos_envio_created_at_index')) {
                    $table->index('created_at');
                }
            });
        }

        // ==========================================
        // TABLA: vehiculos (si necesita índices adicionales)
        // ==========================================
        if (Schema::hasTable('vehiculos')) {
            Schema::table('vehiculos', function (Blueprint $table) {
                // Índice para filtros por estado (DISPONIBLE, EN_RUTA, etc.)
                if (!Schema::hasIndex('vehiculos', 'vehiculos_estado_index')) {
                    $table->index('estado');
                }

                // Índice compuesto para vehículos activos y disponibles
                if (!Schema::hasIndex('vehiculos', 'idx_vehiculos_activo_estado')) {
                    $table->index(['activo', 'estado'], 'idx_vehiculos_activo_estado');
                }

                // Índice para búsquedas por placa
                if (!Schema::hasIndex('vehiculos', 'vehiculos_placa_index')) {
                    $table->index('placa');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Eliminar índices de envios
        Schema::table('envios', function (Blueprint $table) {
            if (Schema::hasIndex('envios', 'envios_numero_envio_index')) {
                $table->dropIndex('envios_numero_envio_index');
            }
            if (Schema::hasIndex('envios', 'envios_estado_index')) {
                $table->dropIndex('envios_estado_index');
            }
            if (Schema::hasIndex('envios', 'idx_envios_vehiculo_estado')) {
                $table->dropIndex('idx_envios_vehiculo_estado');
            }
            if (Schema::hasIndex('envios', 'idx_envios_chofer_estado')) {
                $table->dropIndex('idx_envios_chofer_estado');
            }
            if (Schema::hasIndex('envios', 'idx_envios_fecha_estado')) {
                $table->dropIndex('idx_envios_fecha_estado');
            }
            if (Schema::hasIndex('envios', 'envios_fecha_entrega_index')) {
                $table->dropIndex('envios_fecha_entrega_index');
            }
            if (Schema::hasIndex('envios', 'envios_fecha_salida_index')) {
                $table->dropIndex('envios_fecha_salida_index');
            }
            if (Schema::hasIndex('envios', 'envios_venta_id_index')) {
                $table->dropIndex('envios_venta_id_index');
            }
            if (Schema::hasIndex('envios', 'idx_envios_coordenadas')) {
                $table->dropIndex('idx_envios_coordenadas');
            }
            if (Schema::hasIndex('envios', 'envios_created_at_index')) {
                $table->dropIndex('envios_created_at_index');
            }
            if (Schema::hasIndex('envios', 'envios_updated_at_index')) {
                $table->dropIndex('envios_updated_at_index');
            }
        });

        // Eliminar índices de seguimientos_envio
        if (Schema::hasTable('seguimientos_envio')) {
            Schema::table('seguimientos_envio', function (Blueprint $table) {
                if (Schema::hasIndex('seguimientos_envio', 'seguimientos_envio_envio_id_index')) {
                    $table->dropIndex('seguimientos_envio_envio_id_index');
                }
                if (Schema::hasIndex('seguimientos_envio', 'idx_seguimiento_envio_fecha')) {
                    $table->dropIndex('idx_seguimiento_envio_fecha');
                }
                if (Schema::hasIndex('seguimientos_envio', 'seguimientos_envio_estado_index')) {
                    $table->dropIndex('seguimientos_envio_estado_index');
                }
                if (Schema::hasIndex('seguimientos_envio', 'seguimientos_envio_user_id_index')) {
                    $table->dropIndex('seguimientos_envio_user_id_index');
                }
                if (Schema::hasIndex('seguimientos_envio', 'idx_seguimiento_coordenadas')) {
                    $table->dropIndex('idx_seguimiento_coordenadas');
                }
                if (Schema::hasIndex('seguimientos_envio', 'seguimientos_envio_created_at_index')) {
                    $table->dropIndex('seguimientos_envio_created_at_index');
                }
            });
        }

        // Eliminar índices de vehiculos
        if (Schema::hasTable('vehiculos')) {
            Schema::table('vehiculos', function (Blueprint $table) {
                if (Schema::hasIndex('vehiculos', 'vehiculos_estado_index')) {
                    $table->dropIndex('vehiculos_estado_index');
                }
                if (Schema::hasIndex('vehiculos', 'idx_vehiculos_activo_estado')) {
                    $table->dropIndex('idx_vehiculos_activo_estado');
                }
                if (Schema::hasIndex('vehiculos', 'vehiculos_placa_index')) {
                    $table->dropIndex('vehiculos_placa_index');
                }
            });
        }
    }
};
