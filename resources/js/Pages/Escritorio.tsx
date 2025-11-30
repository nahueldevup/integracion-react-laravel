import { Header } from "@/Components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import MainLayout from "@/Layouts/MainLayout";
import { Head } from "@inertiajs/react";

const salesData = [
  { month: "Enero", sales: 0 },
  { month: "Febrero", sales: 0 },
  { month: "Marzo", sales: 0 },
  { month: "Abril", sales: 0 },
  { month: "Mayo", sales: 0 },
  { month: "Junio", sales: 0 },
  { month: "Julio", sales: 0 },
  { month: "Agosto", sales: 0 },
  { month: "Septiembre", sales: 0 },
  { month: "Octubre", sales: 260 },
  { month: "Noviembre", sales: 0 },
  { month: "Diciembre", sales: 0 },
];

const yearData = [
  { year: "2025", value: 260 },
];

export default function Escritorio() {
  return (
    <MainLayout>
      <Head title="Escritorio" />
      <div className="flex-1 flex flex-col">
        <Header title="proyecto" subtitle="Escritorio" />
        
        <main className="flex-1 p-6 bg-background">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-info border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-info-foreground/80 text-sm font-medium mb-1">Vendido al contado</p>
                      <p className="text-3xl font-bold text-info-foreground">$ 260.00</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-info-foreground/80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-warning border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-warning-foreground/80 text-sm font-medium mb-1">Entradas de efectivo</p>
                      <p className="text-3xl font-bold text-warning-foreground">$ 0.00</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-warning-foreground/80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-destructive border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-destructive-foreground/80 text-sm font-medium mb-1">Salidas de efectivo</p>
                      <p className="text-3xl font-bold text-destructive-foreground">$ 0.00</p>
                    </div>
                    <TrendingDown className="w-8 h-8 text-destructive-foreground/80" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ventas de Octubre</CardTitle>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-4 h-4 bg-success rounded"></span>
                    <span className="text-muted-foreground">Cantidad vendida</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={[{ day: "05", amount: 0 }]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="amount" stroke="hsl(var(--success))" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ventas por año</CardTitle>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-4 h-4 bg-destructive rounded"></span>
                    <span className="text-muted-foreground">2025</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="sales" fill="hsl(var(--destructive))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Bottom Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Productos más vendidos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-foreground">pan</span>
                      <span className="text-sm text-muted-foreground">Vendido 13 veces</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Clientes frecuentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Muy pronto...</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top cajeros</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Muy pronto...</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </MainLayout>
  );
}