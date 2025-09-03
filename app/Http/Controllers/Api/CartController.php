<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\Product;

class CartController extends Controller
{
    /**
     * Get user's cart
     */
    public function index(Request $request)
    {
        $cartItems = Cart::with('product')
            ->where('user_id', $request->user()->id)
            ->get()
            ->map(function ($cartItem) {
                return [
                    'id' => (string) $cartItem->id,
                    'product' => [
                        'id' => (string) $cartItem->product->id,
                        'name' => $cartItem->product->name,
                        'price' => $cartItem->product->harga_jual,
                    ],
                    'quantity' => $cartItem->quantity,
                ];
            });

        return response()->json($cartItems);
    }

    /**
     * Add item to cart
     */
    public function store(Request $request)
    {
        $request->validate([
            'productId' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($request->productId);

        // Check if item already exists in cart
        $existingItem = Cart::where('user_id', $request->user()->id)
            ->where('product_id', $request->productId)
            ->first();

        if ($existingItem) {
            $existingItem->quantity += $request->quantity;
            $existingItem->save();
            $cartItem = $existingItem;
        } else {
            $cartItem = Cart::create([
                'user_id' => $request->user()->id,
                'product_id' => $request->productId,
                'quantity' => $request->quantity,
            ]);
        }

        return response()->json([
            'id' => (string) $cartItem->id,
            'productId' => (string) $cartItem->product_id,
            'quantity' => $cartItem->quantity,
            'addedAt' => $cartItem->created_at->toISOString(),
        ], 201);
    }

    /**
     * Update cart item quantity
     */
    public function update(Request $request, Cart $cart)
    {
        // Ensure user can only update their own cart items
        if ($cart->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cart->update(['quantity' => $request->quantity]);

        return response()->json([
            'id' => (string) $cart->id,
            'quantity' => $cart->quantity,
        ]);
    }

    /**
     * Remove item from cart
     */
    public function destroy(Request $request, Cart $cart)
    {
        // Ensure user can only delete their own cart items
        if ($cart->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $cart->delete();

        return response()->json([
            'message' => 'Item removed from cart'
        ]);
    }
}
