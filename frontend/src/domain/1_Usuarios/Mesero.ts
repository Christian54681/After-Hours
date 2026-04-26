//Mesero
import { PersonalOperativo } from "./PersonalOperativo";

export class Mesero extends PersonalOperativo {
    // Atributos
    public zonaAsignada: string;
    public mesasACargo: number;



    constructor(
        nombreCompleto: string,
        email: string,
        telefono: string,
        estado: string = 'activo',
        tipoRol: string = 'Mesero', // Por defecto ya sabemos que es Mesero
        idEmpleado: string,
        areaActual: string,
        activo: boolean = true,
        zonaAsignada: string,
        mesasACargo: number = 0,
        createdAt?: Date

    ) {
        super(nombreCompleto, email, telefono, estado, tipoRol, idEmpleado, undefined, undefined, createdAt);


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