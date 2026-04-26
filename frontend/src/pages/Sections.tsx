import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, LayoutGrid, Users, Info, ChevronDown, ChevronUp, User, UserCircle, Hash, Table, Utensils, Contact2, Milestone, Maximize, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { MobileNav } from "@/components/admin/MobileNav";
import { toast } from "sonner";

interface Section {
    _id?: string;
    idSeccion: string;
    nombre: string;
    capacidadMax: number;
    encargado: string;
    mesasIds: string[];
}

const Sections = () => {
    const [sections, setSections] = useState<Section[]>([]);
    const [employees, setEmployees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<Section | null>(null);

    const [form, setForm] = useState<Section>({
        idSeccion: "",
        nombre: "",
        capacidadMax: 0,
        encargado: "",
        mesasIds: []
    });

    // Carga de datos iniciales (Mock Data)
    const fetchData = async () => {
        setLoading(true);
        // Simulamos espera de servidor
        setTimeout(() => {
            const mockEmployees = [
                { _id: "e1", empleadoInfo: { nombreCompleto: "Carlos Rodríguez", tipoRol: "AdminSucursal" } },
                { _id: "e2", empleadoInfo: { nombreCompleto: "Ana Martínez", tipoRol: "AdminSucursal" } },
                { _id: "e3", empleadoInfo: { nombreCompleto: "Roberto Gómez", tipoRol: "Mesero" } }
            ];

            const mockSections = [
                {
                    _id: "s1",
                    idSeccion: "TER-01",
                    nombre: "Terraza Principal",
                    capacidadMax: 12,
                    encargado: "Carlos Rodríguez",
                    mesasIds: ["m1", "m2", "m3", "m4"]
                },
                {
                    _id: "s2",
                    idSeccion: "VIP-02",
                    nombre: "Salón Lounge VIP",
                    capacidadMax: 5,
                    encargado: "Ana Martínez",
                    mesasIds: ["m5", "m6"]
                }
            ];

            setEmployees(mockEmployees);
            setSections(mockSections);
            setLoading(false);
        }, 800);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openNew = () => {
        setEditing(null);
        setForm({ idSeccion: "", nombre: "", capacidadMax: 0, encargado: "", mesasIds: [] });
        setDialogOpen(true);
    };

    const openEdit = (s: Section) => {
        setEditing(s);
        setForm({ ...s });
        setDialogOpen(true);
    };

    const save = () => {
        if (!form.idSeccion || !form.nombre || !form.encargado) {
            toast.error("Por favor completa los campos obligatorios");
            return;
        }

        if (editing) {
            // Lógica de actualización local
            setSections(sections.map(s => s._id === editing._id ? { ...form, _id: editing._id } : s));
            toast.success("Sección actualizada correctamente");
        } else {
            // Lógica de creación local
            const newSec = { ...form, _id: `temp-${Date.now()}` };
            setSections([...sections, newSec]);
            toast.success("Nueva sección registrada");
        }
        setDialogOpen(false);
    };

    const deleteSection = (id: string) => {
        if (!confirm("¿Seguro que deseas eliminar esta sección?")) return;
        setSections(sections.filter(s => s._id !== id));
        toast.success("Sección eliminada localmente");
    };

    return (
        <div className="min-h-screen bg-background flex">
            <AdminSidebar />
            <main className="flex-1 p-4 md:p-8 overflow-auto">
                <MobileNav />
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-display font-bold text-gradient-gold">Secciones</h1>
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
                                                <div className="flex gap-2 items-center">
                                                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                                                        ID: {s.idSeccion}
                                                    </span>
                                                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full mt-1"> Máx: {s.capacidadMax} mesas
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setExpanded(expanded === s._id ? null : s._id)}
                                            className="text-muted-foreground hover:text-primary"
                                        >
                                            {expanded === s._id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                            <span className="ml-1 text-xs">Detalles</span>
                                        </Button>
                                    </div>

                                    {expanded === s._id && (
                                        <div className="mt-3 pt-3 border-t border-border space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                                                    <p className="text-sm text-muted-foreground">Responsable Sección: <span className="text-foreground">{s.encargado || "No asignado"}</span></p>
                                                    <p className="text-sm text-muted-foreground">Capacidad Máxima: <span className="text-foreground">{s.capacidadMax} Mesas</span></p>
                                                    
                                                    <div className="space-y- mt-3">
                                                        <p className="text-sm text-muted-foreground mb-3">Mesas Asignadas: <span className="text-foreground">{s.mesasIds?.length || 0} Registradas</span></p>
                                                        
                                                        <div className="flex flex-wrap gap-2">
                                                            {s.mesasIds && s.mesasIds.length > 0 ? (
                                                                s.mesasIds.map((mesaId, index) => (
                                                                    <span
                                                                        key={index}
                                                                        className="px-2 py-1 rounded-md bg-secondary/50 border border-border text-[11px] font-mono text-secondary-foreground"
                                                                    >
                                                                        {mesaId}
                                                                    </span>
                                                                ))
                                                            ) : (
                                                                <span className="text-xs italic text-muted-foreground/60">Sin mesas vinculadas</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>


                                            </div>

                                            <div className="flex gap-2 pt-2">
                                                <Button variant="secondary" size="sm" onClick={() => openEdit(s)}>
                                                    <Pencil className="w-3 h-3 mr-1" /> Editar
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => deleteSection(s._id!)}
                                                    className="text-muted-foreground hover:text-foreground hover:border-muted-foreground">
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
                <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-foreground font-display text-xl">
                            {editing ? "Editar Sección" : "Crear Nueva Sección"}
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Define un área física de la sucursal y asigna un responsable directo.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-muted-foreground">ID Sección</Label>
                                <Input
                                    placeholder="Ej: SALA-01"
                                    value={form.idSeccion}
                                    onChange={(e) => setForm({ ...form, idSeccion: e.target.value })}
                                    className="bg-muted/50 border-border focus:border-primary/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-muted-foreground">Nombre</Label>
                                <Input
                                    placeholder="Ej: Salón VIP"
                                    value={form.nombre}
                                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                                    className="bg-muted/50 border-border focus:border-primary/50"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-muted-foreground">Capacidad Mesas</Label>
                                <Input
                                    type="number"
                                    placeholder="0"
                                    value={form.capacidadMax}
                                    onChange={(e) => setForm({ ...form, capacidadMax: parseInt(e.target.value) })}
                                    className="bg-muted/50 border-border"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-muted-foreground">Responsable</Label>
                                <Select value={form.encargado} onValueChange={(v) => setForm({ ...form, encargado: v })}>
                                    <SelectTrigger className="bg-muted/50 border-border">
                                        <SelectValue placeholder="Selecciona responsable" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-border">
                                        {employees.map((emp) => (
                                            <SelectItem key={emp._id} value={emp.empleadoInfo.nombreCompleto}>
                                                {emp.empleadoInfo.nombreCompleto}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0 mt-3">
                        <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-border">
                            Cancelar
                        </Button>
                        <Button onClick={save} className="gold-glow">
                            {editing ? "Guardar Cambios" : "Crear Sección"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Sections;