//Cajero
import { PersonalOperativo } from "./PersonalOperativo";

export class Cajero extends PersonalOperativo {

    public numeroCaja: number;
    public fondoInicial: number;
    public montoActual: number;

    constructor(
        id: string,
        nombreCompleto: string,
        email: string,
        telefono: string,
        estado: string = 'activo',
        tipoRol: string,
        idEmpleado: string,
        areaActual: string,
        activo: boolean = true,
        numeroCaja: number,
        fondoInicial: number = 0.0,
        montoActual: number = 0.0
    ) {
        super(id, nombreCompleto, email, telefono, estado, tipoRol, idEmpleado, areaActual, activo);

        this.numeroCaja = numeroCaja;
        this.fondoInicial = fondoInicial;
        this.montoActual = fondoInicial;   
    }

    //metofos
    procesarPago(idPedido: number, monto: number, metodo: string): void {
        if (monto <= 0) {
            throw new Error("El monto del pago debe ser mayor a 0");
        }

        console.log(`Cajero ${this.getNombre()} procesó pago de $${monto} (Pedido #${idPedido}) con ${metodo}`);
        this.montoActual += monto;
    }

    generarFactura(): void {
        console.log(`Cajero ${this.getNombre()} generó factura`);
    }

    realizarCorteCaja(): number {
        const totalEnCaja = this.montoActual;
        console.log(`Cajero ${this.getNombre()} realizó corte de caja. Total en caja: $${totalEnCaja}`);
        this.montoActual = this.fondoInicial;
        return totalEnCaja;
    }
}