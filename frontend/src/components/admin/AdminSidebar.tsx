import {
    Building2,
    Users,
    CalendarClock,
    Truck,
    Wine,
    LogOut,
    Armchair,
    LayoutGrid
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Definimos roles por opción
const navItems = [
    { to: "/admin", label: "Sucursales", icon: Building2, roles: ["gerente_general"] },
    { to: "/admin/empleados", label: "Empleados", icon: Users, roles: ["gerente_general", "gerente_sucursal"] },
    { to: "/admin/turnos", label: "Turnos", icon: CalendarClock, roles: ["gerente_sucursal"] },
    { to: "/admin/proveedores", label: "Proveedores", icon: Truck, roles: ["gerente_general"] },
    { to: "/admin/secciones", label: "Secciones", icon: LayoutGrid, roles: ["gerente_sucursal"] },
    { to: "/admin/mesas", label: "Mesas", icon: Armchair, roles: ["gerente_sucursal"] },
];

export const AdminSidebar = () => {
    const { pathname } = useLocation();

    // Simulación de usuario
    // const userRole = "gerente_sucursal"; 
    const userRole = "gerente_general";

    return (
        <aside className="w-64 border-r border-border bg-card/50 flex-col shrink-0 hidden md:flex">
            <div className="p-6 border-b border-border">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                        <Wine className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xl font-display font-bold text-gradient-gold">
                        BarManager
                    </span>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {navItems
                    .filter(item => item.roles.includes(userRole)) // Filtro por rol
                    .map(({ to, label, icon: Icon }) => {
                        const active = pathname === to;

                        return (
                            <Link
                                key={to}
                                to={to}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                                    active
                                        ? "bg-primary/10 text-primary border border-primary/20"
                                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                {label}
                            </Link>
                        );
                    })}
            </nav>

            <div className="p-4 border-t border-border">
                <Link to="/">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-muted-foreground hover:text-foreground"
                    >
                        <LogOut className="w-4 h-4 mr-2" /> Cerrar Sesión
                    </Button>
                </Link>
            </div>
        </aside>
    );
};