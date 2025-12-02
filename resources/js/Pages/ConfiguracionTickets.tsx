import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import { useSidebarContext } from "@/Contexts/SidebarContext";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Switch } from "@/Components/ui/switch";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/Components/ui/card";
import { toast } from "sonner";
import { Menu, Printer, FileText, Settings2 } from "lucide-react";

interface PrinterSetting {
    id: number;
    printer_name: string;
    printer_type: string;
    auto_print: boolean;
    paper_width: number;
    paper_height: number;
    show_logo: boolean;
    show_business_info: boolean;
    header_message: string | null;
    footer_message: string | null;
    paper_size: string;
}

interface Props {
    settings: PrinterSetting;
}

export default function ConfiguracionTickets({ settings }: Props) {
    const { toggleSidebar } = useSidebarContext();

    const [formData, setFormData] = useState({
        printer_name: settings.printer_name || "",
        printer_type: settings.printer_type || "thermal",
        auto_print: settings.auto_print ?? false,
        paper_width: settings.paper_width || 80,
        paper_height: settings.paper_height || 200,
        show_logo: settings.show_logo ?? true,
        show_business_info: settings.show_business_info ?? true,
        header_message: settings.header_message || "",
        footer_message: settings.footer_message || "¡Gracias por su compra!",
        paper_size: settings.paper_size || "80mm",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.put("/configuracion/tickets", formData, {
            onSuccess: () =>
                toast.success("Configuración guardada correctamente"),
            onError: (errors) => {
                const firstError = Object.values(errors)[0];
                toast.error(firstError as string);
            },
        });
    };

    return (
        <MainLayout>
            <Head title="Configuración - Impresoras y Tickets" />
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
                            Impresoras y Tickets
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Configura la impresora y personaliza el diseño de
                            los tickets
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Diseño del Ticket */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                Diseño del Ticket
                            </CardTitle>
                            <CardDescription>
                                Personaliza cómo se verán tus tickets de venta
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Switches */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="show_logo">
                                            Mostrar Logo
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            Incluir logo del negocio
                                        </p>
                                    </div>
                                    <Switch
                                        id="show_logo"
                                        checked={formData.show_logo}
                                        onCheckedChange={(checked) =>
                                            setFormData({
                                                ...formData,
                                                show_logo: checked,
                                            })
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="show_business_info">
                                            Mostrar Datos del Negocio
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            Incluir nombre, dirección, CUIT
                                        </p>
                                    </div>
                                    <Switch
                                        id="show_business_info"
                                        checked={formData.show_business_info}
                                        onCheckedChange={(checked) =>
                                            setFormData({
                                                ...formData,
                                                show_business_info: checked,
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            {/* Tamaño de papel */}
                            <div className="space-y-2">
                                <Label htmlFor="paper_size">
                                    Tamaño de Papel
                                </Label>
                                <Select
                                    value={formData.paper_size}
                                    onValueChange={(value) =>
                                        setFormData({
                                            ...formData,
                                            paper_size: value,
                                        })
                                    }
                                >
                                    <SelectTrigger id="paper_size">
                                        <SelectValue placeholder="Selecciona tamaño" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="58mm">
                                            58mm (pequeño)
                                        </SelectItem>
                                        <SelectItem value="80mm">
                                            80mm (estándar)
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Mensajes personalizados */}
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="header_message">
                                        Mensaje de Encabezado
                                    </Label>
                                    <Textarea
                                        id="header_message"
                                        value={formData.header_message}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                header_message: e.target.value,
                                            })
                                        }
                                        placeholder="Ej: ¡Bienvenido a nuestro negocio!"
                                        rows={2}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="footer_message">
                                        Mensaje de Pie de Página
                                    </Label>
                                    <Textarea
                                        id="footer_message"
                                        value={formData.footer_message}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                footer_message: e.target.value,
                                            })
                                        }
                                        placeholder="Ej: ¡Gracias por su compra!"
                                        rows={2}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Configuración de Impresora */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Printer className="w-5 h-5" />
                                Configuración de la Impresora
                            </CardTitle>
                            <CardDescription>
                                Define los parámetros de la impresora
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="printer_name">
                                    Nombre de la Impresora *
                                </Label>
                                <Input
                                    id="printer_name"
                                    value={formData.printer_name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            printer_name: e.target.value,
                                        })
                                    }
                                    placeholder="Ej: Epson TM-T20"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="printer_type">
                                    Tipo de Impresora *
                                </Label>
                                <Select
                                    value={formData.printer_type}
                                    onValueChange={(value) =>
                                        setFormData({
                                            ...formData,
                                            printer_type: value,
                                        })
                                    }
                                >
                                    <SelectTrigger id="printer_type">
                                        <SelectValue placeholder="Selecciona tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="thermal">
                                            Térmica
                                        </SelectItem>
                                        <SelectItem value="inkjet">
                                            Inkjet
                                        </SelectItem>
                                        <SelectItem value="laser">
                                            Laser
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="space-y-0.5">
                                    <Label htmlFor="auto_print">
                                        Impresión Automática
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Imprimir automáticamente al generar
                                        ticket
                                    </p>
                                </div>
                                <Switch
                                    id="auto_print"
                                    checked={formData.auto_print}
                                    onCheckedChange={(checked) =>
                                        setFormData({
                                            ...formData,
                                            auto_print: checked,
                                        })
                                    }
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="paper_width">
                                        Ancho del papel (mm)
                                    </Label>
                                    <Input
                                        id="paper_width"
                                        type="number"
                                        min={40}
                                        value={formData.paper_width}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                paper_width: parseInt(
                                                    e.target.value
                                                ),
                                            })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="paper_height">
                                        Alto del papel (mm)
                                    </Label>
                                    <Input
                                        id="paper_height"
                                        type="number"
                                        min={80}
                                        value={formData.paper_height}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                paper_height: parseInt(
                                                    e.target.value
                                                ),
                                            })
                                        }
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Botón guardar */}
                    <div className="flex justify-end">
                        <Button type="submit" size="lg">
                            <Settings2 className="w-4 h-4 mr-2" />
                            Guardar Configuración
                        </Button>
                    </div>
                </form>
            </div>
        </MainLayout>
    );
}
