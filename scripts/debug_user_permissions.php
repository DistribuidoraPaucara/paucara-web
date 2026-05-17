<?php
require __DIR__ . '/../vendor/autoload.php';
$app    = require __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;

$u = User::with(['roles.permissions', 'permissions'])->first();
if (! $u) {
    echo "No user found\n";
    exit(0);
}

echo "User: {$u->id} {$u->name} (usernick={$u->usernick})\n";
echo "Roles:\n";
foreach ($u->roles as $r) {
    echo " - {$r->id} {$r->name}\n";
    echo "   Role permissions:\n";
    foreach ($r->permissions as $p) {
        echo "     * {$p->id} {$p->name}\n";
    }
}

echo "Direct permissions:\n";
foreach ($u->permissions as $p) {
    echo " - {$p->id} {$p->name}\n";
}
