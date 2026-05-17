<?php
// Script para inspeccionar roles y permisos del usuario admin
require __DIR__ . '/../vendor/autoload.php';
$app    = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;

$admin = User::where('email', 'admin@paucara.test')
    ->with(['roles.permissions', 'permissions'])
    ->first();

if (! $admin) {
    echo "ADMIN_NOT_FOUND\n";
    exit(1);
}

$output = [
    'id'                 => $admin->id,
    'roles_names'        => $admin->roles->pluck('name')->toArray(),
    'roles_ids'          => $admin->roles->pluck('id')->toArray(),
    'permissions_direct' => $admin->permissions->pluck('name')->toArray(),
    'permissions_all'    => $admin->getAllPermissions()->pluck('name')->toArray(),
];

echo json_encode($output, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . PHP_EOL;
