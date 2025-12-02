import {
    Home,
    LayoutGrid,
    Package,
    ShoppingCart,
    Wallet,
    FileText,
    Users,
    Settings,
    Plus,
    LogOut,
    ChevronDown,
    PieChart,
    History,
    AlertTriangle,
    Calendar,
    Building,
    Printer,
} from "lucide-react";
import { Link, usePage } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useSidebarContext } from "@/Contexts/SidebarContext";
import { Sheet, SheetContent } from "@/Components/ui/sheet";
import { useIsMobile } from "@/Hooks/use-mobile";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/Components/ui/collapsible";

// Definición de ítems del menú principal con sus keys de permisos
const menuItems = [
    { title: "Inicio", icon: Home, path: "/", permissionKey: "inicio" },
    {
        title: "Vender",
        icon: ShoppingCart,
        path: "/vender",
        permissionKey: "vender",
    },
    {
        title: "Productos",
        icon: Package,
        path: "/productos",
        permissionKey: "productos",
    },
    {
        title: "Clientes",
        icon: Users,
        path: "/clientes",
        permissionKey: "clientes",
    },
    { title: "Caja", icon: Wallet, path: "/caja", permissionKey: "caja" },
    {
        title: "Reportes",
        icon: FileText,
        path: "/reportes",
        isCollapsible: true,
        permissionKey: "reportes",
    },
    {
        title: "Configuración",
        icon: Settings,
        path: "/configuracion",
        isCollapsible: true,
        permissionKey: "configuracion",
    },
    { title: "Más", icon: Plus, path: "#", hasOtherSubmenu: true },
];

// Submenú de Reportes
const reportesSubmenu = [
    { title: "Dashboard", path: "/reportes", icon: PieChart },
    {
        title: "Historial Ventas",
        path: "/reportes/ventas-contado",
        icon: History,
    },
    {
        title: "Baja Existencia",
        path: "/reportes/baja-existencia",
        icon: AlertTriangle,
    },
];

// Submenú de Configuración
const configuracionSubmenu = [
    {
        title: "Usuarios y Permisos",
        path: "/configuracion/usuarios",
        icon: Users,
    },
    {
        title: "Datos del Negocio",
        path: "/configuracion/negocio",
        icon: Building,
    },
    {
        title: "Impresoras y Tickets",
        path: "/configuracion/tickets",
        icon: Printer,
    },
];

// Submenú "Más"
const otherSubmenu = [{ title: "Salir", icon: LogOut, path: "/logout" }];

