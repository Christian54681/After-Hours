import { useState } from "react";
import { Plus, UserCircle, Pencil, Trash2, Filter, ChevronDown, ChevronUp, Martini } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { MobileNav } from "@/components/admin/MobileNav";

const emptyBartender = {
    nombre: "",
    sucursal: "",
    especialidad: "",
    barraAsignada: ""
};

const Bartenders = () => {
    const [bartenders, setBartenders] = useState<any[]>([]);
    const [expanded, setExpanded] = useState<number | null>(null);
    const [sucursalFilter, setSucursalFilter] = useState("all");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [form, setForm] = useState(emptyBartender);

    const filteredBartenders = sucursalFilter === "all"
        ? bartenders
        : bartenders.filter((b) => b.sucursal === sucursalFilter);

    const openNew = () => {
        setEditing(null);
        setForm(emptyBartender);
        setDialogOpen(true);
    };

    const openEdit = (bartender: any) => {
        setEditing(bartender);
        setForm({
            nombre: bartender.nombre,
            sucursal: bartender.sucursal,
            especialidad: bartender.especialidad,
            barraAsignada: bartender.barraAsignada
        });
        setDialogOpen(true);
    };

    const save = () => {
        if (!form.nombre.trim()) return;

        if (editing) {
            setBartenders((prev) => prev.map((b) =>
                b.id === editing.id ? { ...b, ...form } : b
            ));
        } else {
            setBartenders((prev) => [...prev, {
                id: Date.now(),
                ...form
            }]);
        }
        setDialogOpen(false);
    };

    const remove = (id: number) => {
        setBartenders((prev) => prev.filter((b) => b.id !== id));
        setExpanded(null);
    };

    return (
        <div className="min-h-screen bg-background flex">
            <AdminSidebar />

            <main className="flex-1 p-4 md:p-8 overflow-auto">
                <MobileNav />

                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Martini className="w-8 h-8 text-primary" />
                            <h1 className="text-2xl md:text-3xl font-display font-bold text-gradient-gold">Bartenders</h1>
                        </div>

                        <div className="flex gap-3 w-full sm:w-auto">
                            <Select value={sucursalFilter} onValueChange={setSucursalFilter}>
                                <SelectTrigger className="w-full sm:w-52 bg-muted/50 border-border">
                                    <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                                    <SelectValue placeholder="Filtrar por sucursal" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas las sucursales</SelectItem>
                                    <SelectItem value="Bar Universitario">Bar Universitario</SelectItem>
                                    <SelectItem value="Bar Tradicional">Bar Tradicional</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button onClick={openNew} className="gold-glow hover:scale-[1.02] transition-transform shrink-0">
                                <Plus className="w-4 h-4 mr-2" /> Agregar Bartender
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {filteredBartenders.map((bartender) => (
                            <div key={bartender.id} className="glass-card p-5 hover:border-primary/30 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                                            <UserCircle className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground">{bartender.nombre}</h3>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <span>{bartender.sucursal}</span>
                                                <span className="text-border">•</span>
                                                <span className="text-primary/80">{bartender.especialidad}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setExpanded(expanded === bartender.id ? null : bartender.id)}
                                        className="text-muted-foreground hover:text-primary"
                                    >
                                        {expanded === bartender.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                        <span className="ml-1 text-xs">Detalles</span>
                                    </Button>
                                </div>

                                {expanded === bartender.id && (
                                    <div className="mt-3 pt-3 border-t border-border space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <p className="text-sm text-muted-foreground">
                                            Sucursal: <span className="text-foreground">{bartender.sucursal}</span>
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Especialidad: <span className="text-foreground">{bartender.especialidad}</span>
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Barra Asignada: <span className="text-foreground">{bartender.barraAsignada}</span>
                                        </p>

                                        <div className="flex gap-2 pt-2">
                                            <Button variant="secondary" size="sm" onClick={() => openEdit(bartender)}>
                                                <Pencil className="w-3 h-3 mr-1" /> Editar
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => remove(bartender.id)}
                                                className="text-muted-foreground hover:text-foreground hover:border-muted-foreground">
                                                <Trash2 className="w-3 h-3 mr-1" /> Eliminar
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {filteredBartenders.length === 0 && (
                            <p className="text-center text-muted-foreground py-10">No hay bartenders registrados aún.</p>
                        )}
                    </div>
                </div>
            </main>

            {/* Diálogo para agregar/editar Bartender */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="bg-card border-border">
                    <DialogHeader>
                        <DialogTitle className="text-foreground font-display">
                            {editing ? "Editar Bartender" : "Agregar Nuevo Bartender"}
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            {editing ? "Modifica los datos del bartender." : "Completa los datos para registrar un nuevo bartender."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label>Nombre Completo</Label>
                            <Input
                                value={form.nombre}
                                onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                                placeholder="Ej: Ana Rodríguez"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Sucursal</Label>
                            <Select value={form.sucursal} onValueChange={(v) => setForm((f) => ({ ...f, sucursal: v }))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona sucursal" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Bar Universitario">Bar Universitario</SelectItem>
                                    <SelectItem value="Bar Tradicional">Bar Tradicional</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Especialidad</Label>
                            <Input
                                value={form.especialidad}
                                onChange={(e) => setForm((f) => ({ ...f, especialidad: e.target.value }))}
                                placeholder="Ej: Cocteles clásicos, Bebidas premium, Mocktails"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Barra Asignada</Label>
                            <Input
                                value={form.barraAsignada}
                                onChange={(e) => setForm((f) => ({ ...f, barraAsignada: e.target.value }))}
                                placeholder="Ej: Barra Principal, Barra Terraza, Barra VIP"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={save} className="gold-glow">
                            {editing ? "Guardar Cambios" : "Agregar Bartender"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Bartenders;