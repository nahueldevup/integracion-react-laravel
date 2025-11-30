<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:categories,name|max:255'
        ]);

        Category::create([
            'name' => $request->name
        ]);

        return redirect()->back()->with('success', 'Categoría creada');
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        
        // Validar si hay productos usando esta categoría
        if (Product::where('category_id', $id)->exists()) {
            return redirect()->back()->withErrors(['error' => 'No puedes eliminar una categoría en uso']);
        }

        $category->delete();
        
        return redirect()->back()->with('success', 'Categoría eliminada');
    }
}