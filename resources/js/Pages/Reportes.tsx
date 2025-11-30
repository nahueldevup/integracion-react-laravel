import { Header } from "@/Components/Header";
import MainLayout from "@/Layouts/MainLayout";
import { Head } from "@inertiajs/react";

export default function Reportes() {
  return (
    <MainLayout>
      <Head title="Reportes" />
      <div className="flex-1 flex flex-col">
        <Header title="proyecto" subtitle="Reportes" />
        
        <main className="flex-1 p-6 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-foreground mb-2">Reportes</h2>
              <p className="text-muted-foreground">Esta sección estará disponible próximamente</p>
            </div>
          </div>
        </main>
      </div>
    </MainLayout>
  );
}