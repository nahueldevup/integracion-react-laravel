import { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/Components/ui/alert-dialog";
import {
    UserPlus,
    Pencil,
    Trash2,
    Key,
    Power,
    ShieldCheck,
    User,
    Shield,
} from "lucide-react";
import { toast } from "sonner";

interface User {
    id: number;
    name: string;
    email: string;
    role: "admin" | "vendedor";
    active: boolean;
    permissions: string[] | null;
    created_at: string;
}

interface Props {
    users: User[];
}

export default function ConfiguracionUsuarios({ users }: Props) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isPasswordOpen, setIsPasswordOpen] = useState(false);
    const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Form states para crear usuario
    const [createForm, setCreateForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "vendedor" as "admin" | "vendedor",
    });

    // Form states para editar usuario
    const [editForm, setEditForm] = useState({
        name: "",
        email: "",
        role: "vendedor" as "admin" | "vendedor",
    });

    // Form states para cambiar contraseña
    const [passwordForm, setPasswordForm] = useState({
        password: "",
        password_confirmation: "",
    });

    // State para permisos
    const [permissionsForm, setPermissionsForm] = useState<string[]>([]);

    // Permisos disponibles
    const availablePermissions = [
        { value: "inicio", label: "Inicio" },
        { value: "vender", label: "Vender" },
        { value: "productos", label: "Productos" },
        { value: "clientes", label: "Clientes" },
        { value: "caja", label: "Caja" },
        { value: "reportes", label: "Reportes" },
        { value: "configuracion", label: "Configuración" },
    ];

    const handleCreateUser = (e: React.FormEvent) => {
        e.preventDefault();
        router.post("/configuracion/usuarios", createForm, {
            onSuccess: () => {
                setIsCreateOpen(false);
                setCreateForm({
                    name: "",
                    email: "",
                    password: "",
                    role: "vendedor",
                });
                toast.success("Usuario creado correctamente");
            },
            onError: (errors) => {
                const firstError = Object.values(errors)[0];
                toast.error(firstError as string);
            },
        });
    };

    const handleEditUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;

        router.put(`/configuracion/usuarios/${selectedUser.id}`, editForm, {
            onSuccess: () => {
                setIsEditOpen(false);
                setSelectedUser(null);
                toast.success("Usuario actualizado correctamente");
            },
            onError: (errors) => {
                const firstError = Object.values(errors)[0];
                toast.error(firstError as string);
            },
        });
    };

    const handleUpdatePassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;

        router.put(
            `/configuracion/usuarios/${selectedUser.id}/password`,
            passwordForm,
            {
                onSuccess: () => {
                    setIsPasswordOpen(false);
                    setSelectedUser(null);
                    setPasswordForm({
                        password: "",
                        password_confirmation: "",
                    });
                    toast.success("Contraseña actualizada correctamente");
                },
                onError: (errors) => {
                    const firstError = Object.values(errors)[0];
                    toast.error(firstError as string);
                },
            }
        );
    };

    const handleToggleActive = (user: User) => {
        router.patch(
            `/configuracion/usuarios/${user.id}/toggle-active`,
            {},
            {
                onSuccess: () => {
                    const status = !user.active ? "activado" : "desactivado";
                    toast.success(`Usuario ${status} correctamente`);
                },
                onError: (errors) => {
                    const firstError = Object.values(errors)[0];
                    toast.error(firstError as string);
                },
            }
        );
    };

    const handleDeleteUser = (userId: number) => {
        router.delete(`/configuracion/usuarios/${userId}`, {
            onSuccess: () => {
                toast.success("Usuario eliminado correctamente");
            },
            onError: (errors) => {
                const firstError = Object.values(errors)[0];
                toast.error(firstError as string);
            },
        });
    };

    const openEditDialog = (user: User) => {
        setSelectedUser(user);
        setEditForm({
            name: user.name,
            email: user.email,
            role: user.role,
        });
        setIsEditOpen(true);
    };

    const openPasswordDialog = (user: User) => {
        setSelectedUser(user);
        setPasswordForm({ password: "", password_confirmation: "" });
        setIsPasswordOpen(true);
    };

    const openPermissionsDialog = (user: User) => {
        setSelectedUser(user);
        setPermissionsForm(user.permissions || []);
        setIsPermissionsOpen(true);
    };

    const handleUpdatePermissions = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;

        router.put(
            `/configuracion/usuarios/${selectedUser.id}/permissions`,
            { permissions: permissionsForm },
            {
                onSuccess: () => {
                    setIsPermissionsOpen(false);
                    setSelectedUser(null);
                    setPermissionsForm([]);
                    toast.success("Permisos actualizados correctamente");
                },
                onError: (errors) => {
                    const firstError = Object.values(errors)[0];
                    toast.error(firstError as string);
                },
            }
        );
    };

    const togglePermission = (permission: string) => {
        setPermissionsForm((prev) =>
            prev.includes(permission)
                ? prev.filter((p) => p !== permission)
                : [...prev, permission]
        );
    };

    return (
        <MainLayout>
            <Head title="Configuración - Usuarios y Permisos" />
            <div className="p-6 max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Usuarios y Permisos
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Gestiona los empleados que tienen acceso al sistema
                        </p>
                    </div>

                    {/* Botón Crear Usuario */}
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2">
                                <UserPlus className="w-4 h-4" />
                                Nuevo Usuario
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                                <DialogDescription>
                                    Agrega un nuevo empleado al sistema
                                </DialogDescription>
                            </DialogHeader>
                            <form
                                onSubmit={handleCreateUser}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <Label htmlFor="create-name">
                                        Nombre Completo
                                    </Label>
                                    <Input
                                        id="create-name"
                                        value={createForm.name}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                name: e.target.value,
                                            })
                                        }
                                        placeholder="Ej: Juan Pérez"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="create-email">
                                        Correo Electrónico
                                    </Label>
                                    <Input
                                        id="create-email"
                                        type="email"
                                        value={createForm.email}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                email: e.target.value,
                                            })
                                        }
                                        placeholder="correo@ejemplo.com"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="create-password">
                                        Contraseña
                                    </Label>
                                    <Input
                                        id="create-password"
                                        type="password"
                                        value={createForm.password}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                password: e.target.value,
                                            })
                                        }
                                        placeholder="Mínimo 6 caracteres"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="create-role">Rol</Label>
                                    <Select
                                        value={createForm.role}
                                        onValueChange={(
                                            value: "admin" | "vendedor"
                                        ) =>
                                            setCreateForm({
                                                ...createForm,
                                                role: value,
                                            })
                                        }
                                    >
                                        <SelectTrigger id="create-role">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">
                                                <div className="flex items-center gap-2">
                                                    <ShieldCheck className="w-4 h-4" />
                                                    Administrador
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="vendedor">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4" />
                                                    Cajero/Vendedor
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Button type="submit" className="w-full">
                                    Crear Usuario
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Tabla de Usuarios */}
                <Card>
                    <CardHeader>
                        <CardTitle>Lista de Usuarios</CardTitle>
                        <CardDescription>
                            {users.length} usuario
                            {users.length !== 1 ? "s" : ""} registrado
                            {users.length !== 1 ? "s" : ""}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Correo</TableHead>
                                    <TableHead>Rol</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="text-right">
                                        Acciones
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="text-center text-muted-foreground"
                                        >
                                            No hay usuarios registrados
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">
                                                {user.name}
                                            </TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                {user.role === "admin" ? (
                                                    <Badge className="bg-purple-500">
                                                        <ShieldCheck className="w-3 h-3 mr-1" />
                                                        Administrador
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary">
                                                        <User className="w-3 h-3 mr-1" />
                                                        Cajero
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {user.active ? (
                                                    <Badge className="bg-green-500">
                                                        Activo
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="destructive">
                                                        Inactivo
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            openEditDialog(user)
                                                        }
                                                        title="Editar usuario"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>

                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            openPasswordDialog(
                                                                user
                                                            )
                                                        }
                                                        title="Cambiar contraseña"
                                                    >
                                                        <Key className="w-4 h-4" />
                                                    </Button>

                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            openPermissionsDialog(
                                                                user
                                                            )
                                                        }
                                                        title="Gestionar permisos"
                                                    >
                                                        <Shield className="w-4 h-4 text-blue-500" />
                                                    </Button>

                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            handleToggleActive(
                                                                user
                                                            )
                                                        }
                                                        title={
                                                            user.active
                                                                ? "Desactivar"
                                                                : "Activar"
                                                        }
                                                    >
                                                        <Power
                                                            className={`w-4 h-4 ${
                                                                user.active
                                                                    ? "text-green-500"
                                                                    : "text-gray-400"
                                                            }`}
                                                        />
                                                    </Button>

                                                    <AlertDialog>
                                                        <AlertDialogTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                title="Eliminar usuario"
                                                            >
                                                                <Trash2 className="w-4 h-4 text-destructive" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>
                                                                    ¿Eliminar
                                                                    usuario?
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Esta acción
                                                                    eliminará a{" "}
                                                                    <strong>
                                                                        {
                                                                            user.name
                                                                        }
                                                                    </strong>{" "}
                                                                    del sistema.
                                                                    Esta acción
                                                                    no se puede
                                                                    deshacer.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>
                                                                    Cancelar
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() =>
                                                                        handleDeleteUser(
                                                                            user.id
                                                                        )
                                                                    }
                                                                    className="bg-destructive hover:bg-destructive/90"
                                                                >
                                                                    Eliminar
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Dialog Editar Usuario */}
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Editar Usuario</DialogTitle>
                            <DialogDescription>
                                Modifica la información del usuario
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleEditUser} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">
                                    Nombre Completo
                                </Label>
                                <Input
                                    id="edit-name"
                                    value={editForm.name}
                                    onChange={(e) =>
                                        setEditForm({
                                            ...editForm,
                                            name: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-email">
                                    Correo Electrónico
                                </Label>
                                <Input
                                    id="edit-email"
                                    type="email"
                                    value={editForm.email}
                                    onChange={(e) =>
                                        setEditForm({
                                            ...editForm,
                                            email: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-role">Rol</Label>
                                <Select
                                    value={editForm.role}
                                    onValueChange={(
                                        value: "admin" | "vendedor"
                                    ) =>
                                        setEditForm({
                                            ...editForm,
                                            role: value,
                                        })
                                    }
                                >
                                    <SelectTrigger id="edit-role">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">
                                            <div className="flex items-center gap-2">
                                                <ShieldCheck className="w-4 h-4" />
                                                Administrador
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="vendedor">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4" />
                                                Cajero/Vendedor
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button type="submit" className="w-full">
                                Guardar Cambios
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Dialog Cambiar Contraseña */}
                <Dialog open={isPasswordOpen} onOpenChange={setIsPasswordOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Cambiar Contraseña</DialogTitle>
                            <DialogDescription>
                                Establece una nueva contraseña para{" "}
                                {selectedUser?.name}
                            </DialogDescription>
                        </DialogHeader>
                        <form
                            onSubmit={handleUpdatePassword}
                            className="space-y-4"
                        >
                            <div className="space-y-2">
                                <Label htmlFor="new-password">
                                    Nueva Contraseña
                                </Label>
                                <Input
                                    id="new-password"
                                    type="password"
                                    value={passwordForm.password}
                                    onChange={(e) =>
                                        setPasswordForm({
                                            ...passwordForm,
                                            password: e.target.value,
                                        })
                                    }
                                    placeholder="Mínimo 6 caracteres"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">
                                    Confirmar Contraseña
                                </Label>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    value={passwordForm.password_confirmation}
                                    onChange={(e) =>
                                        setPasswordForm({
                                            ...passwordForm,
                                            password_confirmation:
                                                e.target.value,
                                        })
                                    }
                                    placeholder="Repite la contraseña"
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full">
                                Actualizar Contraseña
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Dialog Gestionar Permisos */}
                <Dialog
                    open={isPermissionsOpen}
                    onOpenChange={setIsPermissionsOpen}
                >
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>
                                <div className="flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-blue-500" />
                                    Gestionar Permisos
                                </div>
                            </DialogTitle>
                            <DialogDescription>
                                Selecciona las secciones a las que{" "}
                                {selectedUser?.name} puede acceder
                            </DialogDescription>
                        </DialogHeader>
                        <form
                            onSubmit={handleUpdatePermissions}
                            className="space-y-4"
                        >
                            <div className="space-y-3">
                                <Label>Permisos de Acceso</Label>
                                <div className="space-y-2 bg-muted p-4 rounded-lg">
                                    {availablePermissions.map((permission) => (
                                        <div
                                            key={permission.value}
                                            className="flex items-center space-x-2"
                                        >
                                            <input
                                                type="checkbox"
                                                id={`permission-${permission.value}`}
                                                checked={permissionsForm.includes(
                                                    permission.value
                                                )}
                                                onChange={() =>
                                                    togglePermission(
                                                        permission.value
                                                    )
                                                }
                                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <label
                                                htmlFor={`permission-${permission.value}`}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                            >
                                                {permission.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Los administradores tienen acceso completo
                                    por defecto. Estos permisos solo afectan a
                                    usuarios con rol de Cajero/Vendedor.
                                </p>
                            </div>

                            <Button type="submit" className="w-full">
                                Guardar Permisos
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </MainLayout>
    );
}
