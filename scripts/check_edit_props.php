<?php
require __DIR__ . '/../vendor/autoload.php';
$app    = require __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

$u = User::with(['roles.permissions', 'permissions'])->first();
if (! $u) {
    echo "No users in DB\n";
    exit(1);
}

$rolesAll           = Role::all();
$permissionsGrouped = Permission::all()->groupBy(function ($permission) {return explode('.', $permission->name)[0];});

$userRolesPlucked       = $u->roles->pluck('id');
$userPermissionsPlucked = $u->permissions->pluck('id');

echo "--- All roles (sample) ---\n";
foreach ($rolesAll->take(5) as $r) {
    echo "role id: {$r->id} (type: " . gettype($r->id) . ")\n";
}

echo "\n--- Permissions groups keys ---\n";
foreach ($permissionsGrouped->keys() as $k) {
    echo " - $k\n";
}

echo "\n--- User roles plucked toArray JSON ---\n";
echo json_encode($userRolesPlucked->toArray(), JSON_PRETTY_PRINT) . "\n";

echo "\n--- User roles types (each) ---\n";
foreach ($userRolesPlucked->toArray() as $v) {
    echo "value: {$v}, type: " . gettype($v) . "\n";
}

echo "\n--- User permissions plucked toArray JSON ---\n";
echo json_encode($userPermissionsPlucked->toArray(), JSON_PRETTY_PRINT) . "\n";

echo "\n--- User roles raw (objects) ---\n";
foreach ($u->roles as $r) {
    echo "id: {$r->id} (type: " . gettype($r->id) . "), name: {$r->name}\n";
}

echo "\n--- User roles serialized via json_encode(userRoles) ---\n";
echo json_encode($u->roles) . "\n";

// Also replicate what controller returns
$controllerPayload = [
    'user'            => $u,
    'roles'           => $rolesAll,
    'permissions'     => $permissionsGrouped,
    'userRoles'       => $userRolesPlucked,
    'userPermissions' => $userPermissionsPlucked,
];

echo "\n--- Controller payload JSON (userRoles/userPermissions section) ---\n";
echo json_encode([
    'userRoles'       => $controllerPayload['userRoles']->toArray(),
    'userPermissions' => $controllerPayload['userPermissions']->toArray(),
], JSON_PRETTY_PRINT) . "\n";

return 0;