export function Sidebar() {
    const { url, props } = usePage<{
        auth: {
            user: {
                id: number;
                name: string;
                email: string;
                role: string;
                permissions: string[] | null;
            } | null;
        };
    }>();
    const { isOpen, toggleSidebar } = useSidebarContext();
    const isMobile = useIsMobile();

    // Obtener usuario autenticado
    const user = props.auth?.user;

    // Función para verificar si el usuario tiene permiso
    const hasPermission = (permissionKey: string | undefined): boolean => {
        if (!user) return false;
        if (!permissionKey) return true; // Items sin permissionKey siempre visibles (ej: "Más")
        if (user.role === "admin") return true; // Admins tienen acceso completo
        if (!user.permissions || user.permissions.length === 0) return false; // Sin permisos = sin acceso
        return user.permissions.includes(permissionKey); // Verificar permiso específico
    };

    // Filtrar items del menú según permisos
    const filteredMenuItems = menuItems.filter((item) =>
        hasPermission(item.permissionKey)
    );

    // Estado para el menú "Más"
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

    // Estado para el menú "Reportes" (Collapsible)
    // Se abre automáticamente si la URL actual empieza con /reportes
    const [isReportsOpen, setIsReportsOpen] = useState(
        url.startsWith("/reportes")
    );

    // Estado para el menú "Configuración" (Collapsible)
    // Se abre automáticamente si la URL actual empieza con /configuracion
    const [isConfigOpen, setIsConfigOpen] = useState(
        url.startsWith("/configuracion")
    );

    // Efecto para abrir reportes/configuración si navegamos ahí
    useEffect(() => {
        if (url.startsWith("/reportes")) setIsReportsOpen(true);
        if (url.startsWith("/configuracion")) setIsConfigOpen(true);
    }, [url]);

    const toggleSubmenuFn = (title: string) => {
        setOpenSubmenu(openSubmenu === title ? null : title);
    };

    // Función para obtener el submenú y estado según el título
    const getCollapsibleData = (title: string) => {
        switch (title) {
            case "Reportes":
                return {
                    submenu: reportesSubmenu,
                    isOpen: isReportsOpen,
                    setIsOpen: setIsReportsOpen,
                    urlPrefix: "/reportes",
                };
            case "Configuración":
                return {
                    submenu: configuracionSubmenu,
                    isOpen: isConfigOpen,
                    setIsOpen: setIsConfigOpen,
                    urlPrefix: "/configuracion",
                };
            default:
                return null;
        }
    };

    const SidebarContent = () => (
        <>
            <div className="p-4 border-b border-border h-[60px] flex items-center">
                <h1
                    className={cn(
                        "text-lg font-bold text-primary transition-opacity duration-300",
                        !isOpen && !isMobile && "opacity-0"
                    )}
                >
                    {(isOpen || isMobile) && "Mi POS"}
                </h1>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 space-y-1">
                {filteredMenuItems.map((item) => {
                    // CASO 1: Ítem Collapsible (Reportes o Configuración)
                    if (item.isCollapsible) {
                        const collapsibleData = getCollapsibleData(item.title);
                        if (!collapsibleData) return null;

                        const {
                            submenu,
                            isOpen: isSubmenuOpen,
                            setIsOpen,
                            urlPrefix,
                        } = collapsibleData;

                        return (
                            <Collapsible
                                key={item.title}
                                open={isOpen && isSubmenuOpen}
                                onOpenChange={setIsOpen}
                                className="w-full"
                            >
                                <CollapsibleTrigger asChild>
                                    <button
                                        onClick={() =>
                                            !isOpen &&
                                            !isMobile &&
                                            toggleSidebar()
                                        }
                                        className={cn(
                                            "w-full flex items-center justify-between px-4 py-3 text-sm transition-colors",
                                            url.startsWith(urlPrefix)
                                                ? "text-primary bg-muted font-medium border-r-2 border-primary"
                                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon className="w-5 h-5" />
                                            {(isOpen || isMobile) && (
                                                <span>{item.title}</span>
                                            )}
                                        </div>
                                        {(isOpen || isMobile) && (
                                            <ChevronDown
                                                className={cn(
                                                    "w-4 h-4 transition-transform duration-200",
                                                    isSubmenuOpen
                                                        ? "rotate-180"
                                                        : ""
                                                )}
                                            />
                                        )}
                                    </button>
                                </CollapsibleTrigger>

                                <CollapsibleContent className="space-y-1 animate-in slide-in-from-top-2">
                                    {submenu.map((subItem) => (
                                        <Link
                                            key={subItem.path}
                                            href={subItem.path}
                                            className={cn(
                                                "flex items-center gap-3 py-2 text-sm transition-colors rounded-r-full mr-2",
                                                isOpen || isMobile
                                                    ? "pl-12 pr-4"
                                                    : "justify-center px-2",
                                                url === subItem.path
                                                    ? "text-primary bg-primary/10 font-medium"
                                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                            )}
                                        >
                                            {(isOpen || isMobile) && (
                                                <>
                                                    {subItem.icon && (
                                                        <subItem.icon className="w-4 h-4 opacity-70" />
                                                    )}
                                                    <span>{subItem.title}</span>
                                                </>
                                            )}
                                        </Link>
                                    ))}
                                </CollapsibleContent>
                            </Collapsible>
                        );
                    }

                    // CASO 2: Ítem "Más" (Tu lógica original manual)
                    if (item.hasOtherSubmenu) {
                        return (
                            <div key={item.title}>
                                <button
                                    onClick={() => {
                                        if (!isOpen && !isMobile)
                                            toggleSidebar();
                                        toggleSubmenuFn(item.title);
                                    }}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                                        openSubmenu === item.title &&
                                            "text-primary bg-muted font-medium"
                                    )}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {(isOpen || isMobile) && (
                                        <span>{item.title}</span>
                                    )}
                                </button>
                                {openSubmenu === item.title &&
                                    (isOpen || isMobile) && (
                                        <div className="ml-8 mt-1 space-y-1 border-l pl-2">
                                            {otherSubmenu.map((subItem) =>
                                                subItem.title === "Salir" ? (
                                                    <Link
                                                        key={subItem.title}
                                                        href="/logout"
                                                        method="post"
                                                        as="button"
                                                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors rounded-sm"
                                                    >
                                                        <subItem.icon className="w-4 h-4" />
                                                        <span>
                                                            {subItem.title}
                                                        </span>
                                                    </Link>
                                                ) : (
                                                    <Link
                                                        key={subItem.title}
                                                        href={subItem.path}
                                                        className={cn(
                                                            "flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors rounded-sm",
                                                            url ===
                                                                subItem.path &&
                                                                "text-primary font-medium"
                                                        )}
                                                    >
                                                        <subItem.icon className="w-4 h-4" />
                                                        <span>
                                                            {subItem.title}
                                                        </span>
                                                    </Link>
                                                )
                                            )}
                                        </div>
                                    )}
                            </div>
                        );
                    }

                    // CASO 3: Ítem Normal (Link directo)
                    return (
                        <Link
                            key={item.title}
                            href={item.path}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 text-sm transition-colors",
                                url === item.path
                                    ? "text-primary bg-muted font-medium border-r-2 border-primary"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            {(isOpen || isMobile) && <span>{item.title}</span>}
                        </Link>
                    );
                })}
            </nav>
        </>
    );

    // Renderizado Condicional (Móvil vs Escritorio)
    if (isMobile) {
        return (
            <Sheet open={isOpen} onOpenChange={toggleSidebar}>
                <SheetContent side="left" className="w-64 p-0 bg-card border-r">
                    <SidebarContent />
                </SheetContent>
            </Sheet>
        );
    }

    return (
        <aside
            className={cn(
                "bg-card border-r border-border h-screen sticky top-0 flex flex-col transition-all duration-300 z-30",
                isOpen ? "w-64" : "w-16"
            )}
        >
            <SidebarContent />
        </aside>
    );
}
