import { useMemo, useState, useEffect } from "react";
import { Plus, Pencil, Trash2, ChevronDown, ChevronUp, Armchair, } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { MobileNav } from "@/components/admin/MobileNav";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

// TIPOS
interface BarTable {
    _id: string;
    numeroMesa: number;
    capacidad: number;
    estado: number;
    idSeccionDB?: string;
    nombreSeccion?: string;
}

interface Section {
    _id: string;
    nombre: string;
    mesasCompletas?: BarTable[];
}

const STATUS_MAP: Record<number, string> = {
    1: "libre",
    2: "ocupada",
    3: "apartada",
};

const statusBadge: Record<string, { label: string; className: string }> = {
    libre: { label: "Libre", className: "bg-muted/40 text-muted-foreground border-border mt-1" },
    ocupada: { label: "Ocupada", className: "bg-primary/15 text-primary mt-1" },
    apartada: { label: "Apartada", className: "bg-amber-500/15 text-amber-500 mt-1" },
};

const Tables = () => {
    const { user } = useAuth();
    const [tables, setTables] = useState<BarTable[]>([]);
    const [sections, setSections] = useState<Section[]>([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState<string | null>(null);

    // Diálogos y Form de creación
    const [tableDialogOpen, setTableDialogOpen] = useState(false);
    const [editing, setEditing] = useState<BarTable | null>(null);
    const [form, setForm] = useState({ number: "", sectionId: "", capacity: "4" });

    const urlbase = "http://localhost:3000/api";

    // CARGAR DATOS
    const fetchData = async () => {
        if (!user?.idSucursalACargo) return;
        try {
            setLoading(true);
            // Obtenemos las secciones de la sucursal (que ya traen sus mesasCompletas)
            const res = await fetch(`${urlbase}/admin/sections/branch/${user.idSucursalACargo}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();

            setSections(data);

            // Aplanamos las mesas para la vista general
            const allTables: BarTable[] = data.flatMap((s: any) =>
                (s.mesasCompletas || []).map((m: any) => ({
                    ...m,
                    idSeccionDB: s._id,
                    nombreSeccion: s.nombre
                }))
            );
            setTables(allTables);
        } catch (error) {
            toast.error("Error al cargar los datos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user?.idSucursalACargo]);

    // CRUD
    const openNewTable = () => {
        setEditing(null);
        setForm({ number: "", sectionId: "", capacity: "4" });
        setTableDialogOpen(true);
    };

    const saveTable = async () => {
        if (!form.number || !form.sectionId) return toast.error("Faltan datos");

        try {
            const method = editing ? 'PUT' : 'POST';
            const url = editing ? `${urlbase}/admin/tables/${editing._id}` : `${urlbase}/admin/tables`;

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    idSeccionDB: form.sectionId,
                    numeroMesa: parseInt(form.number),
                    capacidad: parseInt(form.capacity),
                    idSucursal: user?.idSucursalACargo
                })
            });

            if (res.ok) {
                toast.success(editing ? "Mesa actualizada" : "Mesa creada");
                setTableDialogOpen(false);
                fetchData();
            }
        } catch (error) {
            toast.error("Error al guardar");
        }
    };

    const removeTable = async (id: string) => {
        try {
            const res = await fetch(`${urlbase}/admin/tables/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) {
                toast.success("Mesa eliminada");
                fetchData();
            }
        } catch (error) {
            toast.error("No se pudo eliminar");
        }
    };

    return (
        <div className="min-h-screen bg-background flex">
            <AdminSidebar />
            <main className="flex-1 p-4 md:p-8 overflow-auto">
                <MobileNav />

                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-display font-bold text-gradient-gold">
                                Gestión de Mesas
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {tables.length} mesas en total en la sucursal
                            </p>
                        </div>
                        <Button onClick={openNewTable} className="gold-glow">
                            <Plus className="w-4 h-4 mr-2" /> Agregar Mesa
                        </Button>
                    </div>

                    {loading ? (
                        <div className="py-20 text-center text-muted-foreground animate-pulse">Cargando mesas...</div>
                    ) : tables.length === 0 ? (
                        <div className="glass-card py-20 text-center text-muted-foreground">
                            No hay mesas registradas en esta sucursal.
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {tables.map((t) => {
                                const statusKey = STATUS_MAP[t.estado] || "libre";
                                const badge = statusBadge[statusKey];
                                const isOpen = expanded === t._id;

                                return (
                                    <div key={t._id} className="glass-card p-5 hover:border-primary/30 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                                                    <Armchair className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-foreground">Mesa {t.numeroMesa}</h3>
                                                    <div className="flex gap-2 items-center">
                                                        <span className="text-[10px] text-muted-foreground uppercase font-bold">
                                                            {t.nombreSeccion}
                                                        </span>
                                                        <Badge className={badge.className}>{badge.label}</Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost" size="sm"
                                                onClick={() => setExpanded(isOpen ? null : t._id)}
                                                className="text-muted-foreground">
                                                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                <span className="ml-1 text-xs">Opciones</span>
                                            </Button>
                                        </div>

                                        {isOpen && (
                                            <div className="mt-3 pt-3 border-t border-border space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                                                <p className="text-sm text-muted-foreground italic">
                                                    Capacidad: <span className="text-foreground">{t.capacidad} personas</span>
                                                </p>

                                                <div className="flex flex-wrap gap-2 pt-2">
                                                    {/* BOTÓN EDITAR */}
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        onClick={() => {
                                                            setEditing(t);
                                                            setForm({
                                                                number: String(t.numeroMesa),
                                                                sectionId: t.idSeccionDB || "",
                                                                capacity: String(t.capacidad)
                                                            });
                                                            setTableDialogOpen(true);
                                                        }}
                                                        className="h-8">
                                                        <Pencil className="w-3 h-3 mr-1" /> Editar
                                                    </Button>

                                                    {/* BOTÓN ELIMINAR*/}
                                                    {!isConfirmingDelete || isConfirmingDelete !== t._id ? (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setIsConfirmingDelete(t._id)}
                                                            className="h-8 text-muted-foreground hover:text-destructive hover:border-destructive transition-colors">
                                                            <Trash2 className="w-3 h-3 mr-1" /> Eliminar
                                                        </Button>
                                                    ) : (
                                                        <div className="flex items-center gap-2 animate-in zoom-in-95 duration-200 bg-destructive/10 p-1 rounded-md border border-destructive/20">
                                                            <span className="text-[10px] font-bold text-destructive uppercase px-1">¿Estas seguro?</span>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => { removeTable(t._id); setIsConfirmingDelete(null); }}
                                                                className="h-7 px-2 text-xs">
                                                                Sí
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => setIsConfirmingDelete(null)}
                                                                className="h-7 px-2 text-xs">
                                                                No
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>

                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>

            {/* Dialogo Crear/Editar */}
            <Dialog open={tableDialogOpen} onOpenChange={setTableDialogOpen}>
                <DialogContent className="bg-card border-border">
                    <DialogHeader>
                        <DialogTitle>{editing ? "Editar mesa" : "Nueva mesa"}</DialogTitle>
                        <DialogDescription>Asigna un número y una sección para esta mesa.</DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-2 gap-4 py-4">
                        <div className="space-y-2">
                            <Label>Número de Mesa</Label>
                            <Input
                                type="number" placeholder="Ej: 10"
                                value={form.number}
                                onChange={(e) => setForm({ ...form, number: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Capacidad</Label>
                            <Input
                                type="number"
                                value={form.capacity}
                                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Sección / Zona</Label>
                        <Select
                            value={form.sectionId}
                            onValueChange={(v) => setForm({ ...form, sectionId: v })}
                        >
                            <SelectTrigger className="bg-muted/50">
                                <SelectValue placeholder="Selecciona una sección" />
                            </SelectTrigger>
                            <SelectContent>
                                {sections.map((s) => (
                                    <SelectItem key={s._id} value={s._id}>{s.nombre}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setTableDialogOpen(false)}>Cancelar</Button>
                        <Button onClick={saveTable} className="gold-glow">Finalizar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Tables;