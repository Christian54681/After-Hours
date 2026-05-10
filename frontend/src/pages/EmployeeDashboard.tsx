import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    Wine, LogOut, Armchair, Clock, MapPin, BadgeCheck, Plus, Minus,
    Trash2, CalendarClock, AlertCircle, User, Briefcase, Mail, Phone,
    Hash, Calendar, UtensilsCrossed
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

// --- Tipos de Datos ---
interface OrderLine {
    productId: string;
    quantity: number;
    name?: string;
    price?: number;
}

interface Shift {
    startTime: string;
    endTime: string;
    days: string[];
    branch: string;
}

const formatMxn = (n: number) =>
    n.toLocaleString("es-MX", { style: "currency", currency: "MXN" });

const EmployeeDashboard = () => {
    const { user, logout } = useAuth();
    const [myShifts, setMyShifts] = useState<Shift[]>([]);
    const [loadingShift, setLoadingShift] = useState(true);
    const [tables, setTables] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
    const [orderDraft, setOrderDraft] = useState<OrderLine[]>([]);
    const [productPicker, setProductPicker] = useState<string>("");

    const urlbase = "http://localhost:3000/api";

    useEffect(() => {
        const fetchHorarios = async () => {
            if (!user?.idEmpleado || user.idEmpleado === "S/N") return;
            try {
                setLoadingShift(true);
                const response = await fetch(`${urlbase}/admin/horarios/${user.idEmpleado}`);
                if (!response.ok) throw new Error("Horarios no encontrados");
                const data = await response.json();
                const formattedShifts = Array.isArray(data) ? data.map((item: any) => ({
                    startTime: item.entrada || "00:00",
                    endTime: item.salida || "00:00",
                    days: item.dias || [],
                    branch: "Sucursal " + (item.sucursalId?.substring(0, 5) || "Principal")
                })) : [];
                setMyShifts(formattedShifts);
            } catch (e) {
                setMyShifts([]);
            } finally {
                setLoadingShift(false);
            }
        };
        fetchHorarios();
    }, [user?.idEmpleado]);

    const weekDays = [
        { key: "mon", label: "L" }, { key: "tue", label: "M" },
        { key: "wed", label: "M" }, { key: "thu", label: "J" },
        { key: "fri", label: "V" }, { key: "sat", label: "S" },
        { key: "sun", label: "D" },
    ];

    const draftTotal = useMemo(() =>
        orderDraft.reduce((sum, line) => {
            const p = products.find((pp) => pp.id === line.productId);
            return sum + (p ? p.unitPrice * line.quantity : 0);
        }, 0)
        , [orderDraft, products]);

    const addProductToDraft = () => {
        if (!productPicker) return toast.error("Selecciona un producto.");
        setOrderDraft((prev) => {
            const found = prev.find((l) => l.productId === productPicker);
            if (found) {
                return prev.map((l) => l.productId === productPicker ? { ...l, quantity: l.quantity + 1 } : l);
            }
            return [...prev, { productId: productPicker, quantity: 1 }];
        });
        setProductPicker("");
    };

    const updateQty = (productId: string, delta: number) => {
        setOrderDraft((prev) =>
            prev.map((l) => l.productId === productId ? { ...l, quantity: l.quantity + delta } : l)
                .filter((l) => l.quantity > 0)
        );
    };

    const saveOrder = async () => {
        toast.success(`Comanda enviada a cocina - Mesa ${tables.find(t => t.id === selectedTableId)?.number}`);
        setOrderDraft([]);
        setSelectedTableId(null);
    };

    return (
        <div className="min-h-screen bg-background text-foreground pb-10">
            {/* Header Refinado */}
            <header className="border-b border-border bg-card/40 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-gold p-[1px]">
                                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                                    <Wine className="w-5 h-5 text-primary" />
                                </div>
                            </div>
                            <div>
                                <h1 className="font-display text-xl tracking-tight text-gradient-gold">AfterHours</h1>
                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Workspace</p>
                            </div>
                        </div>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={logout} className="hover:bg-destructive/10 hover:text-destructive gap-2 transition-colors">
                        <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Cerrar Sesión</span>
                    </Button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">

                {/* SECCIÓN 1: PERFIL (Ancho completo) */}
                <section className="glass-card relative overflow-hidden group p-8 flex flex-col md:flex-row gap-8 items-center md:items-start transition-all hover:border-primary/30">
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

                    <div className="relative">
                        <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-primary/20 to-transparent border border-primary/20 flex items-center justify-center backdrop-blur-sm">
                            <User className="w-16 h-16 text-primary/60" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-background border border-border p-1.5 rounded-xl shadow-2xl">
                            <div className={`w-4 h-4 rounded-full ${user?.activo ? 'bg-green-500 animate-pulse' : (user ? 'bg-green-500 animate-pulse' : 'bg-muted')}`} />
                        </div>
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-6">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-black mb-2">Personal Autorizado</p>
                                <h2 className="font-display text-5xl tracking-tighter uppercase">{user?.nombreCompleto}</h2>
                                <p className="text-muted-foreground font-mono text-sm">@{user?.username} — {user?.idEmpleado?.substring(0, 8)}</p>
                            </div>
                            <Badge className="bg-primary/10 text-primary border-primary/20 px-6 py-1.5 text-sm font-bold uppercase tracking-widest">
                                {user?.tipoRol}
                            </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-border/50">
                            <div className="space-y-1">
                                <p className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1.5"><MapPin className="w-3 h-3 text-primary" /> Zona</p>
                                <p className="text-sm font-medium">{user?.zonaAsignada || "Sin área"}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1.5"><Mail className="w-3 h-3 text-primary" /> Email</p>
                                <p className="text-sm font-medium">{user?.email}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1.5"><Phone className="w-3 h-3 text-primary" /> Teléfono</p>
                                <p className="text-sm font-medium">{user?.telefono || "N/A"}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1.5"><Calendar className="w-3 h-3 text-primary" /> Ingreso</p>
                                <p className="text-sm font-medium">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECCIÓN 2: GRID DE OPERACIONES */}
                <section className="grid gap-8 lg:grid-cols-[350px_1fr]">

                    {/* COLUMNA IZQUIERDA: HORARIOS */}
                    <aside className="space-y-6">
                        <div className="glass-card p-6 border-t-2 border-t-primary">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-display text-lg uppercase tracking-tight">Horarios</h3>
                                <CalendarClock className="w-5 h-5 text-primary opacity-70" />
                            </div>

                            <div className="space-y-4">
                                {loadingShift ? (
                                    <div className="space-y-3 animate-pulse">
                                        <div className="h-20 bg-muted/50 rounded-xl" />
                                        <div className="h-20 bg-muted/50 rounded-xl" />
                                    </div>
                                ) : myShifts.length > 0 ? (
                                    myShifts.map((turno, idx) => (
                                        <div key={idx} className="p-4 rounded-xl bg-muted/30 border border-border/50 group hover:border-primary/40 transition-colors">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Turno</p>
                                                    <div className="flex items-center gap-2 font-display text-xl">
                                                        <span>{turno.startTime}</span>
                                                        <span className="text-primary text-xs opacity-50">—</span>
                                                        <span>{turno.endTime}</span>
                                                    </div>
                                                </div>
                                                <Badge variant="outline" className="text-[9px] border-primary/20 text-primary">{turno.branch}</Badge>
                                            </div>
                                            <div className="flex justify-between gap-1">
                                                {weekDays.map((day) => {
                                                    const isActive = turno.days?.includes(day.key);
                                                    return (
                                                        <div key={day.key} className={`flex-1 h-7 rounded-md flex items-center justify-center text-[10px] font-bold border transition-all ${isActive ? "bg-primary text-black border-primary shadow-[0_0_10px_rgba(var(--primary),0.3)]" : "bg-transparent text-muted-foreground/40 border-border"}`}>
                                                            {day.label}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6 border border-dashed border-border rounded-xl">
                                        <AlertCircle className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                                        <p className="text-xs text-muted-foreground">Sin horarios asignados</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </aside>

                    {/* COLUMNA DERECHA: MESAS Y COMANDA */}
                    <div className="grid gap-8 md:grid-cols-[1fr_400px]">

                        {/* Listado de Mesas */}
                        <div className="glass-card p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <UtensilsCrossed className="w-5 h-5 text-primary" />
                                    <h3 className="font-display text-xl uppercase tracking-tighter">Área de Servicio</h3>
                                </div>
                                <span className="text-[10px] font-mono text-muted-foreground uppercase">{tables.length} Mesas Activas</span>
                            </div>

                            {tables.length === 0 ? (
                                <div className="h-64 flex flex-col items-center justify-center border border-dashed border-border rounded-2xl bg-muted/10">
                                    <Armchair className="w-12 h-12 text-muted-foreground/20 mb-3" />
                                    <p className="text-sm text-muted-foreground">Cargando disposición de salón...</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {tables.map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => setSelectedTableId(t.id)}
                                            className={`relative group p-4 rounded-2xl border transition-all duration-300 ${selectedTableId === t.id ? "bg-primary border-primary text-black shadow-gold" : "bg-card/40 border-border hover:border-primary/50"}`}
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <Armchair className={`w-6 h-6 ${selectedTableId === t.id ? "text-black" : "text-primary"}`} />
                                                <span className="font-display text-lg uppercase tracking-tighter">Mesa {t.number}</span>
                                                <Badge className={`text-[9px] pointer-events-none ${t.status === "ocupada" ? "bg-red-500/20 text-red-500 border-none" : "bg-green-500/20 text-green-500 border-none"}`}>
                                                    {t.status === "ocupada" ? "En uso" : "Libre"}
                                                </Badge>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Panel de Comanda (Ticket) */}
                        <div className="glass-card p-0 flex flex-col border-primary/20">
                            <div className="p-6 border-b border-border bg-primary/5">
                                <h3 className="font-display text-lg uppercase tracking-widest text-primary flex items-center gap-2">
                                    <Clock className="w-4 h-4" /> Comanda Nueva
                                </h3>
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                {!selectedTableId ? (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3 opacity-40">
                                        <Plus className="w-10 h-10" />
                                        <p className="text-sm uppercase font-bold tracking-tighter">Selecciona mesa para ordenar</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col h-full gap-6">
                                        <div className="flex gap-2">
                                            <Select value={productPicker} onValueChange={setProductPicker}>
                                                <SelectTrigger className="bg-muted/50 border-border">
                                                    <SelectValue placeholder="Buscar ítem..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {products.map((p) => (
                                                        <SelectItem key={p.id} value={p.id}>{p.name} — {formatMxn(p.unitPrice)}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <Button onClick={addProductToDraft} size="icon" className="gold-glow shrink-0"><Plus className="w-4 h-4" /></Button>
                                        </div>

                                        <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                                            {orderDraft.map((l) => {
                                                const p = products.find(pp => pp.id === l.productId);
                                                return (
                                                    <div key={l.productId} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50">
                                                        <div className="max-w-[140px]">
                                                            <p className="text-xs font-bold uppercase truncate">{p?.name}</p>
                                                            <p className="text-[10px] text-primary">{formatMxn(p?.unitPrice || 0)}</p>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex items-center bg-background rounded-lg border border-border">
                                                                <button onClick={() => updateQty(l.productId, -1)} className="p-1 px-2 hover:text-primary transition-colors"><Minus className="w-3 h-3" /></button>
                                                                <span className="text-xs font-bold w-5 text-center">{l.quantity}</span>
                                                                <button onClick={() => updateQty(l.productId, 1)} className="p-1 px-2 hover:text-primary transition-colors"><Plus className="w-3 h-3" /></button>
                                                            </div>
                                                            <button onClick={() => updateQty(l.productId, -99)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className="space-y-4 pt-4 border-t border-border">
                                            <div className="flex justify-between items-end">
                                                <span className="text-[10px] uppercase font-bold text-muted-foreground">Subtotal Servicio</span>
                                                <span className="font-display text-3xl text-gradient-gold">{formatMxn(draftTotal)}</span>
                                            </div>
                                            <Button className="w-full gold-glow py-6 font-bold uppercase tracking-widest text-xs" onClick={saveOrder} disabled={orderDraft.length === 0}>
                                                Enviar a Cocina
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default EmployeeDashboard;