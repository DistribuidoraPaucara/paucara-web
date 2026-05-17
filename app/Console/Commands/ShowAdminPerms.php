<?php
namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class ShowAdminPerms extends Command
{
    protected $signature   = 'debug:show-admin-perms {email=admin@paucara.test}';
    protected $description = 'Muestra los permisos del usuario admin en JSON';

    public function handle(): int
    {
        $email = $this->argument('email');
        $user  = User::where('email', $email)->first();
        if (! $user) {
            $this->info('no-admin');
            return 0;
        }

        $perms = $user->getAllPermissions()->pluck('name')->toArray();
        $this->line(json_encode($perms, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
        return 0;
    }
}
