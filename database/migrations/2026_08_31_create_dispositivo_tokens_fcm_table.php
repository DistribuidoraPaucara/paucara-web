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
        Schema::create('dispositivo_tokens_fcm', function (Blueprint $table) {
            $table->id();

            // Identificador único del dispositivo (puede ser IMEI o UUID)
            $table->string('dispositivo_id')->unique();

            // Token de Firebase Cloud Messaging
            $table->text('token_fcm');

            // Información del dispositivo
            $table->string('platform')->nullable(); // 'android', 'ios', 'web'
            $table->string('device_name')->nullable(); // Ej: "Samsung Galaxy S21"
            $table->string('app_version')->nullable(); // Ej: "1.1.16"

            // Usuario (opcional, si queremos vincular a un usuario específico)
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');

            // Estado
            $table->boolean('activo')->default(true);
            $table->timestamp('ultimo_sync')->nullable(); // Último sincronización

            $table->timestamps();

            // Índices
            $table->index('dispositivo_id');
            $table->index('user_id');
            $table->index('platform');
            $table->index('activo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dispositivo_tokens_fcm');
    }
};
