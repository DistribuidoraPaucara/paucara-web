<?php
require __DIR__ . '/../vendor/autoload.php';

use App\Models\User;

$user = User::where('email', 'admin@paucara.test')->first();
if (! $user) {
    echo "no-admin\n";
    exit(0);
}

$perms = $user->getAllPermissions()->pluck('name')->toArray();
echo json_encode($perms, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) . "\n";
