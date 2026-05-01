import { useState, useEffect, useMemo } from "react";
import { Plus, Pencil, Trash2, Loader2, LayoutGrid, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { MobileNav } from "@/components/admin/MobileNav";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

interface Table {
    _id: string;
    numeroMesa: number | string;
    capacidad: number;
    estado: number;
}

interface Section {
    _id?: string;
    idSeccion: string;
    nombre: string;
    capacidadMax?: number;
    mesasCompletas?: Table[];
}

interface Section {
    _id?: string;
    idSeccion: string;
    nombre: string;
    mesas?: Table[];
    idMesas?: string[];
}

const urlbase = "http://localhost:3000/api";

const Sections = () => {
    const { user } = useAuth();
    const [sections, setSections] = useState<Section[]>([]);
    const [employees, setEmployees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<Section | null>(null);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState<string | null>(null);

    const [form, setForm] = useState({
        idSeccion: "",
        nombre: "",
        capacidadMax: 0,
    });

    // 1. Carga de datos reales
    const fetchData = async () => {
        if (!user?.idSucursalACargo) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('token');

            const resSec = await fetch(`${urlbase}/admin/sections/branch/${user.idSucursalACargo}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!resSec.ok) throw new Error("Error en la carga");

            const dataSec = await resSec.json();
            setSections(dataSec);
            console.log("Secciones cargadas:", dataSec);
        } catch (err) {
            console.error(err);
            toast.error("Error al conectar con el servidor");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user?.idSucursalACargo]);

    const openNew = () => {
        setEditing(null);
        setForm({ idSeccion: "", nombre: "", capacidadMax: 0 });
        setDialogOpen(true);
    };

    const openEdit = (s: Section) => {
        setEditing(s);
        setForm({ idSeccion: s.idSeccion, nombre: s.nombre, capacidadMax: s.capacidadMax || 0 });
        setDialogOpen(true);
    };

    // 2. Guardar (POST / PUT)
    const save = async () => {
        if (!form.idSeccion || !form.nombre) {
            toast.error("Faltan campos obligatorios");
            return;
        }

        try {
            const method = editing ? 'PUT' : 'POST';
            const url = editing
                ? `${urlbase}/admin/sections/${editing._id}`
                : `${urlbase}/admin/sections`;

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    idSeccionManual: form.idSeccion,
                    nombreSeccion: form.nombre,
                    capacidadMax: form.capacidadMax,
                    idSucursal: user?.idSucursalACargo // Para el vínculo en el POST
                })
            });

            if (res.ok) {
                toast.success(editing ? "Sección actualizada" : "Sección creada");
                fetchData();
                setDialogOpen(false);
            } else {
                const err = await res.json();
                toast.error(err.error || "Error al guardar");
            }
        } catch (err) {
            toast.error("Error de conexión");
        }
    };

    // 3. Eliminar (DELETE)
    const deleteSection = async (id: string) => {
        if (!confirm("¿Eliminar esta sección? Las mesas vinculadas podrían quedar huérfanas.")) return;

        try {
            const res = await fetch(`${urlbase}/admin/sections/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });

            if (res.ok) {
                toast.success("Sección eliminada");
                fetchData();
            }
        } catch (err) {
            toast.error("No se pudo eliminar");
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
                            <h1 className="text-2xl md:text-3xl font-display font-bold text-gradient-gold">Gestión de Secciones</h1>
                            <p className="text-muted-foreground text-sm">Organiza las áreas físicas de {user?.idSucursalACargo}</p>
                        </div>
                        <Button onClick={openNew} className="gold-glow hover:scale-[1.02] transition-transform w-full sm:w-auto">
                            <Plus className="w-4 h-4 mr-2" /> Nueva Sección
                        </Button>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
                    ) : (
                        <div className="grid gap-4">
                            {sections.map((s) => (
                                <div key={s._id} className="glass-card p-5 hover:border-primary/30 transition-all duration-300">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                                                <LayoutGrid className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-foreground">{s.nombre}</h3>
                                                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                                                    ID INTERNO: {s.idSeccion}
                                                </span>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setExpanded(expanded === s._id ? null : s._id)}
                                            className="text-muted-foreground hover:text-primary"
                                        >
                                            {expanded === s._id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                            <span className="ml-1 text-xs">{expanded === s._id ? "Cerrar" : "Ver Mesas"}</span>
                                        </Button>
                                    </div>

                                    {expanded === s._id && (
                                        <div className="mt-3 pt-3 border-t border-border space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                            <div className="space-y-2">
                                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                                    Mesas en esta área ({s.mesasCompletas?.length || 0})
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {s.mesasCompletas && s.mesasCompletas.length > 0 ? (
                                                        s.mesasCompletas.map((mesa) => (
                                                            <div key={mesa._id} className="border border-border rounded-md p-2 w-24 text-center">
                                                                <p className="text-sm font-medium">{mesa.numeroMesa}</p>
                                                                <p className="text-xs text-muted-foreground">Capacidad: {mesa.capacidad}</p>
                                                                <p className={`text-xs font-semibold ${mesa.estado === 1 ? 'text-green-500' : mesa.estado === 2 ? 'text-yellow-500' : 'text-red-500'}`}>
                                                                    {mesa.estado === 1 ? 'Libre' : mesa.estado === 2 ? 'Ocupada' : 'Reservada'}
                                                                </p>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p>Sin mesas</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex gap-2 pt-2 border-t border-border/50">
                                                {!isConfirmingDelete || isConfirmingDelete !== s._id ? (
                                                    <>
                                                        <Button variant="secondary" size="sm" onClick={() => openEdit(s)} className="h-8">
                                                            <Pencil className="w-3 h-3 mr-1" /> Editar
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setIsConfirmingDelete(s._id!)}
                                                            className="h-8 text-muted-foreground hover:text-destructive hover:border-destructive transition-colors">
                                                            <Trash2 className="w-3 h-3 mr-1" /> Eliminar
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <div className="flex flex-wrap items-center gap-2 animate-in zoom-in-95 duration-200">
                                                        <span className="block w-full text-[12px] font-bold uppercase tracking-tighter">
                                                            ¿Seguro?
                                                        </span>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => { deleteSection(s._id!); setIsConfirmingDelete(null); }}
                                                            className="h-8 shadow-lg shadow-destructive/20"
                                                        > Sí, eliminar </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => setIsConfirmingDelete(null)}
                                                            className="h-8 text-xs"
                                                        > Cancelar </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {sections.length === 0 && !loading && (
                                <div className="text-center py-20 bg-muted/10 rounded-2xl border border-dashed border-border">
                                    <LayoutGrid className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                                    <p className="text-muted-foreground">No hay secciones registradas en esta sucursal.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="bg-card border-border max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-foreground font-display text-xl">
                            {editing ? "Renombrar Sección" : "Nueva Sección"}
                        </DialogTitle>
                        <DialogDescription>
                            Las secciones ayudan a los meseros a ubicar las mesas rápidamente.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>ID Identificador</Label>
                                <Input
                                    placeholder="Ej: TER-01"
                                    value={form.idSeccion}
                                    onChange={(e) => setForm({ ...form, idSeccion: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Capacidad (Mesas)</Label>
                                <Input
                                    type="number"
                                    placeholder="0"
                                    value={form.capacidadMax}
                                    onChange={(e) => setForm({ ...form, capacidadMax: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Nombre de la Sección</Label>
                            <Input
                                placeholder="Ej: Terraza Principal"
                                value={form.nombre}
                                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                        <Button onClick={save} className="gold-glow">
                            {editing ? "Actualizar" : "Crear Sección"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Sections;