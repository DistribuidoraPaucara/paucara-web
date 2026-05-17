<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ListTables extends Command
{
    protected $signature   = 'db:list-tables';
    protected $description = 'Lista todas las tablas en la base de datos';

    public function handle()
    {
        $tables = DB::select('SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\'');

        $this->info('Tablas en la base de datos:');
        foreach ($tables as $table) {
            $this->line($table->table_name);
        }

        return Command::SUCCESS;
    }
}
