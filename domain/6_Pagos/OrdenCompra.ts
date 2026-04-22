export class OrdenCompra {
    //atributod
    public idOrden: number;
    public fecha: Date;
    public estado: string;
    public totalCompra: number;

    constructor(
        idOrden: number,
        fecha: Date,
        estado: string,
        totalCompra: number,
    ) {
        this.idOrden = idOrden;
        this.fecha = fecha;
        this.estado = estado;
        this.totalCompra = totalCompra;
    }

    //métodos
    agregarInsumo(idProd: number, cant: number): void {
        if (cant <= 0) {
            throw new Error("La cantidad debe ser mayor a 0");
        }

        console.log(`Insumo agregado a la orden de compra ${this.idOrden}`);
        console.log(`Producto ID: ${idProd} | Cantidad: ${cant}`);
    }

    enviarAProveedor(): void {
        if (this.estado !== "pendiente") {
            throw new Error("Solo se pueden enviar órdenes en estado 'pendiente'");
        }

        this.estado = "enviada";
        console.log(`Orden de compra ${this.idOrden} enviada al proveedor`);
        console.log(`Fecha de envío: ${new Date().toLocaleString()}`);
    }

    validarRecepcion(): void {
        if (this.estado !== "enviada") {
            throw new Error("Solo se puede validar la recepción de órdenes en estado 'enviada'");
        }

        this.estado = "recibida";
        console.log(`Recepción validada correctamente para la orden de compra ${this.idOrden}`);
        console.log(`Estado actualizado a: ${this.estado}`);
    }
}