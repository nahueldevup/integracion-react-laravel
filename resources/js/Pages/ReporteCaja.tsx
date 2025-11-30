import { useState } from "react";
import { Header } from "@/Components/Header";
import { Button } from "@/Components/ui/button";
import { Filter, Printer, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import MainLayout from "@/Layouts/MainLayout";
import { Head } from "@inertiajs/react";

interface Venta {
  id: number;
  monto: number;
  utilidad: number;
  fecha: string;
  cliente: string;
  usuario: string;
}

export default function VentasContado() {
  const [ventas] = useState<Venta[]>([
    {
      id: 1,
      monto: 20.0,
      utilidad: 0.0,
      fecha: "domingo, 5 de octubre de 2025 19:19",
      cliente: "Mostrador",
      usuario: "parzibyte",
    },
    {
      id: 2,
      monto: 240.0,
      utilidad: 0.0,
      fecha: "domingo, 5 de octubre de 2025 19:24",
      cliente: "Mostrador",
      usuario: "parzibyte",
    },
  ]);

  const totalVendido = ventas.reduce((sum, venta) => sum + venta.monto, 0);
  const totalUtilidad = ventas.reduce((sum, venta) => sum + venta.utilidad, 0);

  return (
    <MainLayout>
      <Head title="Ventas Contado" />
      <div className="flex-1 flex flex-col">
        <Header title="proyecto" subtitle="Ventas al contado" />

        <main className="flex-1 p-6 bg-background">
          <div className="max-w-7xl mx-auto">
            <Button variant="link" className="mb-4 text-primary">
              <Filter className="w-4 h-4 mr-2" />
              FILTRAR
            </Button>

            <div className="flex gap-6 mb-6">
              <div className="text-2xl font-semibold">
                $ {totalUtilidad.toFixed(2)} <span className="text-muted-foreground">Utilidad</span>
              </div>
              <div className="text-2xl font-semibold">
                $ {totalVendido.toFixed(2)} <span className="text-muted-foreground">Vendido</span>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">
                      <button className="flex items-center gap-1">
                        # <span className="text-xs">↑</span>
                      </button>
                    </TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Utilidad</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Reimprimir ticket</TableHead>
                    <TableHead>Anular venta</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ventas.map((venta) => (
                    <TableRow key={venta.id}>
                      <TableCell className="text-center">{venta.id}</TableCell>
                      <TableCell>$ {venta.monto.toFixed(2)}</TableCell>
                      <TableCell>$ {venta.utilidad.toFixed(2)}</TableCell>
                      <TableCell>{venta.fecha}</TableCell>
                      <TableCell>{venta.cliente}</TableCell>
                      <TableCell>{venta.usuario}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <Printer className="w-4 h-4 text-primary" />
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </main>
      </div>
    </MainLayout>
  );
}