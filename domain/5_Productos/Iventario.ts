export class Inventario {
    public idInventario: number;
    public stockActual: number;
    public stockMinimo: number;
    public fechaUltimaRevision: Date;

    constructor(
        idInventario: number,
        stockActual: number,
        stockMinimo: number,
        fechaUltimaResvision: Date,
    ) {
        this.idInventario = idInventario;
        this.stockActual = stockActual;
        this.stockMinimo = stockMinimo;
        this.fechaUltimaRevision = fechaUltimaResvision;
    }

    //métodos
    verificarStock(): number {
        console.log(`Verificando stock del inventario ${this.idInventario}`);
        console.log(`Stock actual: ${this.stockActual} | Stock mínimo: ${this.stockMinimo}`);

        return this.stockActual;
    }

    alertarStockBajo(): void {
        if (this.stockActual <= this.stockMinimo) {
            console.log(`ALERTA: Stock bajo en inventario ${this.idInventario}`);
            console.log(`Stock actual (${this.stockActual}) está por debajo o igual al mínimo (${this.stockMinimo})`);
        } else {
            console.log(`Stock del inventario ${this.idInventario} está dentro de límites normales.`);
        }
    }

    registrarEntrada(cantidad: number): void {
        if (cantidad <= 0) {
            throw new Error("La cantidad de entrada debe ser mayor a 0");
        }

        this.stockActual += cantidad;
        this.fechaUltimaRevision = new Date(); 

        console.log(`Entrada registrada en inventario ${this.idInventario}: +${cantidad} unidades`);
        console.log(`Nuevo stock actual: ${this.stockActual}`);
        this.alertarStockBajo();
    }
}