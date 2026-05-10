import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wine, Mail, Lock } from "lucide-react";
import barBg from "@/assets/bar-bg.jpg";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user, data.token);

        toast.success("¡Bienvenido!");
        // Redirige según el rol del usuario
        const userRole = data.user.info.tipoRol;
        if (userRole === "AdminGeneral") {
          navigate("/admin");
        } else if (userRole === "AdminSucursal"){
          navigate("/admin/empleados")
        } else if (data.user.tipo === "empleado") {
          navigate("/empleado");
        } else {
          navigate("/");
        }
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      //console.error("error:", error); 
      toast.error("Error de conexión");
      console.log("Error en el login:", error);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <img
        src={barBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        width={1920}
        height={1080}
      />
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

      {/* Form */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="glass-card p-8 space-y-8">
          {/* Logo */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/30 gold-glow">
              <Wine className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-gradient-gold font-display">BarManager</h1>
            <p className="text-muted-foreground text-sm">Gestión elegante para tu cadena de bares</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground/80">Correo electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-muted/50 border-border focus:border-primary focus:ring-primary/30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground/80">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-muted/50 border-border focus:border-primary focus:ring-primary/30"
                />
              </div>
            </div>

            <Button type="submit" className="w-full gold-glow hover:scale-[1.02] transition-transform" size="lg">
              Iniciar Sesión
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            ¿No tienes cuenta?{" "}
            <Link to="/registro" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
