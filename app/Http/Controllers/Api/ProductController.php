<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    /**
     * Display a listing of products
     */
    public function index(Request $request): JsonResponse
    {
        $query = Product::query();

        // Search functionality
        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where('name', 'like', "%{$searchTerm}%");
        }

        $products = $query->orderBy('name')->paginate(15);

        return response()->json($products);
    }

    /**
     * Store a newly created product
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:100|unique:products',
            'hpp' => 'required|numeric|min:0',
            'margin_percent' => 'required|numeric|min:0|max:100',
        ]);

        $product = Product::create([
            'name' => $request->name,
            'hpp' => $request->hpp,
            'margin_percent' => $request->margin_percent,
        ]);

        return response()->json($product, 201);
    }

    /**
     * Display the specified product
     */
    public function show(Product $product): JsonResponse
    {
        return response()->json($product);
    }

    /**
     * Update the specified product
     */
    public function update(Request $request, Product $product): JsonResponse
    {
        $request->validate([
            'name' => 'string|max:100|unique:products,name,' . $product->id,
            'hpp' => 'numeric|min:0',
            'margin_percent' => 'numeric|min:0|max:100',
        ]);

        $product->update($request->only([
            'name', 'hpp', 'margin_percent'
        ]));

        return response()->json($product);
    }

    /**
     * Remove the specified product
     */
    public function destroy(Product $product): JsonResponse
    {
        // Check if product is used in deals or customer services
        if ($product->dealItems()->exists() || $product->customerServices()->exists()) {
            return response()->json([
                'message' => 'Cannot delete product that is used in deals or services'
            ], 422);
        }

        $product->delete();

        return response()->json(['message' => 'Product deleted successfully']);
    }

    /**
     * Check if negotiated price requires approval
     */
    public function checkPriceApproval(Request $request, Product $product): JsonResponse
    {
        $request->validate([
            'negotiated_price' => 'required|numeric|min:0',
        ]);

        $requiresApproval = $product->requiresApproval($request->negotiated_price);

        return response()->json([
            'requires_approval' => $requiresApproval,
            'selling_price' => $product->harga_jual,
            'negotiated_price' => $request->negotiated_price,
            'difference' => $product->harga_jual - $request->negotiated_price,
        ]);
    }
}
