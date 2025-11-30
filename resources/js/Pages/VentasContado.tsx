import { useState, useRef } from "react";
import { Header } from "@/Components/Header";
import { Button } from "@/Components/ui/button";
import { Filter, Printer, Trash2, Eye, Loader2 } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Badge } from "@/Components/ui/badge";
import MainLayout from "@/Layouts/MainLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useToast } from "@/Hooks/use-toast";
import { Ticket, TicketData } from "@/Components/Ticket";
import axios from "axios";
import { useReactToPrint } from "react-to-print";

interface Venta {
    id: number;
    folio: string;
    monto: number;
    utilidad: number;
    fecha: string;
    cliente: string;
    usuario: string;
    metodo_pago: string;
}

interface Props {
    ventas: Venta[];
}

export default function VentasContado({ ventas }: Props) {
    const { toast } = useToast();
    const [ticketData, setTicketData] = useState<TicketData | null>(null);
    const [isTicketOpen, setIsTicketOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const ticketRef = useRef<HTMLDivElement>(null);

    const totalVendido = ventas.reduce(
        (sum, venta) => sum + Number(venta.monto),
        0
    );
    const totalUtilidad = ventas.reduce(
        (sum, venta) => sum + Number(venta.utilidad),
        0
    );

    // Cargar datos y abrir modal
    const openTicketModal = async (id: number) => {
        setIsLoading(true);
        try {
            // Asegúrate de que esta ruta exista en web.php y el controlador tenga getTicket
            const response = await axios.get(`/api/ventas/${id}/ticket`);
            setTicketData(response.data);
            setIsTicketOpen(true);
        } catch (error) {
            console.error(error);
            toast({
                title: "Error al cargar ticket",
                description: "No se pudo obtener la información.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Configurar el hook de impresión
    const handlePrint = useReactToPrint({
        contentRef: ticketRef,
        documentTitle: ticketData
            ? `Ticket-${ticketData.folio}`
            : "Ticket-Venta",
        onAfterPrint: () => console.log("Impresión finalizada"),
        onPrintError: (error) => console.error("Error al imprimir:", error),
    });

    // Función para ejecutar la impresión con seguridad
    const triggerPrint = () => {
        if (!ticketRef.current) {
            console.error("El contenido del ticket no está disponible");
            toast({
                title: "Error",
                description: "El ticket no está listo para imprimir",
                variant: "destructive",
            });
            return;
        }

        if (!ticketData) {
            console.error("No hay datos del ticket");
            toast({
                title: "Error",
                description: "No hay datos para imprimir",
                variant: "destructive",
            });
            return;
        }

        handlePrint();
    };

    // Anular venta
    const handleAnular = (id: number) => {
        if (
            confirm(
                "¿Estás seguro de ANULAR esta venta?\n\n- Se devolverá el stock al inventario.\n- La venta desaparecerá de los reportes.\n\nEsta acción no se puede deshacer."
            )
        ) {
            router.delete(`/ventas/${id}`, {
                onSuccess: () =>
                    toast({
                        title: "Venta anulada y stock restaurado",
                        className: "bg-green-600 text-white",
                    }),
                onError: () =>
                    toast({ title: "Error al anular", variant: "destructive" }),
            });
        }
    };

    return (
        <MainLayout>
            <Head title="Historial de Ventas" />
            <div className="flex-1 flex flex-col">
                <Header
                    title="Historial de Ventas"
                    subtitle="Registro completo de operaciones"
                />

                <main className="flex-1 p-6 bg-background">
                    <div className="max-w-7xl mx-auto space-y-6">
                        <div className="flex flex-col md:flex-row gap-6 justify-between items-end">
                            <div className="flex gap-6">
                                <div className="bg-white p-4 rounded-lg border shadow-sm">
                                    <p className="text-sm text-muted-foreground">
                                        Ventas Totales
                                    </p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        $ {totalVendido.toFixed(2)}
                                    </p>
                                </div>
                                <div className="bg-white p-4 rounded-lg border shadow-sm">
                                    <p className="text-sm text-muted-foreground">
                                        Utilidad Estimada
                                    </p>
                                    <p className="text-2xl font-bold text-green-600">
                                        $ {totalUtilidad.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                            <Button variant="outline" className="gap-2">
                                <Filter className="w-4 h-4" /> Filtros
                            </Button>
                        </div>

                        <div className="bg-card rounded-lg border border-border shadow-sm">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">
                                            Folio
                                        </TableHead>
                                        <TableHead>Fecha</TableHead>
                                        <TableHead>Cliente</TableHead>
                                        <TableHead>Cajero</TableHead>
                                        <TableHead>Método</TableHead>
                                        <TableHead className="text-right">
                                            Total
                                        </TableHead>
                                        <TableHead className="text-center">
                                            Acciones
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {ventas.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
                                                className="text-center py-8 text-muted-foreground"
                                            >
                                                No hay ventas registradas
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        ventas.map((venta) => (
                                            <TableRow key={venta.id}>
                                                <TableCell className="font-mono text-xs font-bold">
                                                    {venta.folio}
                                                </TableCell>
                                                <TableCell className="text-xs">
                                                    {venta.fecha}
                                                </TableCell>
                                                <TableCell>
                                                    {venta.cliente}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-xs">
                                                    {venta.usuario}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className="capitalize"
                                                    >
                                                        {venta.metodo_pago}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right font-bold">
                                                    ${" "}
                                                    {Number(
                                                        venta.monto
                                                    ).toFixed(2)}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex justify-center gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() =>
                                                                openTicketModal(
                                                                    venta.id
                                                                )
                                                            }
                                                            disabled={isLoading}
                                                        >
                                                            <Printer className="w-4 h-4 text-slate-600" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() =>
                                                                handleAnular(
                                                                    venta.id
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="w-4 h-4 text-red-500 hover:text-red-700" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </main>

                {/* MODAL DE TICKET */}
                <Dialog open={isTicketOpen} onOpenChange={setIsTicketOpen}>
                    <DialogContent className="max-w-sm">
                        <DialogHeader>
                            <DialogTitle>Imprimir Ticket</DialogTitle>
                        </DialogHeader>

                        {/* IMPORTANTE: El Ticket debe estar montado en el DOM para que react-to-print lo vea.
                    Usamos 'hidden' en lugar de no renderizarlo si quisiéramos imprimir sin verlo, 
                    pero aquí lo mostramos.
                */}
                        <div className="bg-gray-100 p-4 rounded-md flex justify-center max-h-[60vh] overflow-y-auto">
                            {ticketData ? (
                                <Ticket ref={ticketRef} data={ticketData} />
                            ) : (
                                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                            )}
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                            <Button
                                variant="outline"
                                onClick={() => setIsTicketOpen(false)}
                            >
                                Cerrar
                            </Button>
                            <Button
                                onClick={triggerPrint}
                                disabled={!ticketData}
                            >
                                <Printer className="w-4 h-4 mr-2" /> Imprimir
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </MainLayout>
    );
}
