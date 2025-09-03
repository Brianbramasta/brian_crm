<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    /**
     * Get all products
     */
    public function index()
    {
        $products = Product::all()->map(function ($product) {
            return [
                'id' => (string) $product->id,
                'name' => $product->name,
                'price' => $product->harga_jual,
                'stock' => $product->stock,
                'description' => $product->description,
                'hpp' => $product->hpp,
                'margin_percent' => $product->margin_percent,
            ];
        });

        return response()->json($products);
    }

    /**
     * Get product by ID
     */
    public function show(Product $product)
    {
        return response()->json([
            'id' => (string) $product->id,
            'name' => $product->name,
            'price' => $product->harga_jual,
            'stock' => $product->stock,
            'description' => $product->description,
            'hpp' => $product->hpp,
            'margin_percent' => $product->margin_percent,
        ]);
    }

    /**
     * Create a new product
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'hpp' => 'required|numeric|min:0',
            'margin_percent' => 'required|numeric|min:0|max:100',
            'description' => 'nullable|string',
            'stock' => 'required|integer|min:0',
        ]);

        $product = Product::create($request->all());

        return response()->json([
            'id' => (string) $product->id,
            'name' => $product->name,
            'price' => $product->harga_jual,
            'stock' => $product->stock,
            'description' => $product->description,
            'hpp' => $product->hpp,
            'margin_percent' => $product->margin_percent,
        ], 201);
    }

    /**
     * Update a product
     */
    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:100',
            'hpp' => 'sometimes|required|numeric|min:0',
            'margin_percent' => 'sometimes|required|numeric|min:0|max:100',
            'description' => 'nullable|string',
            'stock' => 'sometimes|required|integer|min:0',
        ]);

        $product->update($request->all());

        return response()->json([
            'id' => (string) $product->id,
            'name' => $product->name,
            'price' => $product->harga_jual,
            'stock' => $product->stock,
            'description' => $product->description,
            'hpp' => $product->hpp,
            'margin_percent' => $product->margin_percent,
        ]);
    }

    /**
     * Delete a product
     */
    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully'
        ]);
    }
}
