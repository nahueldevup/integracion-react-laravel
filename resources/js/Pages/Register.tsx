import { useState } from "react";
import { router, Head, Link } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Mail, Store, Lock } from "lucide-react";
import MainLayout from "@/Layouts/MainLayout";

export default function Register() {
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    // Enviar datos a Laravel
    router.post('/register', {
        email,
        businessName,
        password,
        password_confirmation: confirmPassword
    });
  };

  return (
    <MainLayout>
      <Head title="Registrarse" />
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Registra tu negocio</CardTitle>
            <CardDescription className="text-center">
              Crea una cuenta para comenzar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  <Mail className="inline w-4 h-4 mr-2" />
                  Tu correo electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Tu correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessName">
                  <Store className="inline w-4 h-4 mr-2" />
                  Nombre de tu negocio
                </Label>
                <Input
                  id="businessName"
                  type="text"
                  placeholder="Nombre de tu negocio"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  <Lock className="inline w-4 h-4 mr-2" />
                  Escribe una contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Escribe una contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  <Lock className="inline w-4 h-4 mr-2" />
                  Confirma tu contraseña
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirma tu contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-success hover:bg-success/90">
                REGISTRARME
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  className="text-primary"
                  asChild
                >
                  <Link href="/login">
                    YA TENGO UNA CUENTA
                  </Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}