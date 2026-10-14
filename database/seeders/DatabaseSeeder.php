<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the dashboard users with a random temporary password.
     *
     * Existing users are left untouched so re-running the seeder never resets a password.
     */
    public function run(): void
    {
        $dashboardUsers = [
            ['name' => 'Administrador TICS', 'email' => 'admin@tics.local'],
            ['name' => 'Usuario TICS', 'email' => 'usuario@tics.local'],
        ];

        foreach ($dashboardUsers as $dashboardUser) {
            if (User::where('email', $dashboardUser['email'])->exists()) {
                $this->command?->warn("{$dashboardUser['email']} ya existe, se mantiene su contraseña.");

                continue;
            }

            $temporaryPassword = Str::password(12, symbols: false);

            User::create([
                ...$dashboardUser,
                'password' => $temporaryPassword,
            ]);

            $this->command?->info("{$dashboardUser['email']}  ->  contraseña temporal: {$temporaryPassword}");
        }
    }
}
