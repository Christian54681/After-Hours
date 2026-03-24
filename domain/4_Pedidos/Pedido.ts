export class Pedido{
    public folio: string;
    public fecha: Date;
    public total: number;
    public estadoCuenta: string;

    constructor(
        folio: string,
        fecha: Date,
        total: number, 
        estadoCuenta: string,
    ){
        this.folio = folio;
        this.fecha = fecha;
        this.total = total;
        this.estadoCuenta = estadoCuenta;
    }

    //métodos
    calcularTotal(): number{
        return this.total;
    }

    aplicarDescuento(): void{

    }

    cerrarCuenta(): void{

    }

    agregarPropina(cantidad: number): void{

    }
}