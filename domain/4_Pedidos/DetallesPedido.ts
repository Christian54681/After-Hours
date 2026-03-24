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
    calcularSubtotal(): number{
        //aún por completar
        return this.subTotal;
    }

    modificarCantidad(n: number): void{
         //aún por completar       
    }
}