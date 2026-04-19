import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Wine, Mail, Lock, User } from "lucide-react";
import barBg from "@/assets/bar-bg.jpg";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdult, setIsAdult] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <img src={barBg} alt="" className="absolute inset-0 w-full h-full object-cover" width={1920} height={1080} />
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="glass-card p-8 space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/30 gold-glow">
              <Wine className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-gradient-gold font-display">Crear Cuenta</h1>
            <p className="text-muted-foreground text-sm">Únete a nuestra comunidad exclusiva</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground/80">Nombre completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="name" placeholder="Tu nombre" value={name} onChange={(e) => setName(e.target.value)}
                  className="pl-10 bg-muted/50 border-border focus:border-primary focus:ring-primary/30" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-email" className="text-foreground/80">Correo electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="reg-email" type="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-muted/50 border-border focus:border-primary focus:ring-primary/30" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-password" className="text-foreground/80">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="reg-password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-muted/50 border-border focus:border-primary focus:ring-primary/30" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Checkbox id="adult" checked={isAdult} onCheckedChange={(v) => setIsAdult(v === true)}
                className="border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
              <Label htmlFor="adult" className="text-sm text-foreground/80 cursor-pointer">Soy mayor de edad</Label>
            </div>

            <Button type="submit" disabled={!isAdult} className="w-full gold-glow hover:scale-[1.02] transition-transform" size="lg">
              Registrarse
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{" "}
            <Link to="/" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
