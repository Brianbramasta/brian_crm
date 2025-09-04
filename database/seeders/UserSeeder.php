<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Manager PT Smart',
                'email' => 'manager@ptsmart.com',
                'password' => Hash::make('password123'),
                'role' => 'manager',
                'is_active' => true,
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Andi Pratama',
                'email' => 'andi@ptsmart.com',
                'password' => Hash::make('password123'),
                'role' => 'sales',
                'is_active' => true,
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Sari Dewi',
                'email' => 'sari@ptsmart.com',
                'password' => Hash::make('password123'),
                'role' => 'sales',
                'is_active' => true,
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Budi Santoso',
                'email' => 'budi@ptsmart.com',
                'password' => Hash::make('password123'),
                'role' => 'sales',
                'is_active' => true,
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Diana Putri',
                'email' => 'diana@ptsmart.com',
                'password' => Hash::make('password123'),
                'role' => 'sales',
                'is_active' => true,
                'email_verified_at' => now(),
            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
}
