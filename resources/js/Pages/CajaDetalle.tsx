import { Header } from "@/Components/Header";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { ArrowLeft, Printer, Wallet, CreditCard, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import MainLayout from "@/Layouts/MainLayout";
import { Head, Link } from "@inertiajs/react";

interface Movement {
    id: number;
    amount: number;
    description: string;
    type: 'ingreso' | 'egreso';
    created_at: string;
    user: { name: string };
}

interface CashCount {
    id: number;
    created_at: string;
    user: { name: string };
    
    // Totales guardados
    sales_cash: number;
    sales_digital: number;
    manual_incomes: number;
    manual_expenses: number;
    expected_cash: number;
    counted_cash: number;
    difference: number;
    notes?: string;
}

interface Props {
    cierre: CashCount;
    movements: Movement[];
}

export default function CajaDetalle({ cierre, movements }: Props) {
    
    const formatDate = (date: string) => new Date(date).toLocaleString('es-ES', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });

    return (
        <MainLayout>
            <Head title={`Cierre #${cierre.id}`} />
            <div className="flex-1 flex flex-col h-full bg-gray-50/50">
                <Header title={`Detalle de Cierre #${cierre.id}`} subtitle={formatDate(cierre.created_at)} />

                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="max-w-5xl mx-auto space-y-6">
                        
                        {/* Botonera Superior */}
                        <div className="flex justify-between items-center print:hidden">
                            <Link href="/caja">
                                <Button variant="outline" className="gap-2">
                                    <ArrowLeft className="w-4 h-4" /> Volver a Caja
                                </Button>
                            </Link>
                            <Button onClick={() => window.print()} className="gap-2">
                                <Printer className="w-4 h-4" /> Imprimir Reporte
                            </Button>
                        </div>

                        {/* 1. RESUMEN DEL ARQUEO */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* Panel Izquierdo: Datos del Sistema */}
                            <Card>
                                <CardHeader className="bg-gray-100/50 border-b pb-3">
                                    <CardTitle className="text-base font-bold text-gray-700">Resumen del Sistema</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4 space-y-3">
                                    <div className="flex justify-between items-center p-2 bg-emerald-50 rounded border border-emerald-100">
                                        <span className="text-sm font-medium text-emerald-800 flex items-center gap-2">
                                            <Wallet className="w-4 h-4"/> Ventas Efectivo
                                        </span>
                                        <span className="font-bold text-emerald-700">$ {Number(cierre.sales_cash).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded border border-blue-100">
                                        <span className="text-sm font-medium text-blue-800 flex items-center gap-2">
                                            <CreditCard className="w-4 h-4"/> Ventas Digitales
                                        </span>
                                        <span className="font-bold text-blue-700">$ {Number(cierre.sales_digital).toFixed(2)}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                        <div>
                                            <p className="text-xs text-gray-500">Ingresos Manuales</p>
                                            <p className="text-green-600 font-bold flex items-center gap-1">
                                                <ArrowUpCircle className="w-3 h-3"/> $ {Number(cierre.manual_incomes).toFixed(2)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Egresos Manuales</p>
                                            <p className="text-red-600 font-bold flex items-center gap-1">
                                                <ArrowDownCircle className="w-3 h-3"/> $ {Number(cierre.manual_expenses).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="pt-2 border-t mt-2 flex justify-between items-center">
                                        <span className="font-bold text-gray-700">Esperado en Cajón:</span>
                                        <span className="text-xl font-bold text-gray-900">$ {Number(cierre.expected_cash).toFixed(2)}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Panel Derecho: Resultado del Cierre */}
                            <Card className="border-2 border-slate-200">
                                <CardHeader className="bg-slate-50 border-b pb-3">
                                    <CardTitle className="text-base font-bold text-slate-700">Resultado del Arqueo</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Usuario Responsable:</span>
                                        <span className="font-medium">{cierre.user.name}</span>
                                    </div>
                                    
                                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                                        <p className="text-sm text-yellow-800 uppercase tracking-wide font-semibold">Dinero Contado</p>
                                        <p className="text-3xl font-bold text-yellow-900">$ {Number(cierre.counted_cash).toFixed(2)}</p>
                                    </div>

                                    <div className={`p-3 rounded text-center border font-bold ${
                                        Number(cierre.difference) === 0 ? 'bg-green-100 text-green-700 border-green-200' : 
                                        Number(cierre.difference) > 0 ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-red-100 text-red-700 border-red-200'
                                    }`}>
                                        {Number(cierre.difference) === 0 ? "✅ Balance Perfecto" : 
                                         Number(cierre.difference) > 0 ? `⚠️ Sobrante: $ ${Number(cierre.difference).toFixed(2)}` : 
                                         `❌ Faltante: $ ${Math.abs(Number(cierre.difference)).toFixed(2)}`}
                                    </div>

                                    {cierre.notes && (
                                        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded italic">
                                            " {cierre.notes} "
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* 2. DETALLE DE MOVIMIENTOS DEL DÍA */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Detalle de Movimientos Manuales</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Hora</TableHead>
                                            <TableHead>Tipo</TableHead>
                                            <TableHead>Descripción</TableHead>
                                            <TableHead>Usuario</TableHead>
                                            <TableHead className="text-right">Monto</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {movements.length === 0 ? (
                                            <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-400">No hubo movimientos manuales ese día</TableCell></TableRow>
                                        ) : (
                                            movements.map((mov) => (
                                                <TableRow key={mov.id}>
                                                    <TableCell>{new Date(mov.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={mov.type === 'ingreso' ? 'default' : 'destructive'} className={mov.type === 'ingreso' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100' : 'bg-rose-100 text-rose-800 hover:bg-rose-100'}>
                                                            {mov.type.toUpperCase()}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>{mov.description}</TableCell>
                                                    <TableCell>{mov.user.name}</TableCell>
                                                    <TableCell className={`text-right font-bold ${mov.type === 'ingreso' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                        {mov.type === 'ingreso' ? '+' : '-'} $ {Number(mov.amount).toFixed(2)}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                    </div>
                </main>
            </div>
        </MainLayout>
    );
}