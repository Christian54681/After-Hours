import { useState, useEffect } from "react";
import { Building2, Plus, MapPin, UserCircle, Pencil, Trash2, ChevronDown, ChevronUp, Loader2, Martini, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { MobileNav } from "@/components/admin/MobileNav";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const emptyBranch = { idSucursal: "", nombre: "", tipoBar: "", direccion: "" };
const categories = ["Universitario", "Ejecutivo", "Playa", "Tradicional"];
const urlbase = "http://localhost:3000/api";

const Admin = () => {
  const [branches, setBranches] = useState<any[]>([]);
  const [managers, setManagers] = useState<any[]>([]); // Estado para la lista de gerentes
  const [loading, setLoading] = useState(true);
  const [expandedBranch, setExpandedBranch] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [managerDialogOpen, setManagerDialogOpen] = useState(false); // Modal de gerente
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState(emptyBranch);

  // Estado para el proceso de asignación
  const [selectedBranch, setSelectedBranch] = useState<any | null>(null);
  const [newManager, setNewManager] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Cargamos sucursales y empleados (para extraer los gerentes) en paralelo
      const [resBranches, resEmps] = await Promise.all([
        fetch(`${urlbase}/admin/branches`),
        fetch(`${urlbase}/admin/empleados/all`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const dataBranches = await resBranches.json();
      const dataEmps = await resEmps.json();

      if (resBranches.ok) setBranches(dataBranches);

      // Filtramos empleados para obtener solo los que pueden ser gerentes/admins
      if (dataEmps.success) {
        setManagers(dataEmps.data);
      }
    } catch (error) {
      toast.error("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm(emptyBranch);
    setDialogOpen(true);
  };

  const openEdit = (b: any) => {
    setEditing(b);
    setForm({
      idSucursal: b.idSucursal,
      nombre: b.nombre,
      tipoBar: b.tipoBar,
      direccion: b.direccion || ""
    });
    setDialogOpen(true);
  };

  // Abre el modal para asignar gerente
  const openAssignManager = (b: any) => {
    setSelectedBranch(b);
    setNewManager(b.encargado || ""); // Pre-seleccionamos el actual si existe
    setManagerDialogOpen(true);
  };

  const deleteBranch = async (id: string) => {
    if (!confirm("¿Confirma que desea eliminar esta sucursal?")) return;
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${urlbase}/admin/branches/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        toast.success("Sucursal eliminada");
        fetchData();
      }
    } catch (error) {
      toast.error("Error de conexión");
    }
  };

  const save = async () => {
    if (!form.nombre.trim() || !form.idSucursal.trim()) {
      toast.error("El ID y el Nombre son obligatorios");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const url = editing ? `${urlbase}/admin/branches/${editing._id}` : `${urlbase}/admin/branches`;
      const method = editing ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (response.ok) {
        toast.success(editing ? "Sucursal Actualizada" : "Sucursal Creada");
        setDialogOpen(false);
        fetchData();
      }
    } catch (error) {
      toast.error("Error al guardar");
    }
  };

  // Función para actualizar solo el encargado
  const handleUpdateManager = async () => {
    if (!newManager) {
      toast.error("Selecciona un gerente");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${urlbase}/admin/branches/${selectedBranch._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ ...selectedBranch, encargado: newManager }),
      });

      if (response.ok) {
        toast.success("Gerente asignado con éxito");
        setManagerDialogOpen(false);
        fetchData();
      } else {
        toast.error("No se pudo asignar el gerente");
      }
    } catch (error) {
      toast.error("Error de servidor");
    }
  };

  const getManagerName = (id: string) => {
    const manager = managers.find((m) => m._id === id);
    return manager ? manager.empleadoInfo.nombreCompleto : id;
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
              <Plus className="w-4 h-4 mr-2" /> Agregar Sucursal
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
          ) : (
            <div className="grid gap-4">
              {branches.map((b) => (
                <div key={b._id} className="glass-card p-5 hover:border-primary/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{b.nombre}</h3>
                        <div className="flex gap-2 items-center">
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">ID: {b.idSucursal}</span>
                          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full mt-1">{b.tipoBar}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setExpandedBranch(expandedBranch === b._id ? null : b._id)}
                      className="text-muted-foreground hover:text-primary">
                      {expandedBranch === b._id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      <span className="ml-1 text-xs">Detalles</span>
                    </Button>
                  </div>

                  {expandedBranch === b._id && (
                    <div className="mb-1 mt-3 pt-3 border-t border-border space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      <p className="text-sm text-muted-foreground mt-2 ml-3">Dirección: <span className="text-foreground">{b.direccion || "Sin dirección"}</span></p>
                      <p className="text-sm text-muted-foreground ml-3">Gerente Sucursal: <span className="text-foreground">{b.encargado && b.encargado.length === 24 ? getManagerName(b.encargado) : (b.encargado || "No asignado")} </span></p>
                      <p className="text-sm text-muted-foreground ml-3">Tipo de Bar: <span className="text-foreground">{b.tipoBar || "Sin tipo de bar"}</span></p>


                      {/* Botones de Acción */}
                      <div className="flex gap-2 pt-2 ml-2">
                        {/* BOTÓN ASIGNAR GERENTE (NUEVO) */}
                        <Button variant="secondary" size="sm" onClick={() => openAssignManager(b)}
                        >
                          <UserPlus className="w-3 h-3 mr-1" /> Asignar Gerente
                        </Button>

                        <Button variant="secondary" size="sm" onClick={() => openEdit(b)}>
                          <Pencil className="w-3 h-3 mr-1" /> Editar
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => deleteBranch(b._id)}
                          className="text-muted-foreground hover:text-foreground hover:border-muted-foreground">
                          <Trash2 className="w-3 h-3 mr-1" /> Eliminar
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm text-foreground flex items-center gap-2 mt-5">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Secciones y Mesas
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {b.secciones?.map((sec: any) => (
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
                          ))}
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

      {/* DIALOGO DE ASIGNAR GERENTE (NUEVO) */}
      <Dialog open={managerDialogOpen} onOpenChange={setManagerDialogOpen}>
        <DialogContent className="bg-card border-border max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-foreground font-display mb-2">Asignar Gerente</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Selecciona el gerente para la sucursal <span className="text-primary font-bold">{selectedBranch?.nombre}</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Gerentes Disponibles</Label>
              <Select value={newManager} onValueChange={setNewManager}>
                <SelectTrigger className="bg-muted/50 border-border">
                  <SelectValue placeholder="Selecciona un gerente" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {managers
                    .filter((m) => m.empleadoInfo.tipoRol === "AdminSucursal") // Filtra solo gerentes
                    .map((m) => (
                      <SelectItem key={m._id} value={m._id}>
                        {m.empleadoInfo.nombreCompleto} ({m.empleadoInfo.tipoRol})
                      </SelectItem>
                    ))
                  }
                  {/* Opcional: mensaje si no hay gerentes disponibles */}
                  {managers.filter((m) => m.empleadoInfo.tipoRol === "AdminSucursal").length === 0 && (
                    <div className="p-2 text-xs text-muted-foreground text-center">
                      No hay gerentes registrados
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="mt-5">
            <Button variant="outline" onClick={() => setManagerDialogOpen(false)} className="border-border text-muted-foreground">Cancelar</Button>
            <Button onClick={handleUpdateManager} className="gold-glow">Asignar Gerente</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOGO DE CREACIÓN / EDICIÓN (ORIGINAL) */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground font-display">{editing ? "Editar Sucursal" : "Agregar Sucursal"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground">ID Sucursal</Label>
                <Input placeholder="Ej: SUC-001" value={form.idSucursal} onChange={(e) => setForm((f) => ({ ...f, idSucursal: e.target.value }))} className="bg-muted/50 border-border" />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Nombre</Label>
                <Input placeholder="Ej: Bar Borracho" value={form.nombre} onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))} className="bg-muted/50 border-border" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Tipo de Bar</Label>
              <Select value={form.tipoBar} onValueChange={(val) => setForm((f) => ({ ...f, tipoBar: val }))}>
                <SelectTrigger className="bg-muted/50 border-border"><SelectValue placeholder="Seleccione Tipo de Bar" /></SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {categories.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Dirección</Label>
              <Input placeholder="Ej: Av. Insurgentes Sur #123, CDMX" value={form.direccion} onChange={(e) => setForm((f) => ({ ...f, direccion: e.target.value }))} className="bg-muted/50 border-border" />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-border text-muted-foreground">Cancelar</Button>
            <Button onClick={save} className="gold-glow">{editing ? "Guardar Cambios" : "Agregar Sucursal"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;