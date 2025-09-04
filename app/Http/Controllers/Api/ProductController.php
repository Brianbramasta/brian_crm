<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    /**
     * Get all products with filtering and search
     */
    public function index(Request $request)
    {
        $query = Product::query();

        // Filter by active status
        if ($request->has('active_only') && $request->active_only) {
            $query->active();
        }

        // Filter by category
        if ($request->has('category')) {
            $query->byCategory($request->category);
        }

        // Search by name or description
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                  ->orWhere('description', 'like', "%$search%")
                  ->orWhere('bandwidth', 'like', "%$search%");
            });
        }

        $products = $query->orderBy('category')
                         ->orderBy('name')
                         ->get()
                         ->map(function ($product) {
                             return [
                                 'id' => (string) $product->id,
                                 'name' => $product->name,
                                 'description' => $product->description,
                                 'hpp' => $product->hpp,
                                 'margin_percentage' => $product->margin_percentage,
                                 'selling_price' => $product->selling_price,
                                 'price' => $product->selling_price, // For API compatibility
                                 'formatted_price' => $product->formatted_price,
                                 'category' => $product->category,
                                 'bandwidth' => $product->bandwidth,
                                 'is_active' => $product->is_active,
                                 'created_at' => $product->created_at,
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
            'description' => $product->description,
            'hpp' => $product->hpp,
            'margin_percentage' => $product->margin_percentage,
            'selling_price' => $product->selling_price,
            'price' => $product->selling_price, // For API compatibility
            'formatted_price' => $product->formatted_price,
            'category' => $product->category,
            'bandwidth' => $product->bandwidth,
            'is_active' => $product->is_active,
            'created_at' => $product->created_at,
            'updated_at' => $product->updated_at,
        ]);
    }

    /**
     * Create a new product
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string',
            'hpp' => 'required|numeric|min:0',
            'margin_percentage' => 'required|numeric|min:0|max:100',
            'category' => 'nullable|string|max:50',
            'bandwidth' => 'nullable|string|max:20',
            'is_active' => 'sometimes|boolean',
        ]);

        $product = Product::create($request->all());

        return response()->json([
            'id' => (string) $product->id,
            'name' => $product->name,
            'description' => $product->description,
            'hpp' => $product->hpp,
            'margin_percentage' => $product->margin_percentage,
            'selling_price' => $product->selling_price,
            'category' => $product->category,
            'bandwidth' => $product->bandwidth,
            'is_active' => $product->is_active,
        ], 201);
    }

    /**
     * Update a product
     */
    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:100',
            'description' => 'sometimes|nullable|string',
            'hpp' => 'sometimes|required|numeric|min:0',
            'margin_percentage' => 'sometimes|required|numeric|min:0|max:100',
            'category' => 'sometimes|nullable|string|max:50',
            'bandwidth' => 'sometimes|nullable|string|max:20',
            'is_active' => 'sometimes|boolean',
        ]);

        $product->update($request->all());

        return response()->json([
            'id' => (string) $product->id,
            'name' => $product->name,
            'description' => $product->description,
            'hpp' => $product->hpp,
            'margin_percentage' => $product->margin_percentage,
            'selling_price' => $product->selling_price,
            'category' => $product->category,
            'bandwidth' => $product->bandwidth,
            'is_active' => $product->is_active,
            'updated_at' => $product->updated_at,
        ]);
    }

    /**
     * Delete a product
     */
    public function destroy(Product $product)
    {
        // Check if product is used in any deal items or customer services
        if ($product->dealItems()->exists() || $product->customerServices()->exists()) {
            return response()->json([
                'message' => 'Cannot delete product that is used in deals or customer services'
            ], 422);
        }

        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully'
        ]);
    }

    /**
     * Get product categories
     */
    public function categories()
    {
        $categories = Product::select('category')
                            ->whereNotNull('category')
                            ->distinct()
                            ->pluck('category');

        return response()->json($categories);
    }

    /**
     * Calculate selling price preview
     */
    public function calculatePrice(Request $request)
    {
        $request->validate([
            'hpp' => 'required|numeric|min:0',
            'margin_percentage' => 'required|numeric|min:0|max:100',
        ]);

        $hpp = $request->hpp;
        $margin = $request->margin_percentage;
        $sellingPrice = $hpp + ($hpp * $margin / 100);

        return response()->json([
            'hpp' => $hpp,
            'margin_percentage' => $margin,
            'selling_price' => $sellingPrice,
            'formatted_selling_price' => 'Rp ' . number_format($sellingPrice, 0, ',', '.'),
            'profit' => $sellingPrice - $hpp,
            'profit_percentage' => $margin,
        ]);
    }
}
