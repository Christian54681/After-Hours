import { useState } from "react";
import { Plus, UserCircle, Pencil, Trash2, Filter, ChevronDown, ChevronUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { MobileNav } from "@/components/admin/MobileNav";

const emptyPersonalOperativo = {
    nombre: "",
    sucursal: "",
    areaActual: "",
    activo: "true"
};

const PersonalOperativo = () => {
    const [personal, setPersonal] = useState<any[]>([]);
    const [expanded, setExpanded] = useState<number | null>(null);
    const [sucursalFilter, setSucursalFilter] = useState("all");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [form, setForm] = useState(emptyPersonalOperativo);

    const filteredPersonal = sucursalFilter === "all"
        ? personal
        : personal.filter((p) => p.sucursal === sucursalFilter);

    const openNew = () => {
        setEditing(null);
        setForm(emptyPersonalOperativo);
        setDialogOpen(true);
    };

    const openEdit = (persona: any) => {
        setEditing(persona);
        setForm({
            nombre: persona.nombre,
            sucursal: persona.sucursal,
            areaActual: persona.areaActual,
            activo: persona.activo ? "true" : "false"
        });
        setDialogOpen(true);
    };

    const save = () => {
        if (!form.nombre.trim()) return;

        if (editing) {
            setPersonal((prev) => prev.map((p) =>
                p.id === editing.id ? { ...p, ...form } : p
            ));
        } else {
            setPersonal((prev) => [...prev, {
                id: Date.now(),
                ...form,
                activo: form.activo === "true"
            }]);
        }
        setDialogOpen(false);
    };

    const remove = (id: number) => {
        setPersonal((prev) => prev.filter((p) => p.id !== id));
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
                            <Users className="w-8 h-8 text-primary" />
                            <h1 className="text-2xl md:text-3xl font-display font-bold text-gradient-gold">Personal Operativo</h1>
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
                                <Plus className="w-4 h-4 mr-2" /> Agregar Personal Operativo
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {filteredPersonal.map((persona) => (
                            <div key={persona.id} className="glass-card p-5 hover:border-primary/30 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                                            <UserCircle className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground">{persona.nombre}</h3>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <span>{persona.sucursal}</span>
                                                <span className="text-border">•</span>
                                                <span className="text-primary/80">{persona.areaActual}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setExpanded(expanded === persona.id ? null : persona.id)}
                                        className="text-muted-foreground hover:text-primary"
                                    >
                                        {expanded === persona.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                        <span className="ml-1 text-xs">Detalles</span>
                                    </Button>
                                </div>

                                {expanded === persona.id && (
                                    <div className="mt-3 pt-3 border-t border-border space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <p className="text-sm text-muted-foreground">
                                            Sucursal: <span className="text-foreground">{persona.sucursal}</span>
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Área Actual: <span className="text-foreground">{persona.areaActual}</span>
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Estado: <span className={`font-medium ${persona.activo ? 'text-green-600' : 'text-red-600'}`}>
                                                {persona.activo ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </p>

                                        <div className="flex gap-2 pt-2">
                                            <Button variant="secondary" size="sm" onClick={() => openEdit(persona)}>
                                                <Pencil className="w-3 h-3 mr-1" /> Editar
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => remove(persona.id)}
                                                className="text-muted-foreground hover:text-foreground hover:border-muted-foreground">
                                                <Trash2 className="w-3 h-3 mr-1" /> Eliminar
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {filteredPersonal.length === 0 && (
                            <p className="text-center text-muted-foreground py-10">No hay personal operativo registrado aún.</p>
                        )}
                    </div>
                </div>
            </main>

            {/* Diálogo para agregar/editar Personal Operativo */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="bg-card border-border">
                    <DialogHeader>
                        <DialogTitle className="text-foreground font-display">
                            {editing ? "Editar Personal Operativo" : "Agregar Nuevo Personal Operativo"}
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            {editing ? "Modifica los datos del personal operativo." : "Completa los datos para registrar nuevo personal operativo."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label>Nombre Completo</Label>
                            <Input
                                value={form.nombre}
                                onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                                placeholder="Ej: Roberto Sánchez"
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
                            <Label>Área Actual</Label>
                            <Input
                                value={form.areaActual}
                                onChange={(e) => setForm((f) => ({ ...f, areaActual: e.target.value }))}
                                placeholder="Ej: Cocina, Limpieza, Almacén"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Estado</Label>
                            <Select value={form.activo} onValueChange={(v) => setForm((f) => ({ ...f, activo: v }))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="true">Activo</SelectItem>
                                    <SelectItem value="false">Inactivo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={save} className="gold-glow">
                            {editing ? "Guardar Cambios" : "Agregar Personal Operativo"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PersonalOperativo;