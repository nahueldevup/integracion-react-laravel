import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import { Header } from "@/Components/Header";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { useToast } from "@/Hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/Components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    Plus,
    Minus,
    DollarSign,
    TrendingUp,
    TrendingDown,
    Wallet,
} from "lucide-react";

interface User {
    id: number;
    name: string;
}

interface CashMovement {
    id: number;
    type: string;
    amount: number;
    description: string;
    user_id: number;
    user?: User;
    created_at: string;
}

interface Resumen {
    total_ingresos: number;
    total_egresos: number;
    ventas_efectivo: number;
    ventas_tarjeta: number;
    ventas_transferencia: number;
    total_ventas: number;
    saldo_caja: number;
}

interface Props {
    movimientos: {
        ingresos: CashMovement[];
        egresos: CashMovement[];
    };
    resumen: Resumen;
}

export default function Caja({ movimientos, resumen }: Props) {
    const { toast } = useToast();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [movementType, setMovementType] = useState<"income" | "expense">(
        "income"
    );
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = () => {
        if (!amount || !description) {
            toast({
                title: "Error",
                description: "Completa todos los campos",
                variant: "destructive",
            });
            return;
        }

        router.post(
            "/caja",
            {
                type: movementType,
                amount: parseFloat(amount),
                description: description,
            },
            {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    setAmount("");
                    setDescription("");
                    toast({
                        title: "Movimiento registrado",
                        description: "Se ha guardado correctamente",
                    });
                },
                onError: () => {
                    toast({
                        title: "Error",
                        description: "No se pudo registrar el movimiento",
                        variant: "destructive",
                    });
                },
            }
        );
    };

    return (
        <MainLayout>
            <Head title="Caja" />
            <div className="flex-1 flex flex-col">
                <Header title="Caja" subtitle="Gestión de Efectivo" />

                <main className="flex-1 p-6 bg-background">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {/* Resumen Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-card p-4 rounded-lg border border-border shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Saldo en Caja
                                        </p>
                                        <p className="text-2xl font-bold text-green-600">
                                            ${resumen.saldo_caja.toFixed(2)}
                                        </p>
                                    </div>
                                    <Wallet className="w-8 h-8 text-green-500" />
                                </div>
                            </div>

                            <div className="bg-card p-4 rounded-lg border border-border shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Ingresos
                                        </p>
                                        <p className="text-2xl font-bold text-blue-600">
                                            ${resumen.total_ingresos.toFixed(2)}
                                        </p>
                                    </div>
                                    <TrendingUp className="w-8 h-8 text-blue-500" />
                                </div>
                            </div>

                            <div className="bg-card p-4 rounded-lg border border-border shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Egresos
                                        </p>
                                        <p className="text-2xl font-bold text-red-600">
                                            ${resumen.total_egresos.toFixed(2)}
                                        </p>
                                    </div>
                                    <TrendingDown className="w-8 h-8 text-red-500" />
                                </div>
                            </div>

                            <div className="bg-card p-4 rounded-lg border border-border shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Ventas Total
                                        </p>
                                        <p className="text-2xl font-bold text-purple-600">
                                            ${resumen.total_ventas.toFixed(2)}
                                        </p>
                                    </div>
                                    <DollarSign className="w-8 h-8 text-purple-500" />
                                </div>
                            </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex gap-3">
                            <Button
                                onClick={() => {
                                    setMovementType("income");
                                    setIsDialogOpen(true);
                                }}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Registrar Ingreso
                            </Button>
                            <Button
                                onClick={() => {
                                    setMovementType("expense");
                                    setIsDialogOpen(true);
                                }}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                <Minus className="w-4 h-4 mr-2" />
                                Registrar Egreso
                            </Button>
                        </div>

                        {/* Tablas de Movimientos */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Ingresos */}
                            <div className="bg-card rounded-lg border border-border">
                                <div className="p-4 border-b border-border">
                                    <h3 className="font-bold text-lg text-green-600">
                                        Ingresos
                                    </h3>
                                </div>
                                <div className="max-h-[400px] overflow-y-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>
                                                    Descripción
                                                </TableHead>
                                                <TableHead>Monto</TableHead>
                                                <TableHead>Usuario</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {movimientos.ingresos.length ===
                                            0 ? (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={3}
                                                        className="text-center text-muted-foreground"
                                                    >
                                                        Sin ingresos registrados
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                movimientos.ingresos.map(
                                                    (mov) => (
                                                        <TableRow key={mov.id}>
                                                            <TableCell>
                                                                {
                                                                    mov.description
                                                                }
                                                            </TableCell>
                                                            <TableCell className="text-green-600 font-semibold">
                                                                $
                                                                {Number(
                                                                    mov.amount
                                                                ).toFixed(2)}
                                                            </TableCell>
                                                            <TableCell className="text-sm text-muted-foreground">
                                                                {mov.user
                                                                    ?.name ||
                                                                    "Sistema"}
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                )
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>

                            {/* Egresos */}
                            <div className="bg-card rounded-lg border border-border">
                                <div className="p-4 border-b border-border">
                                    <h3 className="font-bold text-lg text-red-600">
                                        Egresos
                                    </h3>
                                </div>
                                <div className="max-h-[400px] overflow-y-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>
                                                    Descripción
                                                </TableHead>
                                                <TableHead>Monto</TableHead>
                                                <TableHead>Usuario</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {movimientos.egresos.length ===
                                            0 ? (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={3}
                                                        className="text-center text-muted-foreground"
                                                    >
                                                        Sin egresos registrados
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                movimientos.egresos.map(
                                                    (mov) => (
                                                        <TableRow key={mov.id}>
                                                            <TableCell>
                                                                {
                                                                    mov.description
                                                                }
                                                            </TableCell>
                                                            <TableCell className="text-red-600 font-semibold">
                                                                $
                                                                {Number(
                                                                    mov.amount
                                                                ).toFixed(2)}
                                                            </TableCell>
                                                            <TableCell className="text-sm text-muted-foreground">
                                                                {mov.user
                                                                    ?.name ||
                                                                    "Sistema"}
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                )
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Dialog para agregar movimiento */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {movementType === "income"
                                    ? "Registrar Ingreso"
                                    : "Registrar Egreso"}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Monto</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Descripción</Label>
                                <Input
                                    placeholder="Describe el movimiento"
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="ghost"
                                onClick={() => setIsDialogOpen(false)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                className={
                                    movementType === "income"
                                        ? "bg-green-600 hover:bg-green-700"
                                        : "bg-red-600 hover:bg-red-700"
                                }
                            >
                                Guardar
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </MainLayout>
    );
}
