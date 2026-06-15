<?php

namespace App\Http\Controllers;

use App\Models\Product;

class InventoryController extends Controller
{
    public function index()
    {
        return response()->json(Product::with('supplier')->get());
    }

    public function show(Product $product)
    {
        return response()->json($product->load('supplier'));
    }
}
