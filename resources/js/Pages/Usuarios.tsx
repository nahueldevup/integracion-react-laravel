import { useState } from "react";
import { Header } from "@/Components/Header";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Check, Trash2, Plus } from "lucide-react";
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
  DialogFooter,
} from "@/Components/ui/dialog";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import MainLayout from "@/Layouts/MainLayout";
import { Head } from "@inertiajs/react";

interface Usuario {
  id: number;
  nombre: string;
}

export default function Usuarios() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usuarios] = useState<Usuario[]>([
    { id: 1, nombre: "parzibyte" },
  ]);

  const handleSave = () => {
    if (!username || !password || !confirmPassword) {
      return;
    }
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    // Aquí iría la lógica para guardar el usuario
    setIsDialogOpen(false);
    setUsername("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <MainLayout>
      <Head title="Usuarios" />
      <div className="flex-1 flex flex-col">
        <Header title="proyecto" subtitle="Usuarios" />

        <main className="flex-1 p-6 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="bg-card rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">
                      <button className="flex items-center gap-1">
                        # <span className="text-xs">↑</span>
                      </button>
                    </TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Opciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usuarios.map((usuario) => (
                    <TableRow key={usuario.id}>
                      <TableCell className="text-center">{usuario.id}</TableCell>
                      <TableCell>{usuario.nombre}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <Check className="w-4 h-4 text-success" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <Button
              onClick={() => setIsDialogOpen(true)}
              className="fixed bottom-8 right-8 rounded-full w-14 h-14 shadow-lg bg-primary"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </div>
        </main>

        {/* Nuevo Usuario Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuevo usuario</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="username">Nombre de usuario</Label>
                <Input
                  id="username"
                  placeholder="Nombre de usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Repetir contraseña</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Repetir contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <Alert className="bg-primary/10 border-primary">
                <AlertDescription className="text-sm">
                  Recuerde elegir una contraseña segura, ya que de eso dependerá la
                  seguridad de su cuenta.
                  <br />
                  <br />
                  No elija una contraseña como 123, 1245, su fecha de nacimiento o el
                  nombre de su mascota
                </AlertDescription>
              </Alert>
            </div>

            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
                CERRAR
              </Button>
              <Button className="bg-success hover:bg-success/90" onClick={handleSave}>
                GUARDAR
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}