import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ShoppingCart, Trash2, Plus } from "lucide-react";
import { MOCK_PRODUCTS, MockProduct } from "@/data/inventoryMock";
import { toast } from "sonner";

interface OrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    supplier: any;
    user: any;
}

const urlbase = "http://localhost:3000/api";

export const OrderModal = ({ isOpen, onClose, supplier, user }: OrderModalProps) => {
    const [cart, setCart] = useState<{ product: MockProduct; quantity: number }[]>([]);
    const [total, setTotal] = useState(0);

    const isAdminGeneral = user?.tipoRol === "AdminGeneral";
    const sucursalId = isAdminGeneral ? "GLOBAL_DIST" : user?.idSucursalACargo;

    useEffect(() => {
        const newTotal = cart.reduce((acc, item) => acc + item.product.precioUnitario * item.quantity, 0);
        setTotal(newTotal);
    }, [cart]);

    const addToCart = (product: MockProduct) => {
        setCart((prev) => {
            const exists = prev.find((item) => item.product.idProd === product.idProd);
            if (exists) {
                return prev.map((item) =>
                    item.product.idProd === product.idProd ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { product, quantity: 1 }];
        });
    };

    const removeFromCart = (idProd: number) => {
        setCart((prev) => prev.filter((item) => item.product.idProd !== idProd));
    };

    const handleSendOrder = async () => {
        if (cart.length === 0) return toast.error("El carrito está vacío");

        const orderData = {
            idProvedor: supplier.idProvedor,
            empresa: supplier.empresa,
            idSucursal: sucursalId,
            items: cart.map(item => ({
                idProd: item.product.idProd,
                nombre: item.product.nombre,
                cantidad: item.quantity,
                precioUnitario: item.product.precioUnitario,
                subtotal: item.quantity * item.product.precioUnitario
            })),
            totalCompra: total,
            fecha: new Date(),
            estado: "Pendiente"
        };

        try {
            const res = await fetch(`${urlbase}/admin/orders`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData),
            });

            if (res.ok) {
                toast.success("Orden de compra enviada con éxito");
                setCart([]);
                onClose();
            }
        } catch (error) {
            toast.error("Error al enviar la orden");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-border">
                <DialogHeader>
                    <DialogTitle className="text-xl font-display text-gradient-gold">
                        Generar Pedido: {supplier?.empresa}
                    </DialogTitle>
                    <p className="text-xs text-muted-foreground uppercase">Destino: {sucursalId}</p>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    {/* LISTA DE PRODUCTOS (MOCK) */}
                    <div className="space-y-4">
                        <Label className="text-primary uppercase text-[10px] font-bold">Catálogo de Productos</Label>
                        <div className="grid gap-2">
                            {MOCK_PRODUCTS.map((prod) => (
                                <div key={prod.idProd} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50">
                                    <div>
                                        <p className="text-sm font-medium">{prod.nombre}</p>
                                        <p className="text-xs text-muted-foreground">${prod.precioUnitario.toFixed(2)}</p>
                                    </div>
                                    <Button size="sm" variant="ghost" onClick={() => addToCart(prod)} className="hover:bg-primary hover:text-black">
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CARRITO / RESUMEN */}
                    <div className="flex flex-col bg-muted/20 rounded-2xl p-4 border border-border">
                        <Label className="text-primary uppercase text-[10px] font-bold mb-4 flex items-center gap-2">
                            <ShoppingCart className="w-3 h-3" /> Resumen del Pedido
                        </Label>

                        <div className="flex-1 space-y-3">
                            {cart.length === 0 ? (
                                <p className="text-center text-sm text-muted-foreground py-10">No hay productos seleccionados</p>
                            ) : (
                                cart.map((item) => (
                                    <div key={item.product.idProd} className="flex items-center justify-between text-sm animate-in fade-in">
                                        <span className="flex-1">{item.quantity}x {item.product.nombre}</span>
                                        <span className="font-mono ml-2">${(item.quantity * item.product.precioUnitario).toFixed(2)}</span>
                                        <Button size="sm" variant="ghost" onClick={() => removeFromCart(item.product.idProd)} className="text-red-500 hover:bg-red-500/10 ml-2">
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="mt-4 pt-4 border-t border-border flex justify-between items-end">
                            <div>
                                <p className="text-[10px] uppercase text-muted-foreground">Total Estimado</p>
                                <p className="text-2xl font-display text-primary">${total.toFixed(2)}</p>
                            </div>
                            <Button onClick={handleSendOrder} disabled={cart.length === 0} className="gold-glow">
                                Enviar Pedido
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};