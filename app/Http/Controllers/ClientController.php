<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientController extends Controller
{
    /**
     * Listar todos los clientes
     */
    public function index()
    {
        $clients = Client::withCount('sales')
                        ->orderBy('name')
                        ->get()
                        ->map(function($client) {
                            return [
                                'id' => $client->id,
                                'name' => $client->name,
                                'phone' => $client->phone,
                                'total_compras' => $client->sales_count,
                                'created_at' => $client->created_at->format('d/m/Y'),
                            ];
                        });

        return Inertia::render('Clientes', [
            'clients' => $clients
        ]);
    }

    /**
     * Crear nuevo cliente
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
        ]);

        Client::create([
            'name' => $request->name,
            'phone' => $request->phone,
        ]);

        return redirect()->back()->with('success', 'Cliente creado correctamente');
    }

    /**
     * Ver detalle de un cliente
     */
    public function show($id)
    {
        $client = Client::with(['sales' => function($query) {
                            $query->orderBy('created_at', 'desc')->limit(10);
                        }])
                        ->findOrFail($id);

        $totalComprado = $client->sales->sum('total');
        $ultimaCompra = $client->sales->first();

        return Inertia::render('ClienteDetalle', [
            'cliente' => [
                'id' => $client->id,
                'name' => $client->name,
                'phone' => $client->phone,
                'created_at' => $client->created_at->format('d/m/Y'),
                'total_comprado' => $totalComprado,
                'total_compras' => $client->sales->count(),
                'ultima_compra' => $ultimaCompra ? $ultimaCompra->created_at->format('d/m/Y') : 'Sin compras',
                'ventas' => $client->sales->map(function($sale) {
                    return [
                        'id' => $sale->id,
                        'folio' => $sale->sale_number,
                        'fecha' => $sale->created_at->format('d/m/Y H:i'),
                        'total' => $sale->total,
                        'metodo_pago' => $sale->payment_method,
                    ];
                }),
            ]
        ]);
    }

    /**
     * Actualizar cliente
     */
    public function update(Request $request, $id)
    {
        $client = Client::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
        ]);

        $client->update([
            'name' => $request->name,
            'phone' => $request->phone,
        ]);

        return redirect()->back()->with('success', 'Cliente actualizado correctamente');
    }

    /**
     * Eliminar cliente (soft delete)
     */
    public function destroy($id)
    {
        $client = Client::findOrFail($id);

        // Verificar si tiene ventas asociadas
        if ($client->sales()->count() > 0) {
            return redirect()->back()->withErrors([
                'error' => 'No se puede eliminar un cliente con ventas registradas'
            ]);
        }

        $client->delete();

        return redirect()->back()->with('success', 'Cliente eliminado correctamente');
    }
}