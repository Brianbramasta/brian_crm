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
                'name' => 'Manager Admin',
                'email' => 'manager@ptsmart.com',
                'password' => Hash::make('password123'),
                'role' => 'manager',
            ],
            [
                'name' => 'Sales Person 1',
                'email' => 'sales1@ptsmart.com',
                'password' => Hash::make('password123'),
                'role' => 'sales',
            ],
            [
                'name' => 'Sales Person 2',
                'email' => 'sales2@ptsmart.com',
                'password' => Hash::make('password123'),
                'role' => 'sales',
            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
}
