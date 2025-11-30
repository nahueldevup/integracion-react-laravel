import { Header } from "@/Components/Header";
import { DashboardCard } from "@/Components/DashboardCard";
import { ShoppingBag, Package, LayoutGrid, BarChart3, FileText, Shield, Settings } from "lucide-react";
import { router, Head } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";

export default function Dashboard() {
  return (
    <MainLayout>
      <Head title="Inicio" />
      <div className="flex-1 flex flex-col">
        <Header title="proyecto" subtitle="Inicio" />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">Bienvenido. Elija una opción</h2>
              <p className="text-muted-foreground">
                Recuerde que siempre puede explorar el menú completo haciendo click en la parte superior izquierda
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DashboardCard
                title="Realizar una venta"
                description="Hacer una venta al contado o un apartado"
                icon={ShoppingBag}
                iconColor="text-warning"
                onClick={() => router.visit("/vender")}
              />
              
              <DashboardCard
                title="Ver inventario"
                description="Registrar, eliminar o actualizar detalles productos"
                icon={Package}
                iconColor="text-primary"
                onClick={() => router.visit("/productos")}
              />
              
              <DashboardCard
                title="Escritorio"
                description="Resumen de todos los movimientos de su tienda"
                icon={LayoutGrid}
                iconColor="text-info"
                onClick={() => router.visit("/escritorio")}
              />
              
              <DashboardCard
                title="Gráficas"
                description="Compare ventas, vea los productos más vendidos y mucho más"
                icon={BarChart3}
                iconColor="text-primary"
                onClick={() => router.visit("/graficas")}
              />
              
              <DashboardCard
                title="Reportes"
                description="Ver reporte de caja, de ventas al contado o de ventas con tarjeta"
                icon={FileText}
                iconColor="text-foreground"
                onClick={() => router.visit("/reportes")}
              />
              
              <DashboardCard
                title="Usuarios"
                description="Administrar usuarios (o cajeros) así como sus permisos"
                icon={Shield}
                iconColor="text-success"
                onClick={() => router.visit("/usuarios")}
              />
              
              <DashboardCard
                title="Ajustes"
                description="Cambiar los datos de su tienda, configurar la impresora, etcétera"
                icon={Settings}
                iconColor="text-warning"
                onClick={() => router.visit("/ajustes")}
              />
            </div>
          </div>
        </main>
      </div>
    </MainLayout>
  );
}