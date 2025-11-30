import { useState } from "react";
import { Header } from "@/Components/Header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MainLayout from "@/Layouts/MainLayout";
import { Head } from "@inertiajs/react";

interface ProductoStock {
  id: number;
  codigoBarras: string;
  descripcion: string;
  existencia: number;
  stock: number;
  diferencia: number;
}

export default function Inventario() {
  const [currentPage] = useState(1);
  const [productos] = useState<ProductoStock[]>([
    {
      id: 1,
      codigoBarras: "1",
      descripcion: "pan",
      existencia: 7,
      stock: 20,
      diferencia: 13,
    },
  ]);

  return (
    <MainLayout>
      <Head title="Inventario" />
      <div className="flex-1 flex flex-col">
        <Header title="proyecto" subtitle="Productos en stock" />

        <main className="flex-1 p-6 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-center gap-2 mb-6">
              <Button variant="outline" size="sm" disabled={currentPage === 1}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="default" size="sm" className="bg-primary">
                {currentPage}
              </Button>
              <Button variant="outline" size="sm" disabled>
                <ChevronRight className="w-4 h-4" />
              </Button>
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
                    <TableHead>Código de barras</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Existencia</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Diferencia</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productos.map((producto) => (
                    <TableRow key={producto.id}>
                      <TableCell className="text-center">{producto.id}</TableCell>
                      <TableCell>{producto.codigoBarras}</TableCell>
                      <TableCell>{producto.descripcion}</TableCell>
                      <TableCell>{producto.existencia}</TableCell>
                      <TableCell>{producto.stock}</TableCell>
                      <TableCell>{producto.diferencia}</TableCell>
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