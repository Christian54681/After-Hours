import { useState } from "react";
import { Plus, UserCircle, Pencil, Trash2, Filter, ChevronDown, ChevronUp, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { MobileNav } from "@/components/admin/MobileNav";

const emptyMesero = {
    nombre: "",
    sucursal: "",
    zonaAsignada: "",
    mesasACargo: ""
};

const Meseros = () => {
    const [meseros, setMeseros] = useState<any[]>([]); //aqui van a ir los meseros reales 
    const [expanded, setExpanded] = useState<number | null>(null);
    const [sucursalFilter, setSucursalFilter] = useState("all");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [form, setForm] = useState(emptyMesero);

    //filtrar por sucursal
    const filteredMeseros = sucursalFilter === "all"
        ? meseros
        : meseros.filter((m) => m.sucursal === sucursalFilter);

    const openNew = () => {
        setEditing(null);
        setForm(emptyMesero);
        setDialogOpen(true);
    };

    const openEdit = (mesero: any) => {
        setEditing(mesero);
        setForm({
            nombre: mesero.nombre,
            sucursal: mesero.sucursal,
            zonaAsignada: mesero.zonaAsignada,
            mesasACargo: mesero.mesasACargo
        });
        setDialogOpen(true);
    };

    const save = () => {
        if (!form.nombre.trim()) return;

        if (editing) {
            setMeseros((prev) => prev.map((m) =>
                m.id === editing.id ? { ...m, ...form } : m
            ));
        } else {
            setMeseros((prev) => [...prev, {
                id: Date.now(),
                ...form,
                mesasACargo: form.mesasACargo ? parseInt(form.mesasACargo) : 0
            }]);
        }
        setDialogOpen(false);
    };

    const remove = (id: number) => {
        setMeseros((prev) => prev.filter((m) => m.id !== id));
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
                            <UtensilsCrossed className="w-8 h-8 text-primary" />
                            <h1 className="text-2xl md:text-3xl font-display font-bold text-gradient-gold">Meseros</h1>
                        </div>

                        <div className="flex gap-3 w-full sm:w-auto">
                            <Select value={sucursalFilter} onValueChange={setSucursalFilter}>
                                <SelectTrigger className="w-full sm:w-52 bg-muted/50 border-border">
                                    <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                                    <SelectValue placeholder="Filtrar por sucursal" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas las sucursales</SelectItem>
                                    {/* Aquí irán las sucursales reales más adelante */}
                                    <SelectItem value="Bar Universitario">Bar Universitario</SelectItem>
                                    <SelectItem value="Bar Tradicional">Bar Tradicional</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button onClick={openNew} className="gold-glow hover:scale-[1.02] transition-transform shrink-0">
                                <Plus className="w-4 h-4 mr-2" /> Agregar Mesero
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {filteredMeseros.map((mesero) => (
                            <div key={mesero.id} className="glass-card p-5 hover:border-primary/30 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                                            <UserCircle className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground">{mesero.nombre}</h3>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <span>{mesero.sucursal}</span>
                                                <span className="text-border">•</span>
                                                <span className="text-primary/80">Mesero - {mesero.zonaAsignada}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setExpanded(expanded === mesero.id ? null : mesero.id)}
                                        className="text-muted-foreground hover:text-primary"
                                    >
                                        {expanded === mesero.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                        <span className="ml-1 text-xs">Detalles</span>
                                    </Button>
                                </div>

                                {expanded === mesero.id && (
                                    <div className="mt-3 pt-3 border-t border-border space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <p className="text-sm text-muted-foreground">
                                            Sucursal: <span className="text-foreground">{mesero.sucursal}</span>
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Zona asignada: <span className="text-foreground">{mesero.zonaAsignada}</span>
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Mesas a cargo: <span className="text-foreground">{mesero.mesasACargo}</span>
                                        </p>

                                        <div className="flex gap-2 pt-2">
                                            <Button variant="secondary" size="sm" onClick={() => openEdit(mesero)}>
                                                <Pencil className="w-3 h-3 mr-1" /> Editar
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => remove(mesero.id)}
                                                className="text-muted-foreground hover:text-foreground hover:border-muted-foreground">
                                                <Trash2 className="w-3 h-3 mr-1" /> Eliminar
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {filteredMeseros.length === 0 && (
                            <p className="text-center text-muted-foreground py-10">No hay meseros registrados aún.</p>
                        )}
                    </div>
                </div>
            </main>

            {/* Diálogo para agregar/editar Mesero */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="bg-card border-border">
                    <DialogHeader>
                        <DialogTitle className="text-foreground font-display">
                            {editing ? "Editar Mesero" : "Agregar Nuevo Mesero"}
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            {editing ? "Modifica los datos del mesero." : "Completa los datos para registrar un nuevo mesero."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label>Nombre Completo</Label>
                            <Input
                                value={form.nombre}
                                onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                                placeholder="Ej: María López"
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
                            <Label>Zona Asignada</Label>
                            <Input
                                value={form.zonaAsignada}
                                onChange={(e) => setForm((f) => ({ ...f, zonaAsignada: e.target.value }))}
                                placeholder="Ej: Zona Terraza, Barra Principal"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Mesas a Cargo</Label>
                            <Input
                                type="number"
                                value={form.mesasACargo}
                                onChange={(e) => setForm((f) => ({ ...f, mesasACargo: e.target.value }))}
                                placeholder="Ej: 8"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={save} className="gold-glow">
                            {editing ? "Guardar Cambios" : "Agregar Mesero"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Meseros;