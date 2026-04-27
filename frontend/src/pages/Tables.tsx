import { useMemo, useState } from "react";
import {
    Plus,
    Pencil,
    Trash2,
    ChevronDown,
    ChevronUp,
    UserCircle,
    Clock,
    User,
    Armchair,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { MobileNav } from "@/components/admin/MobileNav";
import {
    employees,
    initialSectionWaiters,
    initialTables,
    TABLE_SECTIONS,
    type BarTable,
    type TableSection,
    type TableStatus,
} from "@/data/mockData";
import { toast } from "sonner";

const STATUS_MAP: Record<number, TableStatus> = {
    0: "libre",
    1: "ocupada",
    2: "apartada",
};

const emptyForm = {
    number: "",
    section: "" as TableSection,
    capacity: "",
};

const emptyReservation = { name: "", time: "", date: "" };

const statusBadge: Record<TableStatus, { label: string; className: string }> = {
    libre: {
        label: "Libre",
        className: "bg-muted/40 text-muted-foreground border-border mt-1",
    },
    ocupada: {
        label: "Ocupada",
        className: "bg-primary/15 text-primary mt-1",
    },
    apartada: {
        label: "Apartada",
        className: "bg-primary/15 text-primary mt-1",
    },
};

const Tables = () => {
    const [tables, setTables] = useState<BarTable[]>(initialTables);
    const [sectionWaiters, setSectionWaiters] =
        useState<Record<TableSection, number | null>>(initialSectionWaiters);
    const [expanded, setExpanded] = useState<number | null>(null);

    // Create/edit dialog
    const [tableDialogOpen, setTableDialogOpen] = useState(false);
    const [editing, setEditing] = useState<BarTable | null>(null);
    const [form, setForm] = useState(emptyForm);

    // Assign waiter dialog
    const [assignDialogOpen, setAssignDialogOpen] = useState(false);
    const [assigning, setAssigning] = useState<BarTable | null>(null);
    const [assignWaiterId, setAssignWaiterId] = useState<string>("");

    // Reservation dialog
    const [reservationDialogOpen, setReservationDialogOpen] = useState(false);
    const [reserving, setReserving] = useState<BarTable | null>(null);
    const [reservationForm, setReservationForm] = useState(emptyReservation);

    const waiterName = (id: number | null) =>
        id ? employees.find((e) => e.id === id)?.name ?? "—" : "Sin asignar";

    const sectionLabel = (key: TableSection) =>
        TABLE_SECTIONS.find((s) => s.key === key)?.label ?? key;

    const sortedTables = useMemo(
        () =>
            [...tables].sort(
                (a, b) =>
                    a.section.localeCompare(b.section) || a.number - b.number,
            ),
        [tables],
    );

    const availableCount = tables.filter((t) => t.status === "libre").length;

    // ── Table CRUD ───────────────────────────────────────────
    const openNewTable = () => {
        setEditing(null);
        setForm(emptyForm);
        setTableDialogOpen(true);
    };

    const openEditTable = (t: BarTable) => {
        setEditing(t);
        setForm({
            number: String(t.number),
            section: t.section,
            capacity: String(t.capacity || 4)
        });
        setTableDialogOpen(true);
    };

    const saveTable = () => {
        const num = parseInt(form.number, 10);
        const cap = parseInt(form.capacity, 10);

        if (!num || num <= 0) return toast.error("Número de mesa inválido");
        if (!cap || cap <= 0) return toast.error("La capacidad debe ser mayor a 0");
        if (!form.section) return toast.error("Selecciona una sección");

        if (tables.some((t) => t.number === num && t.id !== editing?.id)) {
            return toast.error("Esa mesa ya existe");
        }

        if (editing) {
            setTables((prev) =>
                prev.map((t) =>
                    t.id === editing.id ? { ...t, number: num, section: form.section, capacity: cap } : t,
                ),
            );
            toast.success("Mesa actualizada");
        } else {
            setTables((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    number: num,
                    capacity: cap,
                    section: form.section,
                    status: STATUS_MAP[0],
                    waiterId: initialSectionWaiters[form.section] ?? null,
                },
            ]);
            toast.success("Mesa creada");
        }
        setTableDialogOpen(false);
    };

    const updateTableStatus = (id: number, statusInt: number, extra = {}) => {
        setTables((prev) =>
            prev.map((t) =>
                t.id === id
                    ? { ...t, status: STATUS_MAP[statusInt], ...extra }
                    : t
            )
        );
    };

    const removeTable = (id: number) => {
        setTables((prev) => prev.filter((t) => t.id !== id));
        setExpanded(null);
        toast.success("Mesa eliminada");
    };

    const setOccupied = (t: BarTable) => {
        setTables((prev) =>
            prev.map((x) =>
                x.id === t.id
                    ? { ...x, status: "ocupada", reservationName: undefined, reservationDate: undefined, reservationTime: undefined }
                    : x,
            ),
        );
        toast.success(`Mesa ${t.number} asignada a clientes`);
    };

    const setFree = (t: BarTable) => {
        setTables((prev) =>
            prev.map((x) =>
                x.id === t.id
                    ? { ...x, status: "libre", reservationName: undefined, reservationDate: undefined, reservationTime: undefined }
                    : x,
            ),
        );
        toast.success(`Mesa ${t.number} liberada`);
    };

    const openReservation = (t: BarTable) => {
        setReserving(t);
        setReservationForm({
            name: t.reservationName ?? "",
            time: t.reservationTime ?? "",
            date: t.reservationDate ?? "",
        });
        setReservationDialogOpen(true);
    };

    const saveReservation = () => {
        if (!reserving) return;
        const name = reservationForm.name.trim();
        if (!name) {
            toast.error("El nombre del cliente es obligatorio");
            return;
        }
        if (!reservationForm.date) {
            toast.error("El día de la reservación es obligatorio");
            return;
        }
        if (!reservationForm.time) {
            toast.error("La hora de la reservación es obligatoria");
            return;
        }
        setTables((prev) =>
            prev.map((x) =>
                x.id === reserving.id
                    ? {
                        ...x,
                        status: "apartada",
                        reservationName: name,
                        reservationDate: reservationForm.date,
                        reservationTime: reservationForm.time,
                    }
                    : x,
            ),
        );
        toast.success(`Mesa ${reserving.number} apartada para ${name}`);
        setReservationDialogOpen(false);
    };

    const openAssignWaiter = (t: BarTable) => {
        setAssigning(t);
        setAssignWaiterId(t.waiterId ? String(t.waiterId) : "none");
        setAssignDialogOpen(true);
    };

    const saveAssignWaiter = () => {
        if (!assigning) return;
        const waiterId =
            assignWaiterId && assignWaiterId !== "none"
                ? parseInt(assignWaiterId, 10)
                : null;
        setTables((prev) =>
            prev.map((t) => (t.id === assigning.id ? { ...t, waiterId } : t)),
        );
        toast.success(`Mesero asignado a mesa ${assigning.number}`);
        setAssignDialogOpen(false);
    };

    const formatDate = (date?: string) => {
        if (!date) return "—";
        const [year, month, day] = date.split("-");
        return `${day}-${month}-${year}`;
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
                                Mesas
                            </h1>
                        </div>
                        <Button
                            onClick={openNewTable}
                            className="gold-glow hover:scale-[1.02] transition-transform"
                        >
                            <Plus className="w-4 h-4 mr-2" /> Agregar Mesa
                        </Button>
                    </div>

                    {tables.length === 0 ? (
                        <div className="flex justify-center py-20">
                            Aún no hay mesas registradas.
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {sortedTables.map((t) => {
                                const badge = statusBadge[t.status];
                                const isOpen = expanded === t.id;
                                return (
                                    <div key={t.id} className="glass-card p-5 hover:border-primary/30 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                                                    <Armchair className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-foreground">Mesa {t.number}</h3>
                                                    <div className="flex gap-2 items-center">
                                                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">{sectionLabel(t.section)}</span>

                                                        <Badge className={badge.className}>
                                                            {badge.label}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost" size="sm" onClick={() => setExpanded(isOpen ? null : t.id)}
                                                className="text-muted-foreground hover:text-primary">
                                                {isOpen ? (
                                                    <ChevronUp className="w-4 h-4" />
                                                ) : (
                                                    <ChevronDown className="w-4 h-4" />
                                                )}
                                                <span className="ml-1 text-xs">Detalles</span>
                                            </Button>
                                        </div>

                                        {isOpen && (
                                            <div className="mt-3 pt-3 border-t border-border space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                                <p className="text-sm text-muted-foreground">Mesero: <span className="text-foreground">{waiterName(t.waiterId)}</span></p>
                                                <p className="text-sm text-muted-foreground">Capacidad: <span className="text-foreground">{t.capacity || 4} personas</span></p>
                                                {t.status === "apartada" && (
                                                    <>
                                                        <p className="text-sm text-foreground uppercase">Reservación </p>
                                                        <p className="text-sm text-muted-foreground">- Nombre: <span className="text-foreground">{t.reservationName}</span></p>
                                                        <p className="text-sm text-muted-foreground">
                                                            - Día: <span className="text-foreground">{formatDate(t.reservationDate)}</span>
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">- Hora: <span className="text-foreground">{t.reservationTime}</span></p>
                                                    </>
                                                )}

                                                <div className="flex flex-wrap gap-2 pt-2">
                                                    {t.status !== "ocupada" && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setOccupied(t)}
                                                        >
                                                            Asignar a clientes
                                                        </Button>
                                                    )}
                                                    {t.status !== "libre" && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setFree(t)}
                                                        >
                                                            Liberar
                                                        </Button>
                                                    )}
                                                    {t.status !== "apartada" && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => openReservation(t)}
                                                        >
                                                            Apartar
                                                        </Button>
                                                    )}
                                                    {t.status === "apartada" && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => openReservation(t)}
                                                        >Editar reserva
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => openAssignWaiter(t)}
                                                    >
                                                        Cambiar mesero
                                                    </Button>
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        onClick={() => openEditTable(t)}
                                                    >
                                                        <Pencil className="w-3 h-3 mr-1" /> Editar
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => removeTable(t.id)}
                                                        className="text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                                                    >
                                                        <Trash2 className="w-3 h-3 mr-1" /> Eliminar
                                                    </Button>
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

            {/* Table create/edit dialog */}
            <Dialog open={tableDialogOpen} onOpenChange={setTableDialogOpen}>
                <DialogContent className="bg-card border-border">
                    <DialogHeader>
                        <DialogTitle className="text-foreground font-display">
                            {editing ? "Editar mesa" : "Nueva mesa"}
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Las mesas nuevas se crean como libres y heredan el mesero de la sección.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-muted-foreground">Número</Label>
                            <Input placeholder="Ej: 1" type="number" value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-muted-foreground">Capacidad</Label>
                            <Input placeholder="Ej: 4" type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-muted-foreground">Sección</Label>
                        <Select value={form.section} onValueChange={(v) => setForm({ ...form, section: v as TableSection })}>
                            <SelectTrigger className="bg-muted/50 border-border"><SelectValue placeholder="Elija una sección" /></SelectTrigger>
                            <SelectContent className="bg-card border-border">
                                {TABLE_SECTIONS.map((s) => <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter className="mt-2">
                        <Button variant="outline" onClick={() => setTableDialogOpen(false)} className="border-border text-muted-foreground">Cancelar</Button>
                        <Button onClick={saveTable} className="gold-glow">{editing ? "Guardar Cambios" : "Agregar Mesa"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reservation dialog */}
            <Dialog open={reservationDialogOpen} onOpenChange={setReservationDialogOpen}>
                <DialogContent className="bg-card border-border">
                    <DialogHeader>
                        <DialogTitle className="text-foreground font-display">
                            Apartar mesa {reserving?.number}
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Registra a nombre de quién y a qué hora se aparta esta mesa.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label className="text-muted-foreground">Nombre del cliente *</Label>
                            <Input
                                value={reservationForm.name}
                                onChange={(e) =>
                                    setReservationForm((f) => ({ ...f, name: e.target.value }))
                                }
                                placeholder="Ej: Carlos Mendoza"
                                maxLength={100}
                                className="bg-muted/50 border-border"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-muted-foreground">Día *</Label>
                            <Input
                                type="date"
                                value={reservationForm.date}
                                onChange={(e) =>
                                    setReservationForm((f) => ({ ...f, date: e.target.value }))
                                }
                                className="bg-muted/50 border-border"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-muted-foreground">Hora *</Label>
                            <Input
                                type="time"
                                value={reservationForm.time}
                                onChange={(e) =>
                                    setReservationForm((f) => ({ ...f, time: e.target.value }))
                                }
                                className="bg-muted/50 border-border"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setReservationDialogOpen(false)}
                            className="border-border text-muted-foreground"
                        >
                            Cancelar
                        </Button>
                        <Button onClick={saveReservation} className="gold-glow">
                            Guardar reserva
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Assign waiter dialog */}
            <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
                <DialogContent className="bg-card border-border">
                    <DialogHeader>
                        <DialogTitle className="text-foreground font-display">
                            Mesero — Mesa {assigning?.number}
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Selecciona el mesero asignado a esta mesa específica.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2 py-2">
                        <Label className="text-muted-foreground">Mesero</Label>
                        <Select value={assignWaiterId} onValueChange={setAssignWaiterId}>
                            <SelectTrigger className="bg-muted/50 border-border">
                                <SelectValue placeholder="Sin asignar" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Sin asignar</SelectItem>
                                {employees.map((e) => (
                                    <SelectItem key={e.id} value={String(e.id)}>
                                        {e.name} — {e.position}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setAssignDialogOpen(false)}
                            className="border-border text-muted-foreground"
                        >
                            Cancelar
                        </Button>
                        <Button onClick={saveAssignWaiter} className="gold-glow">
                            Asignar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Tables;