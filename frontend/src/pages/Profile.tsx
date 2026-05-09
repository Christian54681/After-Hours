import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Award, Calendar, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) return null;

    const puntos = user.info?.puntosLealtad || 0;

    return (
        <div className="min-h-screen bg-background pt-24 px-4 pb-12">
            <div className="max-w-xl mx-auto space-y-6">
                <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Regresar al menú
                </Link>

                <Card className="glass-card border-primary/20 overflow-hidden">
                    <div className="h-24 bg-gradient-to-r from-primary/30 to-transparent" />
                    <CardHeader className="relative pt-12">
                        <div className="absolute -top-10 left-8 w-20 h-20 rounded-2xl bg-card border border-border shadow-2xl flex items-center justify-center">
                            <User className="w-10 h-10 text-primary" />
                        </div>
                        <CardTitle className="text-3xl font-display">{user.username}</CardTitle>
                        <p className="text-sm text-primary font-medium tracking-widest uppercase">Cliente Noctura</p>
                    </CardHeader>

                    <CardContent className="space-y-6 pt-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="p-4 rounded-xl bg-muted/20 border border-border flex items-center gap-4">
                                <Mail className="w-5 h-5 text-primary" />
                                <div>
                                    <p className="text-[10px] text-muted-foreground uppercase">Correo Electrónico</p>
                                    <p className="text-sm font-medium">{user.email}</p>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Award className="w-5 h-5 text-primary" />
                                    <div>
                                        <p className="text-[10px] text-primary/70 uppercase">Puntos de Lealtad</p>
                                        <p className="text-sm font-bold">Programa After Hours</p>
                                    </div>
                                </div>
                                <span className="text-3xl font-display text-primary">{puntos}</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border/50">
                            <Button 
                                variant="outline" 
                                className="w-full border-destructive/20 text-destructive hover:bg-destructive/10"
                                onClick={() => { logout(); navigate("/"); }}
                            >
                                Finalizar Sesión
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Profile;