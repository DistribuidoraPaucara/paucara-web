<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
  {
      Schema::table('movimientos_inventario', function (Blueprint $table) {
          $table->text('observacion')->change(); // De VARCHAR(255) a TEXT
      });
  }

  public function down()
  {
      Schema::table('movimientos_inventario', function (Blueprint $table) {
          $table->string('observacion', 255)->nullable()->change();
      });
  }

};
