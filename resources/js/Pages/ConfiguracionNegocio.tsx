import { useState, useRef } from "react";
import { Head, router } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import { useSidebarContext } from "@/Contexts/SidebarContext";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Building, Upload, Menu, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface BusinessSetting {
    id: number;
    business_name: string;
    tax_id: string | null;
    address: string | null;
    phone: string | null;
    email: string | null;
    logo_path: string | null;
}

interface Props {
    settings: BusinessSetting;
}

export default function ConfiguracionNegocio({ settings }: Props) {
    const { toggleSidebar } = useSidebarContext();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        business_name: settings.business_name || "",
        tax_id: settings.tax_id || "",
        address: settings.address || "",
        phone: settings.phone || "",
        email: settings.email || "",
    });

    const [logoPreview, setLogoPreview] = useState<string | null>(
        settings.logo_path ? `/storage/${settings.logo_path}` : null
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.put("/configuracion/negocio", formData, {
            onSuccess: () => {
                toast.success("Configuración actualizada correctamente");
            },
            onError: (errors) => {
                const firstError = Object.values(errors)[0];
                toast.error(firstError as string);
            },
        });
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validar tipo de archivo
        if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
            toast.error("Solo se permiten imágenes JPG, JPEG o PNG");
            return;
        }

        // Validar tamaño (2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error("La imagen no debe superar 2MB");
            return;
        }

        // Preview local
        const reader = new FileReader();
        reader.onloadend = () => {
            setLogoPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Subir al servidor
        const formData = new FormData();
        formData.append("logo", file);

        router.post("/configuracion/negocio/logo", formData, {
            onSuccess: () => {
                toast.success("Logo actualizado correctamente");
                // Recargar la página para obtener datos actualizados del servidor
                router.reload({ only: ["settings"] });
            },
            onError: (errors) => {
                const firstError = Object.values(errors)[0];
                toast.error(firstError as string);
                // Restaurar preview anterior en caso de error
                setLogoPreview(
                    settings.logo_path ? `/storage/${settings.logo_path}` : null
                );
            },
        });
    };

    return (
        <MainLayout>
            <Head title="Configuración - Datos del Negocio" />
            <div className="p-6 max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleSidebar}
                        className="shrink-0"
                    >
                        <Menu className="w-6 h-6" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Datos del Negocio
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Configura la información de tu negocio
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Formulario */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building className="w-5 h-5" />
                                    Información del Negocio
                                </CardTitle>
                                <CardDescription>
                                    Esta información aparecerá en tickets y
                                    reportes
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="business_name">
                                            Nombre del Negocio *
                                        </Label>
                                        <Input
                                            id="business_name"
                                            value={formData.business_name}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    business_name:
                                                        e.target.value,
                                                })
                                            }
                                            placeholder="Ej: Kiosco El Rincón"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="tax_id">
                                            CUIT / RUT
                                        </Label>
                                        <Input
                                            id="tax_id"
                                            value={formData.tax_id}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    tax_id: e.target.value,
                                                })
                                            }
                                            placeholder="Ej: 20-12345678-9"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="address">
                                            Dirección
                                        </Label>
                                        <Textarea
                                            id="address"
                                            value={formData.address}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    address: e.target.value,
                                                })
                                            }
                                            placeholder="Ej: Av. Libertador 1234, CABA"
                                            rows={3}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">
                                                Teléfono
                                            </Label>
                                            <Input
                                                id="phone"
                                                value={formData.phone}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        phone: e.target.value,
                                                    })
                                                }
                                                placeholder="Ej: +54 11 1234-5678"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        email: e.target.value,
                                                    })
                                                }
                                                placeholder="correo@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <Button
                                            type="submit"
                                            className="w-full sm:w-auto"
                                        >
                                            Guardar Cambios
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Logo */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ImageIcon className="w-5 h-5" />
                                    Logo del Negocio
                                </CardTitle>
                                <CardDescription>
                                    Imagen que aparecerá en tickets
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Preview del logo */}
                                <div className="aspect-square w-full bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200 overflow-hidden">
                                    {logoPreview ? (
                                        <img
                                            src={logoPreview}
                                            alt="Logo del negocio"
                                            className="w-full h-full object-contain p-4"
                                        />
                                    ) : (
                                        <div className="text-center text-gray-400">
                                            <ImageIcon className="w-16 h-16 mx-auto mb-2" />
                                            <p className="text-sm">Sin logo</p>
                                        </div>
                                    )}
                                </div>

                                {/* Botón de upload */}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png"
                                    onChange={handleLogoChange}
                                    className="hidden"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    {logoPreview
                                        ? "Cambiar Logo"
                                        : "Subir Logo"}
                                </Button>
                                <p className="text-xs text-muted-foreground text-center">
                                    JPG, JPEG o PNG. Máx. 2MB.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
