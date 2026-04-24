import { useState } from "react";
import { Plus, UserCircle, Pencil, Trash2, Filter, ChevronDown, ChevronUp, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { MobileNav } from "@/components/admin/MobileNav";

const emptyContador = {
    nombre: "",
    sucursal: "",
    numCedula: "",
    nivelAcceso: ""
};

const Contadores = () => {
    const [contadores, setContadores] = useState<any[]>([]);
    const [expanded, setExpanded] = useState<number | null>(null);
    const [sucursalFilter, setSucursalFilter] = useState("all");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [form, setForm] = useState(emptyContador);

    const filteredContadores = sucursalFilter === "all"
        ? contadores
        : contadores.filter((c) => c.sucursal === sucursalFilter);

    const openNew = () => {
        setEditing(null);
        setForm(emptyContador);
        setDialogOpen(true);
    };

    const openEdit = (contador: any) => {
        setEditing(contador);
        setForm({
            nombre: contador.nombre,
            sucursal: contador.sucursal,
            numCedula: contador.numCedula,
            nivelAcceso: contador.nivelAcceso
        });
        setDialogOpen(true);
    };

    const save = () => {
        if (!form.nombre.trim()) return;

        if (editing) {
            setContadores((prev) => prev.map((c) =>
                c.id === editing.id ? { ...c, ...form } : c
            ));
        } else {
            setContadores((prev) => [...prev, {
                id: Date.now(),
                ...form,
                nivelAcceso: form.nivelAcceso ? parseInt(form.nivelAcceso) : 2
            }]);
        }
        setDialogOpen(false);
    };

    const remove = (id: number) => {
        setContadores((prev) => prev.filter((c) => c.id !== id));
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
                            <Calculator className="w-8 h-8 text-primary" />
                            <h1 className="text-2xl md:text-3xl font-display font-bold text-gradient-gold">Contadores</h1>
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
                                <Plus className="w-4 h-4 mr-2" /> Agregar Contador
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {filteredContadores.map((contador) => (
                            <div key={contador.id} className="glass-card p-5 hover:border-primary/30 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                                            <UserCircle className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground">{contador.nombre}</h3>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <span>{contador.sucursal}</span>
                                                <span className="text-border">•</span>
                                                <span className="text-primary/80">Nivel {contador.nivelAcceso}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setExpanded(expanded === contador.id ? null : contador.id)}
                                        className="text-muted-foreground hover:text-primary"
                                    >
                                        {expanded === contador.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                        <span className="ml-1 text-xs">Detalles</span>
                                    </Button>
                                </div>

                                {expanded === contador.id && (
                                    <div className="mt-3 pt-3 border-t border-border space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <p className="text-sm text-muted-foreground">
                                            Sucursal: <span className="text-foreground">{contador.sucursal}</span>
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Número de Cédula: <span className="text-foreground">{contador.numCedula}</span>
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Nivel de Acceso: <span className="text-foreground">{contador.nivelAcceso}</span>
                                        </p>

                                        <div className="flex gap-2 pt-2">
                                            <Button variant="secondary" size="sm" onClick={() => openEdit(contador)}>
                                                <Pencil className="w-3 h-3 mr-1" /> Editar
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => remove(contador.id)}
                                                className="text-muted-foreground hover:text-foreground hover:border-muted-foreground">
                                                <Trash2 className="w-3 h-3 mr-1" /> Eliminar
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {filteredContadores.length === 0 && (
                            <p className="text-center text-muted-foreground py-10">No hay contadores registrados aún.</p>
                        )}
                    </div>
                </div>
            </main>

            {/* Diálogo para agregar/editar Contador */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="bg-card border-border">
                    <DialogHeader>
                        <DialogTitle className="text-foreground font-display">
                            {editing ? "Editar Contador" : "Agregar Nuevo Contador"}
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            {editing ? "Modifica los datos del contador." : "Completa los datos para registrar un nuevo contador."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label>Nombre Completo</Label>
                            <Input
                                value={form.nombre}
                                onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                                placeholder="Ej: Laura Méndez"
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
                            <Label>Número de Cédula</Label>
                            <Input
                                value={form.numCedula}
                                onChange={(e) => setForm((f) => ({ ...f, numCedula: e.target.value }))}
                                placeholder="Ej: 0456789123"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Nivel de Acceso</Label>
                            <Select value={form.nivelAcceso} onValueChange={(v) => setForm((f) => ({ ...f, nivelAcceso: v }))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona nivel de acceso" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Nivel 1 - Básico</SelectItem>
                                    <SelectItem value="2">Nivel 2 - Intermedio</SelectItem>
                                    <SelectItem value="3">Nivel 3 - Avanzado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={save} className="gold-glow">
                            {editing ? "Guardar Cambios" : "Agregar Contador"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Contadores;