import { useState, useEffect } from "react";
import { FileText, Calendar, Tag, User, PackageCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface OrderHistoryProps {
    user: any;
}

const urlbase = "http://localhost:3000/api";

export const OrderHistory = ({ user }: OrderHistoryProps) => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            // Si no es AdminGeneral, filtramos por su idSucursalACargo
            const sucursalParam = user?.tipoRol !== "AdminGeneral"
                ? `?sucursal=${user?.idSucursalACargo}`
                : "";

            const res = await fetch(`${urlbase}/admin/orders${sucursalParam}`);
            const data = await res.json();
            if (res.ok) setOrders(data);
        } catch (error) {
            toast.error("Error al cargar el historial");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [user]);

    if (loading) return <div className="p-10 text-center animate-pulse">Cargando historial...</div>;

    return (
        <div className="mt-12 space-y-6">
            <div className="flex items-center gap-3 border-b border-border pb-4">
                <FileText className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-display font-bold text-foreground uppercase tracking-wider">
                    Historial de Pedidos
                </h2>
            </div>

            {orders.length === 0 ? (
                <div className="glass-card p-10 text-center text-muted-foreground">
                    No se han registrado órdenes de compra aún.
                </div>
            ) : (
                <div className="grid gap-4">
                    {orders.map((order) => (
                        <div key={order._id} className="glass-card p-4 bg-muted/5 border-border/40 hover:bg-muted/10 transition-colors">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-[9px] font-mono border-primary/30 text-primary">
                                            #{order._id.substring(order._id.length - 6).toUpperCase()}
                                        </Badge>
                                        <h4 className="font-bold text-foreground">{order.empresa}</h4>
                                    </div>
                                    <div className="flex items-center gap-4 text-[10px] text-muted-foreground uppercase tracking-tight">
                                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(order.fecha).toLocaleDateString()}</span>
                                        <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> Destino: {order.idSucursal}</span>
                                        <span className="flex items-center gap-1 text-primary/80"><PackageCheck className="w-3 h-3" /> {order.items.length} productos</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between md:justify-end gap-6">
                                    <div className="text-right">
                                        <p className="text-[10px] uppercase text-muted-foreground leading-none">Total Pagado</p>
                                        <p className="text-lg font-display text-primary">${order.totalCompra.toFixed(2)}</p>
                                    </div>
                                    <Badge className="bg-blue-500/10 text-blue-400 border-none uppercase text-[9px] px-3">
                                        {order.estado}
                                    </Badge>
                                </div>
                            </div>

                            {/* Mini lista de items expandible o simple */}
                            <div className="mt-3 pt-3 border-t border-border/30 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                {order.items.slice(0, 3).map((item: any, idx: number) => (
                                    <p key={idx} className="text-[10px] text-muted-foreground italic">
                                        • {item.nombre} ({item.cantidad})
                                    </p>
                                ))}
                                {order.items.length > 3 && <p className="text-[10px] text-primary">...y {order.items.length - 3} más</p>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};