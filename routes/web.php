<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\CashController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\ReportController; // Asegúrate de tener este import
// use App\Http\Controllers\UserController; // Descomenta si ya creaste este controlador

Route::middleware(['web'])->group(function () {

    // --- DASHBOARD ---
    Route::get('/', function () {
        $lowStockProducts = \App\Models\Product::whereRaw('stock <= min_stock')
            ->get(['id', 'description', 'stock', 'min_stock']);
            
        return Inertia::render('Dashboard', [
            'lowStockProducts' => $lowStockProducts
        ]);
    })->name('dashboard');

    Route::get('/login', function () { return Inertia::render('Login'); })->name('login');

    // --- CATEGORÍAS ---
    Route::post('/categorias', [CategoryController::class, 'store'])->name('categories.store');
    Route::delete('/categorias/{id}', [CategoryController::class, 'destroy'])->name('categories.destroy');

    // --- PRODUCTOS ---
    Route::get('/productos', [ProductController::class, 'index'])->name('products.index');
    Route::post('/productos', [ProductController::class, 'store'])->name('products.store');
    Route::put('/productos/{id}', [ProductController::class, 'update'])->name('products.update');
    Route::delete('/productos/{id}', [ProductController::class, 'destroy'])->name('products.destroy');
    Route::post('/productos/{id}/stock', [ProductController::class, 'updateStock'])->name('products.stock');
    Route::get('/productos/export', [ProductController::class, 'export'])->name('products.export');
    Route::post('/productos/import', [ProductController::class, 'import'])->name('products.import');
    Route::get('/productos/plantilla', [ProductController::class, 'downloadTemplate'])->name('products.template');

    // --- VENTAS ---
    Route::get('/vender', [SaleController::class, 'index'])->name('sales.index');
    Route::post('/vender', [SaleController::class, 'store'])->name('sales.store');
    Route::get('/ventas/{id}', [SaleController::class, 'show'])->name('sales.show');
    Route::delete('/ventas/{id}', [SaleController::class, 'destroy'])->name('sales.destroy');
    Route::get('/api/ventas/{id}/ticket', [SaleController::class, 'getTicket'])->name('api.sales.ticket');

    // --- CLIENTES ---
    Route::get('/clientes', [ClientController::class, 'index'])->name('clients.index');
    Route::post('/clientes', [ClientController::class, 'store'])->name('clients.store');
    Route::get('/clientes/{id}', [ClientController::class, 'show'])->name('clients.show');
    Route::put('/clientes/{id}', [ClientController::class, 'update'])->name('clients.update');
    Route::delete('/clientes/{id}', [ClientController::class, 'destroy'])->name('clients.destroy');
    Route::get('/api/clientes/search', [ClientController::class, 'search'])->name('clients.search');

    // --- CAJA ---
    Route::get('/caja', [CashController::class, 'index'])->name('cash.index');
    Route::post('/caja', [CashController::class, 'store'])->name('cash.store');
    Route::get('/caja/cierre', [CashController::class, 'cierreCaja'])->name('cash.cierre'); 
    Route::post('/caja/cierre', [CashController::class, 'storeCierre'])->name('cash.save_cierre');
    Route::delete('/caja/{id}', [CashController::class, 'destroy'])->name('cash.destroy');
    Route::get('/caja/historial/{id}', [CashController::class, 'show'])->name('cash.show');

    // --- CONFIGURACIÓN ---
    Route::get('/configuracion', [SettingController::class, 'index'])->name('settings.index');
    Route::post('/configuracion', [SettingController::class, 'store'])->name('settings.store');
    Route::put('/configuracion/{id}', [SettingController::class, 'update'])->name('settings.update');
    Route::delete('/configuracion/{id}', [SettingController::class, 'destroy'])->name('settings.destroy');

    // --- USUARIOS ---
    Route::get('/usuarios', function () { 
        return Inertia::render('Usuarios', ['usuarios' => \App\Models\User::all()]); 
    });

    // --- REPORTES ---
    Route::prefix('reportes')->group(function () {
        // Dashboard principal de reportes (Gráficos)
        Route::get('/', [ReportController::class, 'index'])->name('reports.index');
        
        // Historial de ventas
        Route::get('/ventas-contado', [SaleController::class, 'history'])->name('reports.sales');
        
        // ✅ ESTA ERA LA LÍNEA QUE FALTABA:
        Route::get('/baja-existencia', [ReportController::class, 'inventarioBajo'])->name('reports.low_stock');
        
        // Inventario general
        Route::get('/inventario', function() { 
            return Inertia::render('Inventario', [
                'productos' => \App\Models\Product::with('category')->get()
            ]); 
        })->name('reports.inventory');
    });

    // Fallback 404
    Route::fallback(function () {
        return Inertia::render('NotFound');
    });

});
