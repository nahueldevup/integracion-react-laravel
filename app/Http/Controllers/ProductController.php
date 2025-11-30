<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $categories = Category::select('id', 'name')->orderBy('name')->get();
        
        $query = Product::with('category');
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('description', 'like', "%$search%")
                  ->orWhere('barcode', 'like', "%$search%");
            });
        }

        return Inertia::render('Productos', [
            'products' => $query->orderBy('id', 'desc')->get(),
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'description' => 'required|string|max:255',
            'purchase_price' => 'nullable|numeric|min:0',
            'sale_price' => 'required|numeric|min:0',
            'stock' => 'nullable|integer|min:0',
            'min_stock' => 'nullable|integer|min:0',
            'category_id' => 'nullable|exists:categories,id'
        ]);

        if ($request->barcode) {
            $existingProduct = Product::withTrashed()->where('barcode', $request->barcode)->first();

            if ($existingProduct) {
                if ($existingProduct->trashed()) {
                    $existingProduct->restore();
                    $existingProduct->update([
                        'description' => $request->description,
                        'purchase_price' => $request->purchase_price ?? 0,
                        'sale_price' => $request->sale_price,
                        'stock' => $request->stock ?? 0,
                        'min_stock' => $request->min_stock ?? 5,
                        'category_id' => $request->category_id
                    ]);
                    return redirect()->back()->with('success', 'Producto restaurado y actualizado');
                } else {
                    return redirect()->back()->withErrors(['barcode' => 'Este código de barras ya está en uso']);
                }
            }
        }

        Product::create([
            'barcode' => $request->barcode,
            'description' => $request->description,
            'purchase_price' => $request->purchase_price ?? 0,
            'sale_price' => $request->sale_price,
            'stock' => $request->stock ?? 0,
            'min_stock' => $request->min_stock ?? 5,
            'category_id' => $request->category_id
        ]);

        return redirect()->back()->with('success', 'Producto creado');
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $request->validate([
            'description' => 'required|string|max:255',
            'barcode' => [
                'nullable', 
                'string', 
                'max:50', 
                Rule::unique('products')->whereNull('deleted_at')->ignore($id)
            ],
            'purchase_price' => 'nullable|numeric|min:0',
            'sale_price' => 'required|numeric|min:0',
            'stock' => 'nullable|integer|min:0',
            'min_stock' => 'nullable|integer|min:0',
            'category_id' => 'nullable|exists:categories,id'
        ]);

        $product->update([
            'barcode' => $request->barcode,
            'description' => $request->description,
            'purchase_price' => $request->purchase_price ?? 0,
            'sale_price' => $request->sale_price,
            'stock' => $request->stock ?? 0,
            'min_stock' => $request->min_stock ?? 5,
            'category_id' => $request->category_id
        ]);

        return redirect()->back()->with('success', 'Producto actualizado');
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();
        
        return redirect()->back()->with('success', 'Producto eliminado');
    }

    public function updateStock(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        
        $request->validate([
            'quantity' => 'required|integer'
        ]);

        $product->increment('stock', $request->quantity);
        
        return redirect()->back();
    }
}