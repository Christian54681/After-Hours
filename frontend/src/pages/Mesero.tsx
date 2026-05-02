import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Wine, LogOut, Armchair, Clock, MapPin, BadgeCheck, Plus, Minus, Trash2, CalendarClock, AlertCircle } from "lucide-react";
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
    const { user } = useAuth();
    const [myShifts, setMyShifts] = useState<Shift[]>([]); // Estado como Array
    const [loadingShift, setLoadingShift] = useState(true);

    // --- ESTADOS PARA APIS ---
    const [tables, setTables] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // --- ESTADOS DE INTERFAZ ---
    const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
    const [orderDraft, setOrderDraft] = useState<OrderLine[]>([]);
    const [productPicker, setProductPicker] = useState<string>("");

    const urlbase = "http://localhost:3000/api";

    // 1. Carga de Horarios (Múltiples)
    useEffect(() => {
        const fetchHorarios = async () => {
            if (!user?.idEmpleado || user.idEmpleado === "S/N") return;

            try {
                setLoadingShift(true);
                const response = await fetch(`${urlbase}/admin/horarios/${user.idEmpleado}`);

                if (!response.ok) throw new Error("Horarios no encontrados");

                const data = await response.json();

                // Validamos que sea un array y mapeamos los campos de la DB a la UI
                const formattedShifts = Array.isArray(data) ? data.map((item: any) => ({
                    startTime: item.entrada || "00:00",
                    endTime: item.salida || "00:00",
                    days: item.dias || [],
                    branch: "Sucursal " + (item.sucursalId?.substring(0, 5) || "Principal")
                })) : [];

                setMyShifts(formattedShifts);
            } catch (e) {
                console.error("Error al traer horarios:", e);
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

    // 2. Lógica de Pedidos
    const selectedTable = useMemo(() =>
        tables.find((t) => t.id === selectedTableId) || null
    , [tables, selectedTableId]);

    const draftTotal = useMemo(() =>
        orderDraft.reduce((sum, line) => {
            const p = products.find((pp) => pp.id === line.productId);
            return sum + (p ? p.unitPrice * line.quantity : 0);
        }, 0)
    , [orderDraft, products]);

    const addProductToDraft = () => {
        if (!productPicker) return toast.error("Selecciona un producto.");
        const product = products.find(p => p.id === productPicker);
        if (!product) return;

        setOrderDraft((prev) => {
            const found = prev.find((l) => l.productId === productPicker);
            if (found) {
                return prev.map((l) =>
                    l.productId === productPicker ? { ...l, quantity: l.quantity + 1 } : l
                );
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
        if (!selectedTable || orderDraft.length === 0) return;
        try {
            toast.success(`Pedido guardado para Mesa ${selectedTable.number}`);
            setOrderDraft([]);
            setSelectedTableId(null);
        } catch (error) {
            toast.error("Error al guardar pedido");
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                            <Wine className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-wider text-muted-foreground">Panel de operación</p>
                            <h1 className="font-display text-xl text-gradient-gold leading-none">BarManager</h1>
                        </div>
                    </div>
                    <Link to="/">
                        <Button variant="ghost" size="sm" className="gap-2">
                            <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Cerrar Sesión</span>
                        </Button>
                    </Link>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
                <section className="grid gap-6 md:grid-cols-2">
                    {/* Perfil del Empleado */}
                    <div className="glass-card p-6 flex flex-col justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Perfil de Usuario</p>
                            <h2 className="font-display text-3xl text-foreground">
                                {user?.nombreCompleto || "Usuario"}
                                <span className="text-sm font-sans text-muted-foreground ml-2">@{user?.username}</span>
                            </h2>

                            <div className="mt-4 grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <BadgeCheck className="w-4 h-4 text-primary" />
                                    <span>{user?.tipoRol || "Staff"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    <span>{user?.zonaAsignada === "Sin zona" ? "Pendiente" : user.zonaAsignada}</span>
                                </div>
                                <div className="col-span-2 mt-2">
                                    <Badge variant={user?.activo ? "outline" : "destructive"} className="text-[10px]">
                                        Status: {user?.estado || "Activo"}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sección de Horarios Múltiples */}
                    <div className="glass-card p-6 border-l-4 border-l-primary overflow-hidden">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xs uppercase tracking-wider text-muted-foreground">Jornadas Asignadas</p>
                            <CalendarClock className="w-4 h-4 text-primary" />
                        </div>

                        <div className="space-y-4 max-h-[180px] overflow-y-auto pr-2 scrollbar-thin">
                            {loadingShift ? (
                                <div className="animate-pulse space-y-3">
                                    <div className="h-12 bg-muted rounded-lg w-full"></div>
                                    <div className="h-12 bg-muted rounded-lg w-full"></div>
                                </div>
                            ) : myShifts.length > 0 ? (
                                myShifts.map((turno, idx) => (
                                    <div key={idx} className="p-3 rounded-lg bg-primary/5 border border-primary/10 space-y-3">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-baseline gap-1">
                                                <span className="font-display text-xl">{turno.startTime}</span>
                                                <span className="text-[10px] text-muted-foreground uppercase">a</span>
                                                <span className="font-display text-xl">{turno.endTime}</span>
                                            </div>
                                            <Badge variant="secondary" className="text-[9px] h-5">{turno.branch}</Badge>
                                        </div>

                                        <div className="flex justify-between">
                                            {weekDays.map((day) => {
                                                const isActive = turno.days?.includes(day.key);
                                                return (
                                                    <div
                                                        key={day.key}
                                                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all
                                                            ${isActive 
                                                                ? "bg-primary text-black border-primary" 
                                                                : "bg-transparent text-muted-foreground border-border opacity-40"}`}
                                                    >
                                                        {day.label}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-sm text-muted-foreground py-4 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" /> No tienes horarios cargados.
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <section className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
                    {/* Listado de Mesas */}
                    <div className="glass-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-display text-xl">Mis mesas</h3>
                            <Badge variant="outline" className="text-muted-foreground">{tables.length} mesas</Badge>
                        </div>

                        {tables.length === 0 ? (
                            <div className="text-sm text-muted-foreground border border-dashed border-border rounded-lg p-8 text-center">
                                No hay mesas cargadas.
                            </div>
                        ) : (
                            <div className="grid gap-2 sm:grid-cols-2">
                                {tables.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => setSelectedTableId(t.id)}
                                        className={`text-left rounded-lg border p-4 transition-all ${selectedTableId === t.id ? "border-primary/60 bg-primary/5 gold-glow" : "border-border hover:bg-muted/40"}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Armchair className="w-4 h-4 text-primary" />
                                                <span className="font-display text-lg">Mesa {t.number}</span>
                                            </div>
                                            <Badge className={t.status === "ocupada" ? "bg-primary/15 text-primary border-primary/30" : "bg-muted text-muted-foreground"}>
                                                {t.status || "Libre"}
                                            </Badge>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Panel de Comanda */}
                    <div className="glass-card p-6 flex flex-col min-h-[450px]">
                        <h3 className="font-display text-xl mb-4">Pedido</h3>

                        {!selectedTableId ? (
                            <div className="text-sm text-muted-foreground border border-dashed border-border rounded-lg p-8 text-center flex-1 flex items-center justify-center">
                                Selecciona una mesa para iniciar el pedido.
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4 flex-1">
                                <div className="flex gap-2">
                                    <Select value={productPicker} onValueChange={setProductPicker}>
                                        <SelectTrigger className="flex-1">
                                            <SelectValue placeholder="Agregar producto..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {products.map((p) => (
                                                <SelectItem key={p.id} value={p.id}>{p.name} — {formatMxn(p.unitPrice)}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button onClick={addProductToDraft} size="icon"><Plus className="w-4 h-4" /></Button>
                                </div>

                                <div className="flex-1 space-y-2 overflow-auto max-h-[300px] scrollbar-thin">
                                    {orderDraft.map((l) => {
                                        const p = products.find(pp => pp.id === l.productId);
                                        return (
                                            <div key={l.productId} className="flex items-center justify-between border border-border rounded-lg p-3 bg-card/40">
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium truncate">{p?.name}</p>
                                                    <p className="text-xs text-muted-foreground">{formatMxn(p?.unitPrice || 0)}</p>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQty(l.productId, -1)}><Minus className="w-3 h-3" /></Button>
                                                    <span className="w-6 text-center text-sm font-medium">{l.quantity}</span>
                                                    <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQty(l.productId, 1)}><Plus className="w-3 h-3" /></Button>
                                                    <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => updateQty(l.productId, -99)}><Trash2 className="w-3 h-3" /></Button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="border-t border-border pt-4 mt-auto">
                                    <div className="flex justify-between items-baseline mb-4">
                                        <span className="text-sm text-muted-foreground">Total Estimado</span>
                                        <span className="font-display text-2xl text-gradient-gold">{formatMxn(draftTotal)}</span>
                                    </div>
                                    <Button className="w-full" onClick={saveOrder} disabled={orderDraft.length === 0}>Confirmar y Guardar</Button>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default EmployeeDashboard;