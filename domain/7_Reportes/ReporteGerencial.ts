export class ReporteGerencial{
    //atributod
    public idReporte: number;
    public pedido: string;
    public utilidadNeta: number;
    public sucursalesAnalizadas: string;

    constructor(
        idReporte: number,
        pedido: string,
        utilidadNeta: number,
        sucursalesAnalizadas: string,
    ){
        this.idReporte = idReporte;
        this.pedido = pedido;
        this.utilidadNeta = utilidadNeta;
        this.sucursalesAnalizadas = sucursalesAnalizadas;
    }

    //métodos
    consolidarVentasTotales(): number{
        //aún por completar
        return this.utilidadNeta;
    }

    identificarProductoMasVendido(): void{
        //aún por completar
    }

    identificarMejorSucursal(): void{
        //aún por completar
    }

    //exportarPDF(): File{}
    //aún por completar

}