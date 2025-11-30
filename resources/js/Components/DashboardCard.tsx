import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/Components/ui/card"; // Corregido a mayúscula
import { cn } from "@/lib/utils";

interface DashboardCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    iconColor?: string;
    onClick?: () => void;
}

export function DashboardCard({
    title,
    description,
    icon: Icon,
    iconColor = "text-primary",
    onClick,
}: DashboardCardProps) {
    return (
        <Card
            className="cursor-pointer hover:shadow-lg transition-shadow border-border bg-card"
            onClick={onClick}
        >
            <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                <div
                    className={cn(
                        "w-20 h-20 rounded-lg bg-muted flex items-center justify-center",
                        iconColor
                    )}
                >
                    <Icon className="w-10 h-10" />
                </div>
                <h3 className="font-semibold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
}
