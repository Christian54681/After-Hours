import { useMemo, useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Clock, MapPin, UserCircle, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { MobileNav } from "@/components/admin/MobileNav";

import { intervalsForDay } from "@/lib/shiftConflicts";
import { useAuth } from "@/context/AuthContext";

const urlbase = "http://localhost:3000/api";

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const PX_PER_HOUR = 36;
const WEEK_DAYS = [
    { key: "mon", label: "Lun" }, { key: "tue", label: "Mar" }, { key: "wed", label: "Mié" },
    { key: "thu", label: "Jue" }, { key: "fri", label: "Vie" }, { key: "sat", label: "Sáb" },
    { key: "sun", label: "Dom" }
] as const;

type DayKey = typeof WEEK_DAYS[number]["key"];

interface Shift {
    _id?: string;
    empleadoId: string;
    sucursalId: string;
    fecha?: string;
    entrada: string;
    salida: string;
    rolEnTurno: string;
    dias?: DayKey[];
}

const emptyForm = {
    empleadoId: "",
    sucursalId: "",
    entrada: "18:00",
    salida: "23:00",
    dias: [] as DayKey[],
};

const Shifts = () => {
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [employees, setEmployees] = useState<any[]>([]);
    const [branches, setBranches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<Shift | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [error, setError] = useState<string | null>(null);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

    const { user } = useAuth();

    const sucursalMongoId = useMemo(() => {
        const miCodigoSucursal = user?.idSucursalACargo; // ej. "SUC_001"
        if (!miCodigoSucursal) return "";

        const sucursalEncontrada = branches.find(b => b.idSucursal === miCodigoSucursal);

        return sucursalEncontrada?._id || "";
    }, [user, branches]);

    // Obtenemos el ID de sucursal del usuario logueado
    const adminBranchId = user?.idSucursalACargo || "";

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

            const [sRes, eRes, bRes] = await Promise.all([
                fetch(`${urlbase}/admin/horarios`, { headers }),
                fetch(`${urlbase}/admin/empleados/all`, { headers }),
                fetch(`${urlbase}/admin/branches`, { headers })
            ]);

            const sData = await sRes.json();
            const eData = await eRes.json();
            const bData = await bRes.json();

            console.log("usuario:", user);
            console.log("sucursales:", bData);
            console.log("empleados:", eData);

            setShifts(Array.isArray(sData) ? sData : (sData.data || []));
            setEmployees(eData.data || []);
            setBranches(bData.data || bData);
        } catch (err) {
            toast.error("Error al cargar datos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // FUNCIONES DE AYUDA
    const employeeName = (id: string) => {
        const emp = employees.find((e) => e._id === id);
        return emp?.empleadoInfo?.nombreCompleto || emp?.nombreCompleto || "—";
    };

    const branchName = (id: string) => {
        const b = branches.find(b => b.idSucursal === id);
        return b?.nombre || "Cargando...";
    };

    const employeeRole = (id: string) => {
        const emp = employees.find((e) => e._id === id);
        return emp?.empleadoInfo?.tipoRol || emp?.tipoRol || "Personal";
    };

    const accentFor = (id: string) => {
        const colors = [
            { bg: "bg-indigo-500/10", border: "border-indigo-500/40", text: "text-indigo-600" },
            { bg: "bg-amber-500/10", border: "border-amber-500/40", text: "text-amber-600" },
            { bg: "bg-emerald-500/10", border: "border-emerald-500/40", text: "text-emerald-600" },
            { bg: "bg-rose-500/10", border: "border-rose-500/40", text: "text-rose-600" },
        ];
        const hash = id ? id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
        return colors[hash % colors.length];
    };

    // FILTRADOS
    const filteredEmployees = useMemo(() => {
        if (!adminBranchId || adminBranchId === "all") return employees;
        return employees.filter((e) => {
            const sId = e.sucursalId || e.empleadoInfo?.idSucursal || e.empleadoInfo?.sucursalId;
            return sId === adminBranchId;
        });
    }, [employees, adminBranchId]);

    const filteredShifts = useMemo(() => {
        if (!sucursalMongoId || sucursalMongoId === "all") return shifts;

        return shifts.filter(s =>
            s.sucursalId === sucursalMongoId || s.sucursalId === user?.idSucursalACargo
        );
    }, [shifts, sucursalMongoId, user]);

    const segmentsByDay = useMemo(() => {
        const map: Record<DayKey, Array<{ shift: Shift; startMin: number; endMin: number }>> = {
            mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [],
        };

        if (!Array.isArray(filteredShifts)) return map;

        filteredShifts.forEach(s => {
            let activeDays: DayKey[] = [];
            if (s.dias && s.dias.length > 0) {
                activeDays = s.dias as DayKey[];
            } else if (s.fecha) {
                const date = new Date(s.fecha + "T00:00:00");
                const indexToKey: DayKey[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
                activeDays = [indexToKey[date.getDay()]];
            }

            activeDays.forEach(dayKey => {
                if (map[dayKey]) {
                    try {
                        const compatibleShift = {
                            ...s,
                            startTime: s.entrada || "00:00",
                            endTime: s.salida || "00:00",
                            days: activeDays
                        };
                        const intervals = intervalsForDay(compatibleShift as any, dayKey);
                        intervals.forEach(([start, end]) => {
                            map[dayKey].push({ shift: s, startMin: start, endMin: end });
                        });
                    } catch (e) { console.error(e); }
                }
            });
        });
        return map;
    }, [filteredShifts]);

    // ACCIONES
    const handleOpenNew = () => {
        setEditing(null);
        setError(null);
        setForm({
            ...emptyForm,
            sucursalId: adminBranchId,
            dias: [],
        });
        setDialogOpen(true);
    };

    const save = async () => {
        setError(null);

        // Validación incluyendo el sucursalId
        if (!form.empleadoId || !form.sucursalId || form.dias.length === 0) {
            setError("Completa todos los campos y selecciona al menos un día.");
            return;
        }

        const payload = {
            ...form,
            sucursalId: sucursalMongoId,
            rolEnTurno: "Personal"
        };

        try {
            const method = editing ? 'PUT' : 'POST';
            const url = editing ? `${urlbase}/admin/horarios/${editing._id}` : `${urlbase}/admin/horarios`;

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                toast.success(editing ? "Turno actualizado" : "Turno creado");
                fetchData();
                setDialogOpen(false);
            } else {
                const errData = await res.json();
                setError(errData.error || errData.message || "Error al guardar");
            }
        } catch (err) { setError("Error de conexión"); }
    };

    const remove = async (id: string) => {
        try {
            const res = await fetch(`${urlbase}/admin/horarios/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) {
                toast.success("Turno eliminado");
                fetchData();
                setDialogOpen(false);
            }
        } catch (err) { toast.error("Error al eliminar"); }
    };

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>;

    return (
        <div className="min-h-screen bg-background flex">
            <AdminSidebar />
            <main className="flex-1 p-4 md:p-8 overflow-auto">
                <MobileNav />
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gradient-gold">Gestión de Turnos</h1>
                            <p className="text-xs text-muted-foreground">Sucursal: {branchName(adminBranchId)}</p>
                        </div>
                        <Button onClick={handleOpenNew}>
                            <Plus className="w-4 h-4 mr-2" /> Agregar Turno
                        </Button>
                    </div>

                    <div className="glass-card p-4 overflow-x-auto border border-border/40 shadow-xl rounded-xl">
                        <div className="min-w-[900px]">
                            {/* Cabecera Días */}
                            <div className="grid mb-2" style={{ gridTemplateColumns: "60px repeat(7, minmax(0, 1fr))" }}>
                                <div />
                                {WEEK_DAYS.map(d => (
                                    <div key={d.key} className="text-center text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{d.label}</div>
                                ))}
                            </div>

                            {/* Grid del Calendario */}
                            <div className="grid relative bg-background/50 rounded-lg" style={{ gridTemplateColumns: "60px repeat(7, minmax(0, 1fr))" }}>
                                <div className="border-r border-border/50">
                                    {HOURS.map(h => (
                                        <div key={h} className="h-9 text-[10px] text-muted-foreground pr-2 text-right leading-[36px] font-medium border-b border-border/5">
                                            {h.toString().padStart(2, "0")}:00
                                        </div>
                                    ))}
                                </div>

                                {WEEK_DAYS.map(d => {
                                    const daySegments = segmentsByDay[d.key] || [];
                                    return (
                                        <div key={d.key} className="relative border-r border-border/20 last:border-r-0">
                                            {HOURS.map(h => <div key={h} className="h-9 border-b border-border/5" />)}

                                            {daySegments.map((seg, idx) => {
                                                const top = (seg.startMin / 60) * PX_PER_HOUR;
                                                const height = ((seg.endMin - seg.startMin) / 60) * PX_PER_HOUR;
                                                const accent = accentFor(seg.shift.empleadoId);

                                                const overlaps = daySegments.filter(s =>
                                                    (seg.startMin < s.endMin && s.startMin < seg.endMin)
                                                );
                                                const width = 100 / overlaps.length;
                                                const left = overlaps.indexOf(seg) * width;

                                                return (
                                                    <button
                                                        key={`${seg.shift._id}-${idx}`}
                                                        onClick={() => {
                                                            setEditing(seg.shift);
                                                            setError(null);
                                                            setForm({
                                                                empleadoId: seg.shift.empleadoId,
                                                                sucursalId: seg.shift.sucursalId,
                                                                entrada: seg.shift.entrada,
                                                                salida: seg.shift.salida,
                                                                dias: seg.shift.dias || []
                                                            });
                                                            setDialogOpen(true);
                                                        }}
                                                        className={`absolute rounded-md border ${accent.bg} ${accent.border} p-1.5 text-left overflow-hidden z-10 shadow-sm transition-all hover:z-30 hover:shadow-md`}
                                                        style={{
                                                            top: `${top}px`,
                                                            height: `${Math.max(height, 35)}px`,
                                                            left: `${left}%`,
                                                            width: `${width - 1}%`
                                                        }}
                                                    >
                                                        <div className={`text-[10px] font-bold ${accent.text} truncate`}>
                                                            {employeeName(seg.shift.empleadoId)}
                                                            <span className="opacity-70 font-normal ml-1">
                                                                • {employeeRole(seg.shift.empleadoId)}
                                                            </span>
                                                        </div>
                                                        <div className="text-[8px] opacity-60">
                                                            {seg.shift.entrada}-{seg.shift.salida}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Cards de turnos */}
                    <div className="space-y-3">
                        {filteredShifts.map((shift) => (
                            <div
                                key={shift._id}
                                className="flex items-center justify-between p-4 rounded-xl border border-border/40 bg-background/60 shadow-sm"
                            >
                                {/* Info izquierda */}
                                <div className="flex flex-col">
                                    <span className="font-semibold text-sm">
                                        {employeeName(shift.empleadoId)}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {employeeRole(shift.empleadoId)}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {shift.entrada} - {shift.salida}
                                    </span>
                                </div>

                                {/* Botón editar */}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setEditing(shift);
                                        setError(null);
                                        setForm({
                                            empleadoId: shift.empleadoId,
                                            sucursalId: shift.sucursalId,
                                            entrada: shift.entrada,
                                            salida: shift.salida,
                                            dias: shift.dias || []
                                        });
                                        setDialogOpen(true);
                                    }}
                                >
                                    <Pencil className="w-4 h-4 mr-1" />
                                    Editar
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-foreground font-display">{editing ? "Editar Turno" : "Agregar Turno"} Semanal</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label className="text-muted-foreground">Empleado</Label>
                            <Select value={form.empleadoId} onValueChange={(v) => setForm(f => ({ ...f, empleadoId: v }))}>
                                <SelectTrigger><SelectValue placeholder="Seleccionar empleado" /></SelectTrigger>
                                <SelectContent>
                                    {filteredEmployees.map(e => (
                                        <SelectItem key={e._id} value={e._id}>
                                            {e.nombreCompleto || e.empleadoInfo?.nombreCompleto} - <span className="opacity-70 font-normal">{e.empleadoInfo?.tipoRol} </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-muted-foreground">
                                Sucursal de Gestión
                            </Label>
                            <Input
                                value={branchName(adminBranchId)}
                                readOnly
                                className="bg-muted/50 cursor-not-allowed font-medium"
                            />
                            <p className="text-[10px] text-muted-foreground italic">
                                * Estás gestionando la sucursal asignada a tu cuenta.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-muted-foreground">Entrada</Label>
                                <Input type="time" value={form.entrada} onChange={e => setForm(f => ({ ...f, entrada: e.target.value }))} />
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Salida</Label>
                                <Input type="time" value={form.salida} onChange={e => setForm(f => ({ ...f, salida: e.target.value }))} />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-muted-foreground">Días de la semana</Label>
                            <div className="flex flex-wrap gap-2">
                                {WEEK_DAYS.map(d => {
                                    const isSelected = form.dias.includes(d.key as DayKey);
                                    return (
                                        <button
                                            key={d.key}
                                            type="button"
                                            onClick={() => setForm(f => ({
                                                ...f,
                                                dias: isSelected ? f.dias.filter(x => x !== d.key) : [...f.dias, d.key as DayKey]
                                            }))}
                                            className={`px-3 py-2 rounded-lg text-[10px] font-bold transition-all border ${isSelected ? "bg-primary border-primary text-white shadow-lg" : "bg-muted/50 border-transparent text-muted-foreground hover:bg-muted"}`}
                                        >
                                            {d.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-xs animate-in fade-in zoom-in duration-200">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        {editing && (
                            <div className="flex items-center gap-2">
                                {!isConfirmingDelete ? (
                                    // BOTÓN INICIAL
                                    <Button
                                        variant="outline"
                                        className="border-border text-muted-foreground"
                                        onClick={() => setIsConfirmingDelete(true)}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Eliminar
                                    </Button>
                                ) : (
                                    // BOTÓN DE CONFIRMACIÓN REAL
                                    <div className="flex items-center gap-1 animate-in fade-in slide-in-from-right-2 duration-300">
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => remove(editing._id!)}
                                            className="shadow-lg shadow-destructive/20"
                                        >
                                            Confirmar
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setIsConfirmingDelete(false)}
                                        >
                                            Cancelar
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                        <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-border text-muted-foreground">Cancelar</Button>
                        <Button onClick={save} className="gold-glow">
                            {editing ? "Guardar Cambios" : "Agregar Turno"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Shifts;