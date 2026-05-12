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
import { MOCK_PRODUCTS } from "@/data/mockData";

// Tipos de Datos
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

    // effect 1: CARGA DE DATOS
    useEffect(() => {
        setProducts(MOCK_PRODUCTS);
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

        const getMesas = async () => {
            if (!user?.idSucursal) return;
            try {
                const res = await fetch(`${urlbase}/admin/sections/branch/${user.idSucursal}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                const data = await res.json();
                setTables(data);
            } catch (e) {
                setTables([]);
            }
        };

        getMesas();
        fetchHorarios();
    }, [user?.idEmpleado, user?.idSucursal]);


    // effect 2: LÓGICA DE LA COMANDA
    useEffect(() => {
        setOrderDraft([]);
        setProductPicker("");
    }, [selectedTableId]);

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
        if (!selectedTableId) return;

        try {
            // Cambiamos el estado en la DB
            const response = await fetch(`${urlbase}/employee/tables/${selectedTableId}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ estado: 0 }) // 0 = Ocupado / En uso
            });

            if (!response.ok) throw new Error("Error al ocupar la mesa");

            // Feedback de la comanda
            const mesaNumber = tables.flatMap(s => s.mesasCompletas).find(m => m._id === selectedTableId)?.numeroMesa;

            toast.success(`¡Comanda enviada!`, {
                description: `Mesa ${mesaNumber} ocupada. Total: ${formatMxn(draftTotal)}`
            });

            setTables(prev => prev.map(seccion => ({
                ...seccion,
                mesasCompletas: seccion.mesasCompletas.map((m: any) =>
                    m._id === selectedTableId ? { ...m, estado: 0 } : m
                )
            })));

            // Limpiar comanda
            setOrderDraft([]);
            setSelectedTableId(null);

        } catch (error) {
            toast.error("Error al procesar la comanda");
            console.error(error);
        }
    };

    const releaseTable = async () => {
        if (!selectedTableId) return;

        try {
            const response = await fetch(`${urlbase}/employee/tables/${selectedTableId}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ estado: 1 }) // 1 = Libre
            });

            if (!response.ok) throw new Error("Error al liberar la mesa");

            toast.success("Mesa liberada", {
                description: "La cuenta ha sido cerrada y la mesa está disponible."
            });

            // Actualizamos el estado local de 'tables' para que se vea verde
            setTables(prev => prev.map(seccion => ({
                ...seccion,
                mesasCompletas: seccion.mesasCompletas.map((m: any) =>
                    m._id === selectedTableId ? { ...m, estado: 1 } : m
                )
            })));

            setSelectedTableId(null);
        } catch (error) {
            toast.error("No se pudo liberar la mesa");
        }
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
                                <span className="text-[10px] font-mono text-muted-foreground uppercase">
                                    {tables.reduce((acc, seccion) => acc + seccion.mesasCompletas.length, 0)} Mesas Activas
                                </span>
                            </div>

                            {tables.length === 0 ? (
                                <div className="h-64 flex flex-col items-center justify-center border border-dashed border-border rounded-2xl bg-muted/10">
                                    <Armchair className="w-12 h-12 text-muted-foreground/20 mb-3" />
                                    <p className="text-sm text-muted-foreground">Cargando disposición de salón...</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-1 gap-3">
                                    {tables.map((seccion) => (
                                        // Iteramos por cada sección recibida
                                        <div key={seccion._id} className="mb-8">
                                            {/* Título de la sección para organizar la vista */}
                                            <h3 className="text-primary font-display mb-4 uppercase tracking-widest text-sm">
                                                {seccion.nombre}
                                            </h3>

                                            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-3 gap-4">
                                                {seccion.mesasCompletas.map((mesa) => (
                                                    // Iteramos por cada mesa dentro de la sección
                                                    <button
                                                        key={mesa._id}
                                                        onClick={() => setSelectedTableId(mesa._id)}
                                                        className={`relative group p-4 rounded-2xl border transition-all duration-300 ${selectedTableId === mesa._id
                                                            ? "bg-primary border-primary text-black shadow-gold"
                                                            : "bg-card/40 border-border hover:border-primary/50"
                                                            }`}
                                                    >
                                                        <div className="flex flex-col items-center gap-2">
                                                            <Armchair className={`w-6 h-6 ${selectedTableId === mesa._id ? "text-black" : "text-primary"}`} />

                                                            <span className="font-display text-lg uppercase tracking-tighter">
                                                                Mesa {mesa.numeroMesa}
                                                            </span>

                                                            <Badge className={`text-[9px] pointer-events-none ${mesa.estado === 0
                                                                ? "bg-red-500/20 text-red-500 border-none"
                                                                : "bg-green-500/20 text-green-500 border-none"
                                                                }`}>
                                                                {mesa.estado === 0 ? "En uso" : "Libre"}
                                                            </Badge>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Panel de Comanda (Ticket) */}
                        <div className="glass-card p-0 flex flex-col border-primary/20">
                            <div className="p-6 border-b border-border bg-primary/5">
                                <h3 className="font-display text-lg uppercase tracking-widest text-primary flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    {(() => {
                                        const mesa = tables.flatMap(s => s.mesasCompletas).find(m => m._id === selectedTableId);
                                        return mesa?.estado === 0 ? "Estado de Cuenta" : "Comanda Nueva";
                                    })()}
                                </h3>
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                {!selectedTableId ? (
                                    /* ESCENARIO 1: NO HAY MESA SELECCIONADA */
                                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3 opacity-40">
                                        <Plus className="w-10 h-10" />
                                        <p className="text-sm uppercase font-bold tracking-tighter">Selecciona mesa para operar</p>
                                    </div>
                                ) : (
                                    /* ESCENARIO 2: HAY UNA MESA SELECCIONADA, VERIFICAMOS SU ESTADO */
                                    (() => {
                                        const mesaActual = tables.flatMap(s => s.mesasCompletas).find(m => m._id === selectedTableId);
                                        const estaOcupada = mesaActual?.estado === 0;

                                        if (estaOcupada) {
                                            /* SUB-ESCENARIO A: LA MESA ESTÁ OCUPADA -> MOSTRAR OPCIÓN DE LIBERAR */
                                            return (
                                                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
                                                    <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                                                        <BadgeCheck className="w-10 h-10 text-red-500" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <h4 className="text-xl font-display uppercase tracking-tighter">Mesa {mesaActual.numeroMesa} Ocupada</h4>
                                                        <p className="text-xs text-muted-foreground px-6">
                                                            Esta mesa tiene una cuenta activa en el sistema. ¿Deseas finalizar el servicio?
                                                        </p>
                                                    </div>
                                                    <div className="w-full space-y-3 pt-4">
                                                        <Button
                                                            onClick={releaseTable}
                                                            variant="destructive"
                                                            className="w-full py-6 font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-red-900/20"
                                                        >
                                                            Liberar Mesa / Cerrar Cuenta
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            onClick={() => setSelectedTableId(null)}
                                                            className="w-full text-[10px] uppercase tracking-widest opacity-50 hover:opacity-100"
                                                        >
                                                            Volver al mapa
                                                        </Button>
                                                    </div>
                                                </div>
                                            );
                                        }

                                        /* SUB-ESCENARIO B: LA MESA ESTÁ LIBRE -> MOSTRAR SELECTOR DE PRODUCTOS */
                                        return (
                                            <div className="flex flex-col h-full gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                                <div className="flex gap-2">
                                                    <Select value={productPicker} onValueChange={setProductPicker}>
                                                        <SelectTrigger className="bg-muted/50 border-border">
                                                            <SelectValue placeholder="Buscar ítem..." />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {products.map((p) => (
                                                                <SelectItem key={p.id} value={p.id}>
                                                                    {p.name} — {formatMxn(p.unitPrice)}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <Button onClick={addProductToDraft} size="icon" className="gold-glow shrink-0">
                                                        <Plus className="w-4 h-4" />
                                                    </Button>
                                                </div>

                                                <div className="flex-1 space-y-3 overflow-y-auto pr-1 max-h-[350px] custom-scrollbar">
                                                    {orderDraft.length > 0 ? (
                                                        orderDraft.map((l) => {
                                                            const p = products.find(pp => pp.id === l.productId);
                                                            return (
                                                                <div key={l.productId} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50 group hover:border-primary/30 transition-colors">
                                                                    <div className="max-w-[140px]">
                                                                        <p className="text-xs font-bold uppercase truncate">{p?.name}</p>
                                                                        <p className="text-[10px] text-primary">{formatMxn(p?.unitPrice || 0)}</p>
                                                                    </div>
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="flex items-center bg-background rounded-lg border border-border">
                                                                            <button onClick={() => updateQty(l.productId, -1)} className="p-1 px-2 hover:text-primary transition-colors">
                                                                                <Minus className="w-3 h-3" />
                                                                            </button>
                                                                            <span className="text-xs font-bold w-5 text-center">{l.quantity}</span>
                                                                            <button onClick={() => updateQty(l.productId, 1)} className="p-1 px-2 hover:text-primary transition-colors">
                                                                                <Plus className="w-3 h-3" />
                                                                            </button>
                                                                        </div>
                                                                        <button onClick={() => updateQty(l.productId, -99)} className="text-muted-foreground hover:text-destructive transition-colors">
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })
                                                    ) : (
                                                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground/30 py-10">
                                                            <UtensilsCrossed className="w-12 h-12 mb-2" />
                                                            <p className="text-[10px] uppercase tracking-widest">Lista vacía</p>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="space-y-4 pt-4 border-t border-border">
                                                    <div className="flex justify-between items-end">
                                                        <span className="text-[10px] uppercase font-bold text-muted-foreground">Subtotal Servicio</span>
                                                        <span className="font-display text-3xl text-gradient-gold">{formatMxn(draftTotal)}</span>
                                                    </div>
                                                    <Button
                                                        className="w-full gold-glow py-6 font-bold uppercase tracking-widest text-xs"
                                                        onClick={saveOrder}
                                                        disabled={orderDraft.length === 0}
                                                    >
                                                        Enviar a Cocina (Mesa {tables.flatMap(s => s.mesasCompletas).find(m => m._id === selectedTableId)?.numeroMesa})
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })()
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