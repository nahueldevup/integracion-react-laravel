import { useState } from "react";
import { router, Head, Link } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/Components/ui/card";
import { Mail, User, Lock } from "lucide-react";
import MainLayout from "@/Layouts/MainLayout";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        router.post("/register", {
            name,
            email,
            password,
            password_confirmation: passwordConfirmation,
        });
    };

    return (
        <MainLayout>
            <Head title="Registrarse" />
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl text-center">
                            Registra tu negocio
                        </CardTitle>
                        <CardDescription className="text-center">
                            Crea una cuenta de administrador para comenzar
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    <User className="inline w-4 h-4 mr-2" />
                                    Nombre completo
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Ingresa tu nombre completo"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">
                                    <Mail className="inline w-4 h-4 mr-2" />
                                    Correo electrónico
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="correo@ejemplo.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">
                                    <Lock className="inline w-4 h-4 mr-2" />
                                    Contraseña
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Crea una contraseña segura"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation">
                                    <Lock className="inline w-4 h-4 mr-2" />
                                    Confirmar contraseña
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    placeholder="Confirma tu contraseña"
                                    value={passwordConfirmation}
                                    onChange={(e) =>
                                        setPasswordConfirmation(e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-success hover:bg-success/90"
                            >
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
