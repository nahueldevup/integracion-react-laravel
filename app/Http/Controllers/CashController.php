<?php
//php artisan make:controller CashController
namespace App\Http\Controllers;

use App\Models\CashMovement;
use App\Models\Sale;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CashController extends Controller
{
    /**
     * Mostrar pantalla de caja con movimientos y resumen
     */
    public function index(Request $request)
    {
        //Filtros de fecha (por defecto hoy)
        $fechaDesde = $request->fecha_desde ?? now()->startOfDay()->toDateTimeString();
        $fechaHasta = $request->fecha_hasta ?? now()->endOfDay()->toDateTimeString();

        //Movimientos de caja
        $movements = CashMovement::with('user')
                    ->whereBetween('created_at', [$fechaDesde, $fechaHasta])
                    ->orderBy('created_at', 'desc')
                    ->get();

        //Ventas del período
        $sales = Sale::whereBetween('created_at', [$fechaDesde, $fechaHasta])
                     ->get();

        //Cálculos de resumen
        $ingresos = $movements->where('type', 'income')->sum('amount');
        $egresos = $movements->where('type', 'expense')->sum('amount');
        $ventasEfectivo = $sales->where('payment_method', 'efectivo')->sum('total');
        $ventasTarjeta = $sales->where('payment_method', 'tarjeta')->sum('total');
        $ventasTransferencia = $sales->where('payment_method', 'transferencia')->sum('total');
        
        $totalVentas = $ventasEfectivo + $ventasTarjeta + $ventasTransferencia;
        $saldoCaja = $ingresos - $egresos + $ventasEfectivo; // Solo efectivo afecta caja física

        return Inertia::render('Caja', [
            'movimientos' => [
                'ingresos' => $movements->where('type', 'income')->values(),
                'egresos' => $movements->where('type', 'expense')->values(),
            ],
            'resumen' => [
                'total_ingresos' => $ingresos,
                'total_egresos' => $egresos,
                'ventas_efectivo' => $ventasEfectivo,
                'ventas_tarjeta' => $ventasTarjeta,
                'ventas_transferencia' => $ventasTransferencia,
                'total_ventas' => $totalVentas,
                'saldo_caja' => $saldoCaja,
            ],
            'filtros' => [
                'fecha_desde' => $fechaDesde,
                'fecha_hasta' => $fechaHasta,
            ]
        ]);
    }

    /**
     * Registrar nuevo movimiento de caja
     */
    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|in:income,expense',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'required|string|max:255',
        ]);
        
        CashMovement::create([
            'type' => $request->type,
            'amount' => $request->amount,
            'description' => $request->description,
            'user_id' => Auth::id() ?? 1,
        ]);

        $mensaje = $request->type === 'income' 
            ? 'Ingreso registrado correctamente' 
            : 'Egreso registrado correctamente';

        return redirect()->back()->with('success', $mensaje);
    }

    /**
     * Eliminar movimiento de caja
     */
    public function destroy($id)
    {
        $movement = CashMovement::findOrFail($id);
        $movement->delete();

        return redirect()->back()->with('success', 'Movimiento eliminado correctamente');
    }

    /**
     * Reporte de cierre de caja
     */
    public function cierreCaja(Request $request)
    {
        $fechaDesde = $request->fecha_desde ?? now()->startOfDay();
        $fechaHasta = $request->fecha_hasta ?? now()->endOfDay();

        // Obtener datos del período
        $movements = CashMovement::whereBetween('created_at', [$fechaDesde, $fechaHasta])->get();
        $sales = Sale::with('details')->whereBetween('created_at', [$fechaDesde, $fechaHasta])->get();

        // Cálculos detallados
        $ingresos = $movements->where('type', 'income')->sum('amount');
        $egresos = $movements->where('type', 'expense')->sum('amount');
        
        $totalVentas = $sales->sum('total');
        $costoVentas = $sales->flatMap->details->sum(function($detail) {
            return $detail->cost * $detail->quantity;
        });
        $utilidadBruta = $totalVentas - $costoVentas;

        // Desglose por método de pago
        $ventasPorMetodo = $sales->groupBy('payment_method')->map(function($group) {
            return [
                'cantidad' => $group->count(),
                'total' => $group->sum('total'),
            ];
        });

        return Inertia::render('CierreCaja', [
            'periodo' => [
                'desde' => $fechaDesde->format('d/m/Y H:i'),
                'hasta' => $fechaHasta->format('d/m/Y H:i'),
            ],
            'resumen' => [
                'total_ventas' => $totalVentas,
                'costo_ventas' => $costoVentas,
                'utilidad_bruta' => $utilidadBruta,
                'ingresos_caja' => $ingresos,
                'egresos_caja' => $egresos,
                'saldo_caja' => $ingresos - $egresos + $ventasPorMetodo->get('efectivo')['total'] ?? 0,
            ],
            'ventas_por_metodo' => $ventasPorMetodo,
            'movimientos_detalle' => [
                'ingresos' => $movements->where('type', 'income')->values(),
                'egresos' => $movements->where('type', 'expense')->values(),
            ],
        ]);
    }
}