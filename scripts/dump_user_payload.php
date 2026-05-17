<?php
// Dump the payload for UserController@show for user id 1
require __DIR__ . '/../vendor/autoload.php';
$app    = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;

$user = User::with(['roles.permissions', 'permissions'])->find(1);
if (! $user) {
    echo "USER_NOT_FOUND\n";
    exit(1);
}

$payload = [
    'user'            => $user->toArray(),
    'userRoles'       => $user->roles->pluck('id')->toArray(),
    'userPermissions' => $user->permissions->pluck('id')->toArray(),
    'allPermissions'  => $user->getAllPermissions()->toArray(),
];

echo json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . PHP_EOL;
