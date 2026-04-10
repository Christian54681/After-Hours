export class DetallesPedido{
    public idDetalle: number;
    public idProducto: number;
    public cantidad: number;
    public subTotal: number;
    public nota: string;

    constructor(
        idDetalle: number,
        idProducto: number,
        cantidad: number,
        subTotal: number,
        nota: string,
    ){
        this.idDetalle = idDetalle;
        this.idProducto = idProducto;
        this.cantidad = cantidad;
        this.subTotal = subTotal;
        this.nota = nota
    }

    //métodos
    calcularSubtotal(): number {
        return this.subTotal;
    }

    modificarCantidad(nuevaCantidad: number): void {
        if (nuevaCantidad <= 0) {
            throw new Error("La cantidad debe ser mayor a 0");
        }
        this.cantidad = nuevaCantidad;
        console.log(`Cantidad modificada en detalle ${this.idDetalle}: ${nuevaCantidad} unidades`);
    }
}