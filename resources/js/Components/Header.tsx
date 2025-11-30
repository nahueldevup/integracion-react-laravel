import { Menu, User } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { router } from "@inertiajs/react";
import { useSidebarContext } from "@/Contexts/SidebarContext";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { toggleSidebar } = useSidebarContext();

  return (
    <header className="bg-card border-b border-border sticky top-0 z-10">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              {title} {subtitle && <span className="text-muted-foreground">- {subtitle}</span>}
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-sm text-foreground">Hola, parzibyte</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full"
            onClick={() => router.visit("/perfil")}
          >
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}