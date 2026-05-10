import { useState, useEffect } from "react";
import { Plus, Truck, Pencil, Trash2, ChevronDown, ChevronUp, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { MobileNav } from "@/components/admin/MobileNav";
import { toast } from "sonner";

interface Supplier {
    _id?: string;
    idProvedor: number;
    empresa: string;
    contacto: string;
    tiempoEntregaDias: number;
    estado: string; // "Activo" o "Inactivo"
}

const emptyForm = { empresa: "", contacto: "", tiempoEntregaDias: "1", idProvedor: "" };
const urlbase = "http://localhost:3000/api";

const Suppliers = () => {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<Supplier | null>(null);
    const [form, setForm] = useState(emptyForm);

    // CARGAR DATOS
    const fetchSuppliers = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${urlbase}/admin/providers`);
            const data = await res.json();
            if (res.ok) setSuppliers(data);
        } catch (error) {
            toast.error("Error al conectar con el servidor");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    // LÓGICA DE DIÁLOGOS
    const openNew = () => {
        setEditing(null);
        setForm({ ...emptyForm, idProvedor: (suppliers.length + 1).toString() });
        setDialogOpen(true);
    };

    const openEdit = (s: Supplier) => {
        setEditing(s);
        setForm({
            empresa: s.empresa,
            contacto: s.contacto,
            tiempoEntregaDias: s.tiempoEntregaDias.toString(),
            idProvedor: s.idProvedor.toString()
        });
        setDialogOpen(true);
    };

    // GUARDAR (CREATE / UPDATE)
    const save = async () => {
        if (!form.empresa.trim() || !form.contacto.trim()) {
            toast.error("Empresa y contacto son obligatorios");
            return;
        }

        const method = editing ? "PUT" : "POST";
        const url = editing ? `${urlbase}/admin/providers/${editing._id}` : `${urlbase}/admin/providers`;

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    idProvedor: Number(form.idProvedor),
                    tiempoEntregaDias: Number(form.tiempoEntregaDias),
                    estado: editing ? editing.estado : "Activo"
                }),
            });

            if (res.ok) {
                toast.success(editing ? "Proveedor actualizado" : "Proveedor creado");
                setDialogOpen(false);
                fetchSuppliers();
            } else {
                const err = await res.json();
                toast.error(err.error || "Error en la operación");
            }
        } catch (error) {
            toast.error("Error de red");
        }
    };

    // ELIMINAR
    const remove = async (id: string) => {
        if (!confirm("¿Estás seguro de eliminar este proveedor?")) return;
        try {
            const res = await fetch(`${urlbase}/admin/providers/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Proveedor eliminado");
                fetchSuppliers();
            }
        } catch (error) {
            toast.error("No se pudo eliminar");
        }
    };

    // CAMBIAR ESTADO
    const toggleStatus = async (s: Supplier) => {
        const nuevoEstado = s.estado === "Activo" ? "Inactivo" : "Activo";
        try {
            const res = await fetch(`${urlbase}/admin/providers/${s._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ estado: nuevoEstado }),
            });
            if (res.ok) {
                toast.success(`Proveedor ${nuevoEstado}`);
                fetchSuppliers();
            }
        } catch (error) {
            toast.error("Error al cambiar estado");
        }
    };

    return (
        <div className="min-h-screen bg-background flex">
            <AdminSidebar />
            <main className="flex-1 p-4 md:p-8 overflow-auto">
                <MobileNav />

                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-display font-bold text-gradient-gold">Proveedores</h1>
                            <p className="text-xs font-mono text-muted-foreground mt-1 uppercase tracking-widest">
                                {suppliers.length} Registros
                            </p>
                        </div>
                        <Button onClick={openNew} className="gold-glow hover:scale-[1.02] transition-transform">
                            <Plus className="w-4 h-4 mr-2" /> Nuevo Proveedor
                        </Button>
                    </div>

                    {loading ? (
                        <div className="flex justify-center p-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
                    ) : suppliers.length === 0 ? (
                        <div className="glass-card p-10 text-center text-muted-foreground">No hay proveedores.</div>
                    ) : (
                        <div className="grid gap-4">
                            {suppliers.map((s) => (
                                <div key={s._id} className="glass-card p-5 border-l-4 border-l-primary/40 hover:border-primary transition-all">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                                                <Truck className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-mono text-primary font-bold">ID-{s.idProvedor}</span>
                                                    <h3 className="text-lg font-semibold text-foreground leading-none">{s.empresa}</h3>
                                                </div>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <Badge className={`${s.estado === "Activo" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"} border-none text-[10px]`}>
                                                        {s.estado}
                                                    </Badge>
                                                    <span className="text-[10px] text-muted-foreground uppercase flex items-center gap-1">
                                                        <Clock className="w-3 h-3" /> Entrega: {s.tiempoEntregaDias} días
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setExpanded(expanded === s._id ? null : s._id!)}
                                            className="text-muted-foreground hover:text-primary"
                                        >
                                            {expanded === s._id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                        </Button>
                                    </div>

                                    {expanded === s._id && (
                                        <div className="mt-4 pt-4 border-t border-border/50 animate-in fade-in slide-in-from-top-2">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-2">
                                                <div className="flex items-center gap-3">
                                                    <User className="w-4 h-4 text-primary/60" />
                                                    <p className="text-sm">Contacto: <span className="text-foreground font-medium">{s.contacto}</span></p>
                                                </div>
                                            </div>

                                            <div className="flex gap-2 pt-5">
                                                <Button variant="outline" size="sm" onClick={() => toggleStatus(s)} className="h-8 text-[10px] uppercase font-bold">
                                                    {s.estado === "Activo" ? "Desactivar" : "Activar"}
                                                </Button>
                                                <Button variant="secondary" size="sm" onClick={() => openEdit(s)} className="h-8 text-[10px] uppercase font-bold bg-muted/50 hover:bg-primary hover:text-black transition-colors">
                                                    <Pencil className="w-3 h-3 mr-1" /> Editar
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => remove(s._id!)} className="h-8 text-[10px] uppercase font-bold text-red-500/60 hover:text-red-500 hover:bg-red-500/10">
                                                    <Trash2 className="w-3 h-3 mr-1" /> Eliminar
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="bg-card border-border sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="text-foreground font-display text-xl">
                            {editing ? "Actualizar Proveedor" : "Registro de Proveedor"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-4 gap-4">
                            <div className="col-span-1 space-y-2">
                                <Label className="text-[10px] uppercase text-muted-foreground font-bold">ID Int</Label>
                                <Input
                                    type="number"
                                    value={form.idProvedor}
                                    onChange={(e) => setForm({ ...form, idProvedor: e.target.value })}
                                    className="bg-muted/30 border-border"
                                />
                            </div>
                            <div className="col-span-3 space-y-2">
                                <Label className="text-[10px] uppercase text-muted-foreground font-bold">Nombre de Empresa</Label>
                                <Input
                                    value={form.empresa}
                                    onChange={(e) => setForm({ ...form, empresa: e.target.value })}
                                    placeholder="Ej: Cervecería Modelo"
                                    className="bg-muted/30 border-border"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase text-muted-foreground font-bold">Información de Contacto</Label>
                            <Input
                                value={form.contacto}
                                onChange={(e) => setForm({ ...form, contacto: e.target.value })}
                                placeholder="Nombre, Teléfono o Email"
                                className="bg-muted/30 border-border"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase text-muted-foreground font-bold">Tiempo de Entrega (Días)</Label>
                            <Input
                                type="number"
                                value={form.tiempoEntregaDias}
                                onChange={(e) => setForm({ ...form, tiempoEntregaDias: e.target.value })}
                                className="bg-muted/30 border-border"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                        <Button onClick={save} className="gold-glow">
                            {editing ? "Guardar Cambios" : "Confirmar Registro"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Suppliers;