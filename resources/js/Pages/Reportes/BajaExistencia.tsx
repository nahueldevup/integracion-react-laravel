import { Header } from "@/Components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { AlertTriangle, ArrowLeft, Printer } from "lucide-react";
import MainLayout from "@/Layouts/MainLayout";
import { Head, Link } from "@inertiajs/react";

interface Producto {
    id: number;
    barcode?: string;
    description: string;
    category?: { name: string };
    stock: number;
    min_stock: number;
}

interface Props {
    productos: Producto[];
}

export default function BajaExistencia({ productos = [] }: Props) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <MainLayout>
            <Head title="Baja Existencia" />
            <div className="flex-1 flex flex-col h-full bg-gray-50/50">
                <Header
                    title="Reporte de Baja Existencia"
                    subtitle="Productos que requieren reabastecimiento"
                />

                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {/* Botonera Superior */}
                        <div className="flex justify-between items-center print:hidden">
                            <Link href="/reportes">
                                <Button variant="outline" className="gap-2">
                                    <ArrowLeft className="w-4 h-4" /> Volver
                                </Button>
                            </Link>
                            <Button onClick={handlePrint} className="gap-2">
                                <Printer className="w-4 h-4" /> Imprimir Lista
                            </Button>
                        </div>

                        {/* Tabla de Productos */}
                        <Card className="border-orange-200 shadow-md">
                            <CardHeader className="bg-orange-50 border-b border-orange-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-orange-800">
                                        <AlertTriangle className="w-5 h-5" />
                                        <CardTitle>
                                            Inventario Crítico (
                                            {productos.length})
                                        </CardTitle>
                                    </div>
                                    {productos.length > 0 && (
                                        <Badge
                                            variant="outline"
                                            className="bg-white"
                                        >
                                            {productos.length} producto
                                            {productos.length !== 1 ? "s" : ""}
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Código</TableHead>
                                                <TableHead>Producto</TableHead>
                                                <TableHead>Categoría</TableHead>
                                                <TableHead className="text-center">
                                                    Stock Actual
                                                </TableHead>
                                                <TableHead className="text-center">
                                                    Stock Mínimo
                                                </TableHead>
                                                <TableHead className="text-right">
                                                    Déficit
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {productos.length === 0 ? (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={6}
                                                        className="text-center py-8 text-green-600 font-medium"
                                                    >
                                                        ¡Excelente! No hay
                                                        productos con bajo
                                                        stock.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                productos.map((prod) => {
                                                    const deficit =
                                                        prod.min_stock -
                                                        prod.stock;

                                                    return (
                                                        <TableRow
                                                            key={prod.id}
                                                            className="hover:bg-orange-50/30"
                                                        >
                                                            <TableCell className="font-mono text-xs">
                                                                {prod.barcode ||
                                                                    "S/C"}
                                                            </TableCell>
                                                            <TableCell className="font-medium">
                                                                {
                                                                    prod.description
                                                                }
                                                            </TableCell>
                                                            <TableCell className="text-muted-foreground">
                                                                {prod.category
                                                                    ?.name ||
                                                                    "General"}
                                                            </TableCell>
                                                            <TableCell className="text-center">
                                                                <Badge
                                                                    variant="destructive"
                                                                    className="text-sm font-bold"
                                                                >
                                                                    {prod.stock}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="text-center text-gray-500">
                                                                {prod.min_stock}
                                                            </TableCell>
                                                            <TableCell className="text-right font-bold text-orange-600">
                                                                {deficit}
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </MainLayout>
    );
}
