<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    public function index()
    {
        return response()->json(Supplier::withCount('products')->get());
    }

    public function show(Supplier $supplier)
    {
        return response()->json($supplier->load('products'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'  => 'required|string|max:255|unique:suppliers,name',
            'phone' => 'nullable|string|max:20',
        ], [
            'name.required' => 'Nama supplier wajib diisi.',
            'name.max'      => 'Nama supplier maksimal 255 karakter.',
            'name.unique'   => 'Nama supplier sudah terdaftar.',
            'phone.max'     => 'Nomor telepon maksimal 20 karakter.',
        ]);

        $supplier = Supplier::create($request->only('name', 'phone'));

        return response()->json($supplier->loadCount('products'), 201);
    }

    public function update(Request $request, Supplier $supplier)
    {
        $request->validate([
            'name'  => "required|string|max:255|unique:suppliers,name,{$supplier->id}",
            'phone' => 'nullable|string|max:20',
        ], [
            'name.required' => 'Nama supplier wajib diisi.',
            'name.max'      => 'Nama supplier maksimal 255 karakter.',
            'name.unique'   => 'Nama supplier sudah digunakan.',
            'phone.max'     => 'Nomor telepon maksimal 20 karakter.',
        ]);

        $supplier->update($request->only('name', 'phone'));

        return response()->json($supplier->loadCount('products'));
    }

    public function destroy(Supplier $supplier)
    {
        if ($supplier->products()->exists()) {
            return response()->json([
                'message' => "Supplier tidak bisa dihapus karena masih memiliki {$supplier->products()->count()} produk.",
            ], 422);
        }

        $supplier->delete();

        return response()->json(['message' => 'Supplier berhasil dihapus.']);
    }
}
