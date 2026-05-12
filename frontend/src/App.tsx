import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/RegisterUser.tsx";
import Admin from "./pages/Admin.tsx";
import Employees from "./pages/Employees.tsx";
import Shifts from "./pages/Shifts.tsx";
import Suppliers from "./pages/Suppliers.tsx";
import Tables from "./pages/Tables.tsx";
import EmployeeDashboard from "./pages/EmployeeDashboard.tsx";
import Sections from "./pages/Sections.tsx";
import NotFound from "./pages/NotFound.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import Meseros from "./pages/Mesero.tsx";
import Profile from './pages/Profile';
import { ProtectedRoute } from "./components/auth/ProtectedRoute.tsx";
import ShowMenu from "./pages/Menu.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />
            <Route path="/menu" element={<ShowMenu />} />
            <Route
              element={
                <ProtectedRoute
                  requiredType="empleado"
                  allowedRoles={["AdminGeneral", "AdminSucursal"]} />}
            >
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/empleados" element={<Employees />} />
              <Route path="/admin/turnos" element={<Shifts />} />
              <Route path="/admin/proveedores" element={<Suppliers />} />
              <Route path="/admin/mesas" element={<Tables />} />
              <Route path="/admin/secciones" element={<Sections />} />
            </Route>

            <Route element={<ProtectedRoute requiredType="empleado" />}>
              <Route path="/empleado" element={<EmployeeDashboard />} />
              <Route path="/empleado/mesero" element={<Meseros />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route path="/perfil" element={<Profile />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;