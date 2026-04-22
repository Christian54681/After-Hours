export class ReporteGerencial {
    //atributod
    public idReporte: number;
    public pedido: string;
    public utilidadNeta: number;
    public sucursalesAnalizadas: string;
    public periodo: string;

    constructor(
        idReporte: number,
        pedido: string,
        utilidadNeta: number,
        sucursalesAnalizadas: string,
        periodo: string,
    ) {
        this.idReporte = idReporte;
        this.pedido = pedido;
        this.utilidadNeta = utilidadNeta;
        this.sucursalesAnalizadas = sucursalesAnalizadas;
        this.periodo = periodo;
    }

    //métodos
    // no encontré algo que referente a un historial como pa completar bien lo metodos asi q lo llame "periodo"
    consolidarVentasTotales(): number {
        console.log(`Consolidando ventas totales del reporte ${this.idReporte} (${this.periodo})`);
        console.log(`Sucursales analizadas: ${this.sucursalesAnalizadas}`);
        return this.utilidadNeta;
    }

    identificarProductoMasVendido(): void {
        console.log(`Analizando producto más vendido en el periodo ${this.periodo}`);
        console.log("Producto más vendido identificado y registrado en el reporte.");
    }

    identificarMejorSucursal(): void {
        console.log(`Analizando mejor sucursal del periodo ${this.periodo}`);
        console.log("Mejor sucursal identificada y registrada en el reporte.");
    }

    exportarPDF(): void {
        console.log(`Exportando reporte gerencial ${this.idReporte} a PDF...`);
        console.log(`Periodo: ${this.periodo} | Utilidad Neta: $${this.utilidadNeta}`);
        console.log("Reporte exportado a PDF correctamente.");
    }

}