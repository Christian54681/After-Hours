import { useState, useEffect } from "react";
import { Plus, UserCircle, Pencil, Trash2, Filter, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { MobileNav } from "@/components/admin/MobileNav";
import { toast } from "sonner";

interface MongoEmployee {
    _id: string;
    username: string;
    email: string;
    empleadoInfo: {
        email: string;
        password: string;
        nombreCompleto: string;
        idSucursal: string;
        tipoRol: string;
        telefono?: string;
        // Campos adicionales dinámicos
        zonaAsignada?: string;
        mesasACargo?: string;
        especialidad?: string;
        barraAsignada?: string;
        numCedula?: string;
        nivelAcceso?: number;
        numCaja?: number;
        fondoInicial?: number;
        montoActual?: number;
    };
}

const positions = ["AdminSucursal", "Mesero", "Bartender", "Contador", "Cajero"];
const zonasDisponibles = ["Terraza", "Salón Principal", "VIP", "Barra Exterior"];
const barrasDisponibles = ["Barra 1 - Lobby", "Barra 2 - Pool", "Barra VIP"];

const urlbase = "http://localhost:3000/api";

const Employees = () => {
    const [employees, setEmployees] = useState<MongoEmployee[]>([]);
    const [branches, setBranches] = useState<{ idSucursal: string, nombre: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [branchFilter, setBranchFilter] = useState("all");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<MongoEmployee | null>(null);

    const [form, setForm] = useState<any>({
        username: "",
        email: "",
        password: "",
        nombreCompleto: "",
        idSucursal: "",
        tipoRol: "",
        telefono: "",
        // Init campos dinámicos
        zonaAsignada: "",
        mesasACargo: "",
        especialidad: "",
        barraAsignada: "",
        numCedula: "",
        nivelAcceso: 0,
        numCaja: 0,
        fondoInicial: 0,
        montoActual: 0
    });

    const fetchData = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        try {
            const [resEmp, resBranch] = await Promise.all([
                fetch(`${urlbase}/admin/empleados/all`, { headers: { Authorization: `Bearer ${token}` } }),
                fetch(`${urlbase}/admin/branches`, { headers: { Authorization: `Bearer ${token}` } })
            ]);
            const dataEmp = await resEmp.json();
            const dataBranch = await resBranch.json();
            if (dataEmp.success) setEmployees(dataEmp.data);
            setBranches(dataBranch);
        } catch (error) {
            toast.error("Error al conectar con el servidor");
        } finally {
            setLoading(false);
        }
    };

    const deleteEmployee = async (id: string) => {
        if (!confirm("¿Confirma que desea eliminar este empleado?")) return;
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${urlbase}/admin/empleados/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                toast.success("Empleado eliminado");
                fetchData();
            } else {
                const data = await response.json();
                toast.error(data.error || "Error al eliminar empleado");
            }
        } catch (error) {
            toast.error("Error de conexión");
        }
    };

    useEffect(() => { fetchData(); }, []);

    const filtered = branchFilter === "all"
        ? employees
        : employees.filter((e) => e.empleadoInfo.idSucursal === branchFilter);

    const openNew = () => {
        setEditing(null);
        setForm({ 
            username: `user_${Date.now()}`,
            email: "", 
            password: "", 
            nombreCompleto: "", 
            idSucursal: "", 
            tipoRol: "", 
            telefono: "",
            zonaAsignada: "",
            mesasACargo: "",
            especialidad: "",
            barraAsignada: "",
            numCedula: "",
            nivelAcceso: 0,
            numCaja: 0,
            fondoInicial: 0,
            montoActual: 0
        });
        setDialogOpen(true);
    };

    const openEdit = (e: MongoEmployee) => {
        setEditing(e);
        setForm({
            username: e.username,
            email: e.email,
            password: "",
            nombreCompleto: e.empleadoInfo.nombreCompleto,
            idSucursal: e.empleadoInfo.idSucursal,
            tipoRol: e.empleadoInfo.tipoRol,
            telefono: e.empleadoInfo.telefono || "",
            zonaAsignada: e.empleadoInfo.zonaAsignada || "",
            mesasACargo: e.empleadoInfo.mesasACargo || "",
            especialidad: e.empleadoInfo.especialidad || "",
            barraAsignada: e.empleadoInfo.barraAsignada || "",
            numCedula: e.empleadoInfo.numCedula || "",
            nivelAcceso: e.empleadoInfo.nivelAcceso || 0,
            numCaja: e.empleadoInfo.numCaja || 0,
            fondoInicial: e.empleadoInfo.fondoInicial || 0,
            montoActual: e.empleadoInfo.montoActual || 0
        });
        setDialogOpen(true);
    };

    const save = async () => {
        if (!form.nombreCompleto.trim() || !form.email.trim()) {
            toast.error("Por favor completa los campos obligatorios");
            return;
        }

        const token = localStorage.getItem("token");
        const url = editing ? `${urlbase}/admin/empleados/${editing._id}` : `${urlbase}/admin/empleados`;
        const method = editing ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(form)
            });

            if (res.ok) {
                toast.success(editing ? "Actualizado con éxito" : "Empleado creado");
                setDialogOpen(false);
                fetchData();
            } else {
                const err = await res.json();
                toast.error(err.error || "Error al guardar");
            }
        } catch (error) {
            toast.error("Error de red");
        }
    };

    const renderExtraFields = () => {
        switch (form.tipoRol) {
            case "Mesero":
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-1">
                        <div className="space-y-2">
                            <Label className="text-muted-foreground">Zona Asignada</Label>
                            <Select value={form.zonaAsignada} onValueChange={(v) => setForm({ ...form, zonaAsignada: v })}>
                                <SelectTrigger className="bg-muted/50 border-border"><SelectValue placeholder="Selecciona Zona" /></SelectTrigger>
                                <SelectContent>
                                    {zonasDisponibles.map(z => <SelectItem key={z} value={z}>{z}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-muted-foreground">Mesas a Cargo</Label>
                            <Input placeholder="Ej: 1, 2, 5, 8" value={form.mesasACargo} onChange={(e) => setForm({ ...form, mesasACargo: e.target.value })} className="bg-muted/50 border-border" />
                        </div>
                    </div>
                );
            case "Bartender":
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-1">
                        <div className="space-y-2">
                            <Label className="text-muted-foreground">Especialidad</Label>
                            <Input placeholder="Ej: Coctelería de autor" value={form.especialidad} onChange={(e) => setForm({ ...form, especialidad: e.target.value })} className="bg-muted/50 border-border" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-muted-foreground">Barra Asignada</Label>
                            <Select value={form.barraAsignada} onValueChange={(v) => setForm({ ...form, barraAsignada: v })}>
                                <SelectTrigger className="bg-muted/50 border-border"><SelectValue placeholder="Selecciona Barra" /></SelectTrigger>
                                <SelectContent>
                                    {barrasDisponibles.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                );
            case "Contador":
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-1">
                        <div className="space-y-2">
                            <Label className="text-muted-foreground">Núm. Cédula</Label>
                            <Input value={form.numCedula} onChange={(e) => setForm({ ...form, numCedula: e.target.value })} className="bg-muted/50 border-border" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-muted-foreground">Nivel Acceso</Label>
                            <Input type="number" value={form.nivelAcceso} onChange={(e) => setForm({ ...form, nivelAcceso: parseInt(e.target.value) })} className="bg-muted/50 border-border" />
                        </div>
                    </div>
                );
            case "Cajero":
                return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-1">
                        <div className="space-y-2">
                            <Label className="text-muted-foreground">Núm. Caja</Label>
                            <Input type="number" value={form.numCaja} onChange={(e) => setForm({ ...form, numCaja: parseInt(e.target.value) })} className="bg-muted/50 border-border" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-muted-foreground">Fondo Inicial</Label>
                            <Input type="number" value={form.fondoInicial} onChange={(e) => setForm({ ...form, fondoInicial: parseFloat(e.target.value) })} className="bg-muted/50 border-border" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-muted-foreground">Monto Actual</Label>
                            <Input type="number" value={form.montoActual} onChange={(e) => setForm({ ...form, montoActual: parseFloat(e.target.value) })} className="bg-muted/50 border-border" />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-background flex">
            <AdminSidebar />
            <main className="flex-1 p-4 md:p-8 overflow-auto">
                <MobileNav />
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <h1 className="text-2xl md:text-3xl font-display font-bold text-gradient-gold">Gestión de Personal</h1>
                        <div className="flex gap-3 w-full sm:w-auto">
                            <Select value={branchFilter} onValueChange={setBranchFilter}>
                                <SelectTrigger className="w-full sm:w-48 bg-muted/50 border-border text-foreground">
                                    <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                                    <SelectValue placeholder="Filtrar sucursal" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas las sucursales</SelectItem>
                                    {branches.map((b) => (
                                        <SelectItem key={b.idSucursal} value={b.idSucursal}>{b.nombre}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button onClick={openNew} className="gold-glow hover:scale-[1.02] transition-transform shrink-0">
                                <Plus className="w-4 h-4 mr-2" /> Agregar
                            </Button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                    ) : (
                        <div className="grid gap-4">
                            {filtered.map((e) => (
                                <div key={e._id} className="glass-card p-5 hover:border-primary/30 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                                                <UserCircle className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-foreground">{e.empleadoInfo.nombreCompleto}</h3>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <span className="text-primary/80 uppercase font-bold">{e.empleadoInfo.tipoRol}</span>
                                                    <span className="text-border">•</span>
                                                    <span>{branches.find(b => b.idSucursal === e.empleadoInfo.idSucursal)?.nombre || 'Sin Sucursal'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={() => setExpanded(expanded === e._id ? null : e._id)}
                                            className="text-muted-foreground hover:text-primary">
                                            {expanded === e._id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                            <span className="ml-1 text-xs">Detalles</span>
                                        </Button>
                                    </div>

                                    {expanded === e._id && (
                                        <div className="mt-3 pt-3 border-t border-border space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                            <p className="text-sm text-muted-foreground">Email: <span className="text-foreground">{e.email}</span></p>
                                            <p className="text-sm text-muted-foreground">ID Usuario: <span className="text-foreground">{e.username}</span></p>
                                            <p className="text-sm text-muted-foreground">Teléfono: <span className="text-foreground">{e.empleadoInfo.telefono || "No registrado"}</span></p>
                                            <div className="flex gap-2 pt-2">
                                                <Button variant="secondary" size="sm" onClick={() => openEdit(e)}>
                                                    <Pencil className="w-3 h-3 mr-1" /> Editar
                                                </Button>
                                                <Button variant="outline" size="sm" onClick={ () => deleteEmployee(e._id) }
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
                        <DialogTitle className="text-foreground font-display">{editing ? "Editar Empleado" : "Agregar Empleado"}</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            {editing ? "Modifica los datos del personal." : "Completa los datos para registrar un nuevo empleado."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label className="text-muted-foreground">Nombre Completo</Label>
                            <Input value={form.nombreCompleto} onChange={(e) => setForm({ ...form, nombreCompleto: e.target.value })}
                                placeholder="Ej: Luis García" className="bg-muted/50 border-border" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-muted-foreground">Correo Electrónico</Label>
                                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    placeholder="lgarcia@afterhours.com" className="bg-muted/50 border-border" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-muted-foreground">Teléfono</Label>
                                <Input type="tel" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                                    placeholder="5512345678" className="bg-muted/50 border-border" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-muted-foreground">
                                {editing ? "Nueva Contraseña (opcional)" : "Contraseña"}
                            </Label>
                            <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                                className="bg-muted/50 border-border" placeholder="••••••••" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-muted-foreground">Puesto / Rol</Label>
                                <Select value={form.tipoRol} onValueChange={(v) => setForm({ ...form, tipoRol: v })}>
                                    <SelectTrigger className="bg-muted/50 border-border"><SelectValue placeholder="Selecciona" /></SelectTrigger>
                                    <SelectContent>
                                        {positions.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-muted-foreground">Sucursal Asignada</Label>
                                <Select value={form.idSucursal} onValueChange={(v) => setForm({ ...form, idSucursal: v })}>
                                    <SelectTrigger className="bg-muted/50 border-border"><SelectValue placeholder="Selecciona" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="GLOBAL">Global / Corporativo</SelectItem>
                                        {branches.map(b => <SelectItem key={b.idSucursal} value={b.idSucursal}>{b.nombre}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* SECCIÓN DE CAMPOS DINÁMICOS */}
                        {form.tipoRol && form.tipoRol !== "AdminSucursal" && form.tipoRol !== "AdminGeneral" && (
                            <div className="pt-4 border-t border-border">
                                <h4 className="text font-bold text-foreground font-display mb-3">Campos Específicos de {form.tipoRol}</h4>
                                {renderExtraFields()}
                            </div>
                        )}
                    </div>

                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-border text-muted-foreground">Cancelar</Button>
                        <Button onClick={save} className="gold-glow">{editing ? "Guardar Cambios" : "Agregar"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Employees;