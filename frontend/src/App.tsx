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
import NotFound from "./pages/NotFound.tsx";
// import Bartenders from "./pages/Bartender.tsx";
// import Cajeros from "./pages/Cajero.tsx";
// import Contadores from "./pages/Contador.tsx";
// import Meseros from "./pages/Mesero.tsx";
// import PersonalOperativo from "./pages/PersonalOperativo.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/empleados" element={<Employees />} />
            <Route path="/admin/turnos" element={<Shifts />} />
            <Route path="/admin/proveedores" element={<Suppliers />} />
            <Route path="/admin/mesas" element={<Tables />} />
            <Route path="/empleado" element={<EmployeeDashboard />} />
            {/* <Route path="/bartenders" element={<Bartenders />} />
          <Route path="/cajeros" element={<Cajeros />} />
          <Route path="/contadores" element={<Contadores />} />
          <Route path="/meseros" element={<Meseros />} />
          <Route path="/personalop" element={<PersonalOperativo />} /> */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;