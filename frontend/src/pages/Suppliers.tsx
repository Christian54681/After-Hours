import { useState, useEffect } from "react";
import { Plus, Truck, Pencil, Trash2, ChevronDown, ChevronUp, Clock, User, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { MobileNav } from "@/components/admin/MobileNav";
import { OrderModal } from "@/components/admin/OrderModal";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { OrderHistory } from "@/components/admin/OrderHistory";

interface Supplier {
    _id?: string;
    idProvedor: number;
    empresa: string;
    contacto: string;
    tiempoEntregaDias: number;
    estado: string;
}

const emptyForm = { empresa: "", contacto: "", tiempoEntregaDias: "1", idProvedor: "" };
const urlbase = "http://localhost:3000/api";

const Suppliers = () => {
    const { user } = useAuth();
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [orderModalOpen, setOrderModalOpen] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
    const [editing, setEditing] = useState<Supplier | null>(null);
    const [form, setForm] = useState(emptyForm);

    // DETERMINAR ROL
    const isAdminGeneral = user?.tipoRol === "AdminGeneral";

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

    const openOrder = (s: Supplier) => {
        setSelectedSupplier(s);
        setOrderModalOpen(true);
    };

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
            }
        } catch (error) {
            toast.error("Error de red");
        }
    };

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
                                {suppliers.length} Registros | Rol: {user?.tipoRol}
                            </p>
                        </div>
                        {/* SOLO ADMIN GENERAL PUEDE CREAR */}
                        {isAdminGeneral && (
                            <Button onClick={openNew} className="gold-glow hover:scale-[1.02] transition-transform">
                                <Plus className="w-4 h-4 mr-2" /> Nuevo Proveedor
                            </Button>
                        )}
                    </div>

                    {loading ? (
                        <div className="flex justify-center p-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
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
                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => openOrder(s)}
                                                className="border-primary/30 hover:bg-primary hover:text-black text-[10px] uppercase font-bold h-8"
                                            >
                                                <ShoppingCart className="w-3 h-3 mr-1" /> Pedir
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setExpanded(expanded === s._id ? null : s._id!)}
                                                className="text-muted-foreground"
                                            >
                                                {expanded === s._id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                            </Button>
                                        </div>
                                    </div>

                                    {expanded === s._id && (
                                        <div className="mt-4 pt-4 border-t border-border/50 animate-in fade-in slide-in-from-top-2">
                                            <p className="text-sm ml-2">Contacto: <span className="text-foreground font-medium">{s.contacto}</span></p>

                                            {/* SOLO ADMIN GENERAL VE LOS BOTONES DE CRUD */}
                                            {isAdminGeneral && (
                                                <div className="flex gap-2 pt-5">
                                                    <Button variant="outline" size="sm" onClick={() => toggleStatus(s)} className="h-7 text-[9px] uppercase font-bold">
                                                        {s.estado === "Activo" ? "Inhabilitar" : "Reactivar"}
                                                    </Button>
                                                    <Button variant="secondary" size="sm" onClick={() => openEdit(s)} className="h-7 text-[9px] uppercase font-bold">
                                                        <Pencil className="w-3 h-3 mr-1" /> Editar
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => remove(s._id!)} className="h-7 text-[9px] uppercase font-bold text-red-500">
                                                        <Trash2 className="w-3 h-3 mr-1" /> Borrar
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                    <OrderHistory user={user} />
                </div>
            </main>

            {/* MODAL DE EDICIÓN/CREACIÓN (ADMIN) */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="bg-card border-border sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="text-foreground font-display text-xl">
                            {editing ? "Actualizar Proveedor" : "Registro de Proveedor"}
                        </DialogTitle>
                    </DialogHeader>
                    {/* ... Resto del formulario que ya tenías ... */}
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-4 gap-4">
                            <div className="col-span-1 space-y-2">
                                <Label className="text-[10px] uppercase text-muted-foreground font-bold">ID Int</Label>
                                <Input type="number" value={form.idProvedor} onChange={(e) => setForm({ ...form, idProvedor: e.target.value })} className="bg-muted/30 border-border" />
                            </div>
                            <div className="col-span-3 space-y-2">
                                <Label className="text-[10px] uppercase text-muted-foreground font-bold">Nombre de Empresa</Label>
                                <Input value={form.empresa} onChange={(e) => setForm({ ...form, empresa: e.target.value })} placeholder="Ej: Cervecería Modelo" className="bg-muted/30 border-border" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase text-muted-foreground font-bold">Información de Contacto</Label>
                            <Input value={form.contacto} onChange={(e) => setForm({ ...form, contacto: e.target.value })} placeholder="Nombre, Teléfono o Email" className="bg-muted/30 border-border" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase text-muted-foreground font-bold">Tiempo de Entrega (Días)</Label>
                            <Input type="number" value={form.tiempoEntregaDias} onChange={(e) => setForm({ ...form, tiempoEntregaDias: e.target.value })} className="bg-muted/30 border-border" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                        <Button onClick={save} className="gold-glow">{editing ? "Guardar" : "Registrar"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* MODAL DE PEDIDOS (GENERAL Y SUCURSAL) */}
            {selectedSupplier && (
                <OrderModal
                    isOpen={orderModalOpen}
                    onClose={() => setOrderModalOpen(false)}
                    supplier={selectedSupplier}
                    user={user} // Pasamos la instancia completa del usuario
                />
            )}
        </div>
    );
};

export default Suppliers;