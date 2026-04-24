import { useState } from "react";
import { Plus, UserCircle, Pencil, Trash2, Filter, ChevronDown, ChevronUp, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { MobileNav } from "@/components/admin/MobileNav";

const emptyCajero = {
    nombre: "",
    sucursal: "",
    numeroCaja: "",
    fondoInicial: ""
};

const Cajeros = () => {
    const [cajeros, setCajeros] = useState<any[]>([]);
    const [expanded, setExpanded] = useState<number | null>(null);
    const [sucursalFilter, setSucursalFilter] = useState("all");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [form, setForm] = useState(emptyCajero);

    const filteredCajeros = sucursalFilter === "all"
        ? cajeros
        : cajeros.filter((c) => c.sucursal === sucursalFilter);

    const openNew = () => {
        setEditing(null);
        setForm(emptyCajero);
        setDialogOpen(true);
    };

    const openEdit = (cajero: any) => {
        setEditing(cajero);
        setForm({
            nombre: cajero.nombre,
            sucursal: cajero.sucursal,
            numeroCaja: cajero.numeroCaja,
            fondoInicial: cajero.fondoInicial
        });
        setDialogOpen(true);
    };

    const save = () => {
        if (!form.nombre.trim()) return;

        if (editing) {
            setCajeros((prev) => prev.map((c) =>
                c.id === editing.id ? { ...c, ...form } : c
            ));
        } else {
            setCajeros((prev) => [...prev, {
                id: Date.now(),
                ...form,
                numeroCaja: form.numeroCaja ? parseInt(form.numeroCaja) : 1,
                fondoInicial: form.fondoInicial ? parseFloat(form.fondoInicial) : 0
            }]);
        }
        setDialogOpen(false);
    };

    const remove = (id: number) => {
        setCajeros((prev) => prev.filter((c) => c.id !== id));
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
                            <CreditCard className="w-8 h-8 text-primary" />
                            <h1 className="text-2xl md:text-3xl font-display font-bold text-gradient-gold">Cajeros</h1>
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
                                <Plus className="w-4 h-4 mr-2" /> Agregar Cajero
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {filteredCajeros.map((cajero) => (
                            <div key={cajero.id} className="glass-card p-5 hover:border-primary/30 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                                            <UserCircle className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground">{cajero.nombre}</h3>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <span>{cajero.sucursal}</span>
                                                <span className="text-border">•</span>
                                                <span className="text-primary/80">Caja #{cajero.numeroCaja}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setExpanded(expanded === cajero.id ? null : cajero.id)}
                                        className="text-muted-foreground hover:text-primary"
                                    >
                                        {expanded === cajero.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                        <span className="ml-1 text-xs">Detalles</span>
                                    </Button>
                                </div>

                                {expanded === cajero.id && (
                                    <div className="mt-3 pt-3 border-t border-border space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <p className="text-sm text-muted-foreground">
                                            Sucursal: <span className="text-foreground">{cajero.sucursal}</span>
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Número de Caja: <span className="text-foreground">#{cajero.numeroCaja}</span>
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Fondo Inicial: <span className="text-foreground">${cajero.fondoInicial}</span>
                                        </p>

                                        <div className="flex gap-2 pt-2">
                                            <Button variant="secondary" size="sm" onClick={() => openEdit(cajero)}>
                                                <Pencil className="w-3 h-3 mr-1" /> Editar
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => remove(cajero.id)}
                                                className="text-muted-foreground hover:text-foreground hover:border-muted-foreground">
                                                <Trash2 className="w-3 h-3 mr-1" /> Eliminar
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {filteredCajeros.length === 0 && (
                            <p className="text-center text-muted-foreground py-10">No hay cajeros registrados aún.</p>
                        )}
                    </div>
                </div>
            </main>

            {/* Diálogo para agregar/editar Cajero */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="bg-card border-border">
                    <DialogHeader>
                        <DialogTitle className="text-foreground font-display">
                            {editing ? "Editar Cajero" : "Agregar Nuevo Cajero"}
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            {editing ? "Modifica los datos del cajero." : "Completa los datos para registrar un nuevo cajero."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label>Nombre Completo</Label>
                            <Input
                                value={form.nombre}
                                onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                                placeholder="Ej: Carlos Ramírez"
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
                            <Label>Número de Caja</Label>
                            <Input
                                type="number"
                                value={form.numeroCaja}
                                onChange={(e) => setForm((f) => ({ ...f, numeroCaja: e.target.value }))}
                                placeholder="Ej: 1"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Fondo Inicial ($)</Label>
                            <Input
                                type="number"
                                step="0.01"
                                value={form.fondoInicial}
                                onChange={(e) => setForm((f) => ({ ...f, fondoInicial: e.target.value }))}
                                placeholder="Ej: 500.00"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={save} className="gold-glow">
                            {editing ? "Guardar Cambios" : "Agregar Cajero"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Cajeros;