//Mesero
import { PersonalOperativo } from "./PersonalOperativo";

export class Mesero extends PersonalOperativo {
    public zonaAsignada: string;
    public mesasACargo: number;

    constructor(
        nombreCompleto: string,
        email: string,
        telefono: string,
        estado: string = 'activo',
        tipoRol: string = 'Mesero',
        idEmpleado: string,
        areaActual: string,
        activo: boolean = true,
        zonaAsignada: string,
        mesasACargo: number = 0,
        createdAt?: Date,
        username?: string
    ) {
        super(nombreCompleto, email, telefono, estado, tipoRol, idEmpleado, areaActual, activo, createdAt, username);

        this.zonaAsignada = zonaAsignada;
        this.mesasACargo = mesasACargo;
    }

    //métodos
    abrirPedido(idMesa: number): void {
        console.log(`El mesero: ${this.getNombre()} abrió pedido en la mesa ${idMesa} (zona: ${this.zonaAsignada})`);
    }

    agregarProductoAPedido(idProd: number): void {
        console.log(`El mesero: ${this.getNombre()} agregó producto ${idProd} al pedido`);
    }

    solicitarCierreCuenta(): void {
        console.log(`El mesero: ${this.getNombre()} solicitó cierre de cuenta`);
    }

}