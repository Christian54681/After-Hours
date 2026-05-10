import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
    allowedRoles?: string[];
    requiredType?: "cliente" | "empleado";
}

export const ProtectedRoute = ({ allowedRoles, requiredType }: ProtectedRouteProps) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) return <Navigate to="/login" replace />;

    if (requiredType && user.tipo !== requiredType) {
        return <Navigate to="/" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.tipoRol)) {
        return <Navigate to="/empleado" replace />;
    }

    return <Outlet />;
};