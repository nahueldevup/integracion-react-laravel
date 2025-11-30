import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import { Header } from "@/Components/Header";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { useToast } from "@/Hooks/use-toast";
import {
    Search,
    Plus,
    Edit,
    Trash2,
    Eye,
    Phone,
    User,
    DollarSign,
    ShoppingBag,
} from "lucide-react";
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
import {
    Card,
    CardContent,
} from "@/Components/ui/card";

interface Client {
    id: number;
    name: string;
    phone: string | null;
    total_compras: number;
    total_gastado: number;
    created_at: string;
}

interface Props {
    clients: Client[];
}

interface Props {
    clients: Client[];
}

export default function Clientes({ clients }: Props) {
    const { toast } = useToast();

    const [searchQuery, setSearchQuery] = useState("");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    
    const [newClient, setNewClient] = useState({
        name: "",
        phone: "",
    });

    const [editingClient, setEditingClient] = useState({
        id: 0,
        name: "",
        phone: "",
    });

    const filteredClients = clients.filter(
        (client) =>
            client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (client.phone && client.phone.includes(searchQuery))
    );

    const handleSaveClient = () => {
        if (!newClient.name) {
            toast({
                title: "Error",
                description: "El nombre es obligatorio",
                variant: "destructive",
            });
            return;
        }

        router.post(
            "/clientes",
            newClient,
            {
                onSuccess: () => {
                    setIsAddDialogOpen(false);
                    setNewClient({ name: "", phone: "" });
                    toast({
                        title: "Cliente creado",
                        description: "Se ha registrado correctamente",
                    });
                },
            }
        );
    };

    const handleEditClick = (client: Client) => {
        setEditingClient({
            id: client.id,
            name: client.name,
            phone: client.phone || "",
        });
        setIsEditDialogOpen(true);
    };

    const handleUpdateClient = () => {
        router.put(
            `/clientes/${editingClient.id}`,
            {
                name: editingClient.name,
                phone: editingClient.phone,
            },
            {
                onSuccess: () => {
                    setIsEditDialogOpen(false);
                    toast({
                        title: "Cliente actualizado",
                        description: "Los cambios se guardaron correctamente",
                    });
                },
            }
        );
    };

    const handleDeleteClient = (clientId: number) => {
        if (!confirm("¿Eliminar este cliente?")) return;
        
        router.delete(`/clientes/${clientId}`, {
            onSuccess: () => {
                toast({
                    title: "Cliente eliminado",
                    description: "El cliente ha sido removido",
                });
            },
        });
    };

    const handleViewDetails = (clientId: number) => {
        router.visit(`/clientes/${clientId}`);
    };

    // Estadísticas generales
    const totalClients = clients.length;
    const totalVentas = clients.reduce((sum, c) => sum + c.total_compras, 0);
    const totalIngresos = clients.reduce((sum, c) => sum + c.total_gastado, 0);

    return (
        <MainLayout>
            <Head title="Clientes" />
            <div className="flex-1 flex flex-col">
                <Header title="Gestión de Clientes" />

                <main className="flex-1 p-6 bg-background">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {/* Estadísticas */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                Total Clientes
                                            </p>
                                            <p className="text-2xl font-bold">
                                                {totalClients}
                                            </p>
                                        </div>
                                        <User className="w-8 h-8 text-blue-500" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                Ventas Totales
                                            </p>
                                            <p className="text-2xl font-bold">
                                                {totalVentas}
                                            </p>
                                        </div>
                                        <ShoppingBag className="w-8 h-8 text-green-500" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                Ingresos Totales
                                            </p>
                                            <p className="text-2xl font-bold text-green-600">
                                                ${totalIngresos.toFixed(2)}
                                            </p>
                                        </div>
                                        <DollarSign className="w-8 h-8 text-purple-500" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Barra de búsqueda */}
                        <div className="flex items-center gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar por nombre o teléfono..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Button
                                onClick={() => setIsAddDialogOpen(true)}
                                className="flex items-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                Nuevo Cliente
                            </Button>
                        </div>

                        {/* Tabla de clientes */}
                        <div className="bg-card rounded-lg border border-border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>#</TableHead>
                                        <TableHead>Nombre</TableHead>
                                        <TableHead>Teléfono</TableHead>
                                        <TableHead>Total Compras</TableHead>
                                        <TableHead>Total Gastado</TableHead>
                                        <TableHead>Registrado</TableHead>
                                        <TableHead>Opciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredClients.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
                                                className="text-center text-muted-foreground"
                                            >
                                                No se encontraron clientes
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredClients.map((client) => (
                                            <TableRow key={client.id}>
                                                <TableCell>{client.id}</TableCell>
                                                <TableCell className="font-medium">
                                                    {client.name}
                                                </TableCell>
                                                <TableCell>
                                                    {client.phone || "Sin teléfono"}
                                                </TableCell>
                                                <TableCell>
                                                    {client.total_compras}
                                                </TableCell>
                                                <TableCell className="font-semibold text-green-600">
                                                    ${client.total_gastado.toFixed(2)}
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {client.created_at}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-8 w-8 p-0"
                                                            onClick={() => handleViewDetails(client.id)}
                                                        >
                                                            <Eye className="w-4 h-4 text-blue-600" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-8 w-8 p-0"
                                                            onClick={() => handleEditClick(client)}
                                                        >
                                                            <Edit className="w-4 h-4 text-warning" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-8 w-8 p-0"
                                                            onClick={() => handleDeleteClient(client.id)}
                                                        >
                                                            <Trash2 className="w-4 h-4 text-destructive" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </main>

                {/* Dialog Agregar Cliente */}
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Nuevo Cliente</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    <User className="inline w-4 h-4 mr-2" />
                                    Nombre *
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="Nombre completo"
                                    value={newClient.name}
                                    onChange={(e) =>
                                        setNewClient({ ...newClient, name: e.target.value })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">
                                    <Phone className="inline w-4 h-4 mr-2" />
                                    Teléfono
                                </Label>
                                <Input
                                    id="phone"
                                    placeholder="Número de teléfono"
                                    value={newClient.phone}
                                    onChange={(e) =>
                                        setNewClient({ ...newClient, phone: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="ghost" onClick={() => setIsAddDialogOpen(false)}>
                                Cancelar
                            </Button>
                            <Button onClick={handleSaveClient} className="bg-success">
                                Guardar
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Dialog Editar Cliente */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Editar Cliente</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">Nombre *</Label>
                                <Input
                                    id="edit-name"
                                    placeholder="Nombre completo"
                                    value={editingClient.name}
                                    onChange={(e) =>
                                        setEditingClient({ ...editingClient, name: e.target.value })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-phone">Teléfono</Label>
                                <Input
                                    id="edit-phone"
                                    placeholder="Número de teléfono"
                                    value={editingClient.phone}
                                    onChange={(e) =>
                                        setEditingClient({ ...editingClient, phone: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="ghost" onClick={() => setIsEditDialogOpen(false)}>
                                Cancelar
                            </Button>
                            <Button onClick={handleUpdateClient} className="bg-success">
                                Guardar Cambios
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </MainLayout>
    );
}