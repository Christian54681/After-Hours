export class OrdenCompra{
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
    ){
        this.idOrden = idOrden;
        this.fecha = fecha;
        this.estado = estado;
        this.totalCompra = totalCompra;
    }

    //métodos
    agregarInsumo(idProd: number, cant: number): void{
        //aún por completar
    }

    enviarAProveedor(): void{
        //aún por completar
    }

    validadRecepcion(): void{
        //aún por completar
    }
}