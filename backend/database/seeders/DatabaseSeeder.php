<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name'     => 'Admin Toko',
            'email'    => 'admin@example.com',
            'password' => 'password',
            'role'     => 'admin',
        ]);

        User::create([
            'name'     => 'Karyawan Toko',
            'email'    => 'karyawan@example.com',
            'password' => '12345678',
            'role'     => 'karyawan',
        ]);

        $supplier1 = Supplier::create(['name' => 'Supplier Bandung', 'phone' => '0811000001']);
        $supplier2 = Supplier::create(['name' => 'Supplier Jogja',   'phone' => '0811000002']);
        $supplier3 = Supplier::create(['name' => 'Supplier Lampung', 'phone' => '0811000003']);

        Product::insert([
            ['supplier_id' => $supplier1->id, 'name' => 'Keripik Pisang',  'price' => 15000, 'stock' => 50, 'expired_date' => '2026-12-31', 'created_at' => now(), 'updated_at' => now()],
            ['supplier_id' => $supplier1->id, 'name' => 'Dodol Garut',     'price' => 25000, 'stock' => 30, 'expired_date' => '2026-10-31', 'created_at' => now(), 'updated_at' => now()],
            ['supplier_id' => $supplier2->id, 'name' => 'Bakpia Pathok',   'price' => 35000, 'stock' => 20, 'expired_date' => '2026-09-15', 'created_at' => now(), 'updated_at' => now()],
            ['supplier_id' => $supplier2->id, 'name' => 'Gudeg Kaleng',    'price' => 45000, 'stock' => 15, 'expired_date' => '2026-08-01', 'created_at' => now(), 'updated_at' => now()],
            ['supplier_id' => $supplier3->id, 'name' => 'Kopi Lampung',    'price' => 55000, 'stock' => 40, 'expired_date' => '2027-01-01', 'created_at' => now(), 'updated_at' => now()],
            ['supplier_id' => $supplier3->id, 'name' => 'Brownies Kering', 'price' => 40000, 'stock' => 25, 'expired_date' => '2026-11-30', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
