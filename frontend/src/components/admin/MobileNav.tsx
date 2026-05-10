import { Building2, Users, CalendarClock, Truck, LayoutGrid, Armchair, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const items = [
    { to: "/admin", label: "Sucursales", icon: Building2, roles: ["AdminGeneral"] },
    { to: "/admin/empleados", label: "Empleados", icon: Users, roles: ["AdminGeneral", "AdminSucursal"] },
    { to: "/admin/turnos", label: "Turnos", icon: CalendarClock, roles: ["AdminSucursal"] },
    { to: "/admin/proveedores", label: "Proveedores", icon: Truck, roles: ["AdminGeneral"] },
    { to: "/admin/secciones", label: "Secciones", icon: LayoutGrid, roles: ["AdminSucursal"] },
    { to: "/admin/mesas", label: "Mesas", icon: Armchair, roles: ["AdminSucursal"] },
];

export const MobileNav = () => {
    const { pathname } = useLocation();
    const { user, logout } = useAuth();
    return (
        <div className="grid grid-cols-2 gap-2 mb-6 md:hidden">
            {items
                .filter(item => item.roles.includes(user?.tipoRol))
                .map(({ to, label, icon: Icon }) => (
                    <Link key={to} to={to} className="w-full">
                        <Button variant={pathname === to ? "default" : "secondary"} className="w-full">
                            <Icon className="w-4 h-4 mr-2" /> {label}
                        </Button>
                    </Link>
                ))}
            {/* Botón cerrar sesión */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border md:hidden z-50">
                <Button
                    variant="ghost"
                    onClick={logout}
                    className="w-full justify-center text-muted-foreground hover:text-foreground"
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                </Button>
            </div>
        </div>
    );
};
