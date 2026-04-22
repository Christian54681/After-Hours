export class Pedido {
    public folio: string;
    public fecha: Date;
    public total: number;
    public estadoCuenta: string;

    constructor(
        folio: string,
        fecha: Date,
        total: number,
        estadoCuenta: string,
    ) {
        this.folio = folio;
        this.fecha = fecha;
        this.total = total;
        this.estadoCuenta = estadoCuenta;
    }

    //métodos
    calcularTotal(): number {
        console.log(`Calculando total del pedido ${this.folio}`);
        return this.total;
    }

    aplicarDescuento(porcentaje: number): void {
        if (porcentaje <= 0 || porcentaje > 100) {
            throw new Error("El porcentaje de descuento debe estar entre 1 y 100");
        }

        const descuento = this.total * (porcentaje / 100);
        this.total = this.total - descuento;

        console.log(`Se aplicó un descuento del ${porcentaje}% al pedido ${this.folio}`);
        console.log(`Nuevo total: ${this.total}`);
    }

    cerrarCuenta(): void {
        if (this.estadoCuenta === "cerrada") {
            throw new Error("La cuenta ya se encuentra cerrada");
        }

        this.estadoCuenta = "cerrada";
        console.log(`Cuenta del pedido ${this.folio} cerrada correctamente.`);
        console.log(`Total final: ${this.total}`);
    }

    agregarPropina(cantidad: number): void {
        if (cantidad < 0) {
            throw new Error("La propina no puede ser negativa");
        }

        this.total += cantidad;
        console.log(`Se agregó propina de $${cantidad} al pedido ${this.folio}`);
        console.log(`Nuevo total con propina: ${this.total}`);
    }
}