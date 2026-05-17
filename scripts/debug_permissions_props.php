<?php
require __DIR__ . '/../vendor/autoload.php';
$app    = require __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Spatie\Permission\Models\Permission;

$permissions = Permission::all()->groupBy(function ($permission) {return explode('.', $permission->name)[0];});
echo "Permission groups keys:\n";
foreach ($permissions->keys() as $k) {
    echo " - $k\n";
}

$firstGroup = $permissions->first();
echo "\nFirst group sample (raw):\n";
foreach ($firstGroup->take(5) as $p) {
    echo " * {$p->id} {$p->name}\n";
}

$u = User::with(['roles', 'permissions'])->first();
echo "\nUserPermissions (ids):\n";
if ($u) {
    print_r($u->permissions->pluck('id')->toArray());
} else {
    echo "No user\n";
}
