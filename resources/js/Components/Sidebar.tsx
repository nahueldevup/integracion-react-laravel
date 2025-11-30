import { 
    Home, LayoutGrid, Package, ShoppingCart, Wallet, 
    FileText, Users, Settings, Plus, LogOut, ChevronDown,
    PieChart, History, AlertTriangle, Calendar
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

// Definición de ítems del menú principal
const menuItems = [
  { title: "Inicio", icon: Home, path: "/" },
  { title: "Vender", icon: ShoppingCart, path: "/vender" },
  { title: "Productos", icon: Package, path: "/productos" },
  { title: "Clientes", icon: Users, path: "/clientes" },
  { title: "Caja", icon: Wallet, path: "/caja" },
  // Reportes tiene lógica especial, lo manejaremos aparte en el render o con un flag
  { title: "Reportes", icon: FileText, path: "/reportes", isCollapsible: true },
  { title: "Más", icon: Plus, path: "#", hasOtherSubmenu: true },
];

// Submenú de Reportes
const reportesSubmenu = [
  { title: "Dashboard", path: "/reportes", icon: PieChart },
  { title: "Historial Ventas", path: "/reportes/ventas-contado", icon: History },
  { title: "Baja Existencia", path: "/reportes/baja-existencia", icon: AlertTriangle },
];

// Submenú "Más"
const otherSubmenu = [
  { title: "Usuarios", icon: Users, path: "/usuarios" },
  { title: "Ajustes", icon: Settings, path: "/ajustes" },
  { title: "Salir", icon: LogOut, path: "/logout" },
];

export function Sidebar() {
  const { url } = usePage();
  const { isOpen, toggleSidebar } = useSidebarContext();
  const isMobile = useIsMobile();
  
  // Estado para el menú "Más"
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  
  // Estado para el menú "Reportes" (Collapsible)
  // Se abre automáticamente si la URL actual empieza con /reportes
  const [isReportsOpen, setIsReportsOpen] = useState(url.startsWith('/reportes'));

  // Efecto para abrir reportes si navegamos ahí
  useEffect(() => {
    if (url.startsWith('/reportes')) setIsReportsOpen(true);
  }, [url]);

  const toggleSubmenuFn = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title);
  };

  const SidebarContent = () => (
    <>
      <div className="p-4 border-b border-border h-[60px] flex items-center">
        <h1 className={cn(
          "text-lg font-bold text-primary transition-opacity duration-300",
          !isOpen && !isMobile && "opacity-0"
        )}>
          {(isOpen || isMobile) && "Mi POS"}
        </h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4 space-y-1">
        {menuItems.map((item) => {
            
          // CASO 1: Ítem "Reportes" (Collapsible)
          if (item.isCollapsible) {
            return (
                <Collapsible 
                    key={item.title} 
                    open={isOpen && isReportsOpen} // Solo abrir si el sidebar está expandido
                    onOpenChange={setIsReportsOpen}
                    className="w-full"
                >
                    <CollapsibleTrigger asChild>
                        <button
                            onClick={() => !isOpen && !isMobile && toggleSidebar()} // Abrir sidebar si está colapsado al hacer clic
                            className={cn(
                                "w-full flex items-center justify-between px-4 py-3 text-sm transition-colors",
                                url.startsWith('/reportes') 
                                    ? "text-primary bg-muted font-medium border-r-2 border-primary" 
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className="w-5 h-5" />
                                {(isOpen || isMobile) && <span>{item.title}</span>}
                            </div>
                            {(isOpen || isMobile) && (
                                <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", isReportsOpen ? "rotate-180" : "")} />
                            )}
                        </button>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent className="space-y-1 animate-in slide-in-from-top-2">
                        {reportesSubmenu.map((subItem) => (
                            <Link
                                key={subItem.path}
                                href={subItem.path}
                                className={cn(
                                    "flex items-center gap-3 py-2 text-sm transition-colors rounded-r-full mr-2",
                                    (isOpen || isMobile) ? "pl-12 pr-4" : "justify-center px-2", // Ajuste de padding si está cerrado
                                    url === subItem.path 
                                        ? "text-primary bg-primary/10 font-medium" 
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                )}
                            >
                                {(isOpen || isMobile) && (
                                    <>
                                        {/* Icono pequeño opcional para subitems */}
                                        {subItem.icon && <subItem.icon className="w-4 h-4 opacity-70"/>} 
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
                      if (!isOpen && !isMobile) toggleSidebar();
                      toggleSubmenuFn(item.title);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                    openSubmenu === item.title && "text-primary bg-muted font-medium"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {(isOpen || isMobile) && <span>{item.title}</span>}
                </button>
                {openSubmenu === item.title && (isOpen || isMobile) && (
                  <div className="ml-8 mt-1 space-y-1 border-l pl-2">
                    {otherSubmenu.map((subItem) => (
                      subItem.title === "Salir" ? (
                        <Link
                          key={subItem.title}
                          href="/logout"
                          method="post"
                          as="button"
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors rounded-sm"
                        >
                          <subItem.icon className="w-4 h-4" />
                          <span>{subItem.title}</span>
                        </Link>
                      ) : (
                        <Link
                          key={subItem.title}
                          href={subItem.path}
                          className={cn(
                            "flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors rounded-sm",
                            url === subItem.path && "text-primary font-medium"
                          )}
                        >
                          <subItem.icon className="w-4 h-4" />
                          <span>{subItem.title}</span>
                        </Link>
                      )
                    ))}
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
    <aside className={cn(
      "bg-card border-r border-border h-screen sticky top-0 flex flex-col transition-all duration-300 z-30",
      isOpen ? "w-64" : "w-16"
    )}>
      <SidebarContent />
    </aside>
  );
}