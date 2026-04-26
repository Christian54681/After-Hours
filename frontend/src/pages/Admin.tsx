import { useState, useEffect } from "react";
import { Building2, Plus, MapPin, UserCircle, Pencil, Trash2, ChevronDown, ChevronUp, Loader2, Martini } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { MobileNav } from "@/components/admin/MobileNav";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner"; // O la librería de notificaciones que uses

// Ajustamos el estado inicial para que coincida con el backend
const emptyBranch = { idSucursal: "", nombre: "", tipoBar: "", direccion: "" };
const categories = ["Universitario", "Ejecutivo", "Playa", "Tradicional"];
const urlbase = "http://localhost:3000/api";

const Admin = () => {
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedBranch, setExpandedBranch] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState(emptyBranch);

  // 1. CARGA DE DATOS REALES
  const fetchBranches = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${urlbase}/admin/branches`);
      const data = await response.json();
      if (response.ok) {
        setBranches(data);
      } else {
        toast.error("Error al cargar sucursales");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm(emptyBranch);
    setDialogOpen(true);
  };

  // 2. GUARDAR (POST) - Aquí conectamos con tu route.ts de Branches
  const save = async () => {
    if (!form.nombre.trim() || !form.idSucursal.trim()) {
      toast.error("El ID y el Nombre son obligatorios");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${urlbase}/admin/branches`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(editing ? "Sucursal actualizada" : "Sucursal creada");
        setDialogOpen(false);
        fetchBranches(); // Recargamos la lista
      } else {
        toast.error(data.error || "Error al guardar");
      }
    } catch (error) {
      toast.error("Error de conexión");
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />

      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <MobileNav />

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-display font-bold text-gradient-gold">Sucursales</h1>
            <Button onClick={openNew} className="gold-glow hover:scale-[1.02] transition-transform">
              <Plus className="w-4 h-4 mr-2" /> Nueva Sucursal
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid gap-4">
              {branches.map((b) => (
                <div key={b._id} className="glass-card p-5 space-y-3 hover:border-primary/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{b.nombre}</h3>
                        <div className="flex gap-2 items-center">
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">ID: {b.idSucursal}</span>
                          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">{b.tipoBar}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setExpandedBranch(expandedBranch === b._id ? null : b._id)}
                      className="text-muted-foreground hover:text-primary">
                      {expandedBranch === b._id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      <span className="ml-1 text-xs">Infraestructura</span>
                    </Button>
                  </div>

                  {expandedBranch === b._id && (
                    <div className="pt-3 border-t border-border space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary/70" />
                            {b.direccion || "Sin dirección"}
                          </div>
                          <div className="flex items-center gap-2">
                            <UserCircle className="w-4 h-4 text-primary/70" />
                            {b.encargado || "Sin encargado"}
                          </div>
                          <div className="flex items-center gap-2">
                            <Martini className="w-4 h-4 text-primary/70" />
                            {b.tipoBar || "Sin tipo de bar"}
                          </div>
                        </div>
                      </div>

                      {/* MOSTRAR SECCIONES REALES TRAÍDAS POR EL LOOKUP */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-bold text-foreground/80 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Secciones y Mesas
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {b.secciones && b.secciones.length > 0 ? (
                            b.secciones.map((sec: any) => (
                              <div key={sec._id} className="bg-muted/30 p-3 rounded-lg border border-border/50">
                                <p className="text-xs font-bold text-primary mb-2 uppercase">{sec.nombre}</p>
                                <div className="flex flex-wrap gap-1">
                                  {sec.mesasCompletas?.map((mesa: any) => (
                                    <span key={mesa._id} className="text-[10px] bg-background border border-border px-2 py-1 rounded">
                                      Mesa {mesa.numeroMesa} ({mesa.capacidad}p)
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-muted-foreground italic">Sin secciones configuradas</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* DIALOGO DE CREACIÓN */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground font-display">Nueva Sucursal</DialogTitle>
            <DialogDescription className="text-muted-foreground">Crea la base de la sucursal. Luego podrás añadir secciones.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground">ID Sucursal</Label>
                <Input value={form.idSucursal} onChange={(e) => setForm((f) => ({ ...f, idSucursal: e.target.value }))}
                  placeholder="SUC-01" className="bg-muted/50 border-border" />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Nombre</Label>
                <Input value={form.nombre} onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                  placeholder="Lounge Noir" className="bg-muted/50 border-border" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Categoría (Tipo)</Label>
              <Select value={form.tipoBar} onValueChange={(val) => setForm((f) => ({ ...f, tipoBar: val }))}>
                <SelectTrigger className="bg-muted/50 border-border"><SelectValue placeholder="Selecciona" /></SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {categories.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Dirección</Label>
              <Input value={form.direccion} onChange={(e) => setForm((f) => ({ ...f, direccion: e.target.value }))}
                placeholder="Av. Reforma..." className="bg-muted/50 border-border" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={save} className="gold-glow">Crear Sucursal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;