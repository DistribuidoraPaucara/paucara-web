<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserChoferPreferencia extends Model
{
    protected $fillable = ['user_id', 'chofer_id', 'fecha_uso', 'frecuencia'];
    protected $table = 'user_chofer_preferencias';

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function chofer()
    {
        return $this->belongsTo(Empleado::class, 'chofer_id');
    }
}
