export class Inventario{
    public idInventario: number;
    public stockActual: number;
    public stockMinimo: number;
    public fechaUltimaRevision: Date;

    constructor(
        idInventario: number,
        stockActual: number,
        stockMinimo: number,
        fechaUltimaResvision: Date,
    ){
        this.idInventario = idInventario;
        this.stockActual = stockActual;
        this.stockMinimo = stockMinimo;
        this.fechaUltimaRevision = fechaUltimaResvision;
    }

    //métodos
    verificarStock(): number{
        //aún por completar
        return this.stockActual;
    }

    alertarStockBajo(): void{
        //aún por completar
    }

    registrarEntrada(cantidad: number): void{
        //aún por completar
    }
}