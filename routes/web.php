<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\CashController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\SettingController;

Route::middleware(['web'])->group(function () {

    Route::get('/', function () {
        return Inertia::render('Dashboard');
    });

    Route::get('/login', function () { return Inertia::render('Login'); })->name('login');

    // Categorías
    Route::post('/categorias', [CategoryController::class, 'store'])->name('categories.store');
    Route::delete('/categorias/{id}', [CategoryController::class, 'destroy'])->name('categories.destroy');

    // Productos
    Route::get('/productos', [ProductController::class, 'index'])->name('products.index');
    Route::post('/productos', [ProductController::class, 'store'])->name('products.store');
    Route::put('/productos/{id}', [ProductController::class, 'update'])->name('products.update');
    Route::delete('/productos/{id}', [ProductController::class, 'destroy'])->name('products.destroy');
    Route::post('/productos/{id}/stock', [ProductController::class, 'updateStock'])->name('products.stock');

    // Ventas
    Route::get('/vender', [SaleController::class, 'index'])->name('sales.index');
    Route::post('/vender', [SaleController::class, 'store'])->name('sales.store');
    Route::get('/ventas/{id}', [SaleController::class, 'show'])->name('sales.show');
    Route::delete('/ventas/{id}', [SaleController::class, 'destroy'])->name('sales.destroy');

    // Clientes
    Route::get('/clientes', [ClientController::class, 'index'])->name('clients.index');
    Route::post('/clientes', [ClientController::class, 'store'])->name('clients.store');
    Route::get('/clientes/{id}', [ClientController::class, 'show'])->name('clients.show');
    Route::put('/clientes/{id}', [ClientController::class, 'update'])->name('clients.update');
    Route::delete('/clientes/{id}', [ClientController::class, 'destroy'])->name('clients.destroy');

    // Caja
    Route::get('/caja', [CashController::class, 'index'])->name('cash.index');
    Route::post('/caja', [CashController::class, 'store'])->name('cash.store');
    Route::delete('/caja/{id}', [CashController::class, 'destroy'])->name('cash.destroy');
    Route::get('/caja/cierre', [CashController::class, 'cierreCaja'])->name('cash.cierre');

    // Configuraciones
    Route::get('/configuracion', [SettingController::class, 'index'])->name('settings.index');
    Route::post('/configuracion', [SettingController::class, 'store'])->name('settings.store');
    Route::put('/configuracion/{id}', [SettingController::class, 'update'])->name('settings.update');
    Route::delete('/configuracion/{id}', [SettingController::class, 'destroy'])->name('settings.destroy');

    // Usuarios
    Route::get('/usuarios', function () { 
        return Inertia::render('Usuarios', ['usuarios' => \App\Models\User::all()]); 
    });

    // Reportes
    Route::prefix('reportes')->group(function () {
        Route::get('/', function () { return Inertia::render('Reportes'); });
        Route::get('/ventas-contado', [SaleController::class, 'history'])->name('reports.sales');
        Route::get('/inventario', function() { 
            return Inertia::render('Inventario', [
                'productos' => \App\Models\Product::with('category')
                    ->where('stock', '<=', \DB::raw('min_stock'))
                    ->get()
            ]); 
        })->name('reports.inventory');
    });

    Route::fallback(function () {
        return Inertia::render('NotFound');
    });

});