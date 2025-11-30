import { useState } from "react";
import { router, Head, Link } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import MainLayout from "@/Layouts/MainLayout";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Por favor ingresa tu correo electrónico");
      return;
    }

    // Enviar petición a Laravel (ajusta la ruta según tu backend)
    router.post('/forgot-password', { email }, {
        onSuccess: () => {
            setIsSubmitted(true);
            toast.success("Correo de recuperación enviado");
        }
    });
  };

  return (
    <MainLayout>
        <Head title="Recuperar Contraseña" />
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
        <Card className="w-full max-w-md">
            <CardHeader className="space-y-2">
            <div className="flex items-center gap-2">
                <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                asChild
                >
                <Link href="/login">
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                </Button>
                <CardTitle className="text-2xl">Recuperar Contraseña</CardTitle>
            </div>
            <CardDescription>
                {!isSubmitted 
                ? "Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña"
                : "Revisa tu correo electrónico"}
            </CardDescription>
            </CardHeader>
            <CardContent>
            {!isSubmitted ? (
                <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="email"
                        type="email"
                        placeholder="tu@correo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                    />
                    </div>
                </div>

                <Button type="submit" className="w-full">
                    Enviar Enlace de Recuperación
                </Button>

                <div className="text-center">
                    <Button
                    type="button"
                    variant="link"
                    className="text-sm"
                    asChild
                    >
                    <Link href="/login">
                        Volver al inicio de sesión
                    </Link>
                    </Button>
                </div>
                </form>
            ) : (
                <div className="space-y-4 text-center">
                <div className="flex justify-center">
                    <div className="rounded-full bg-primary/10 p-3">
                    <CheckCircle className="h-12 w-12 text-primary" />
                    </div>
                </div>
                <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                    Hemos enviado un enlace de recuperación a
                    </p>
                    <p className="font-medium">{email}</p>
                    <p className="text-sm text-muted-foreground">
                    Por favor revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
                    </p>
                </div>
                <div className="pt-4 space-y-2">
                    <Button
                    variant="outline"
                    onClick={() => setIsSubmitted(false)}
                    className="w-full"
                    >
                    Usar otro correo
                    </Button>
                    <Button
                    variant="ghost"
                    className="w-full"
                    asChild
                    >
                    <Link href="/login">
                        Volver al inicio de sesión
                    </Link>
                    </Button>
                </div>
                </div>
            )}
            </CardContent>
        </Card>
        </div>
    </MainLayout>
  );
};