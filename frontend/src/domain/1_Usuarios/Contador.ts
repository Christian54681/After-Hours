//Contador
import { PersonalOperativo } from "./PersonalOperativo";

export class Contador extends PersonalOperativo {

    //atributos
    public numCedula: string;
    public nivelAcceso: number;        

    constructor(
        nombreCompleto: string,
        email: string,
        telefono: string,
        estado: string = 'activo',
        tipoRol: string,
        idEmpleado: string,
        areaActual: string,
        activo: boolean = true,
        numCedula: string,
        nivelAcceso: number = 2          //valor por defecto que tiene sentido
    ) {
        super(nombreCompleto, email, telefono, estado, tipoRol, idEmpleado, areaActual, activo);

        this.numCedula = numCedula;
        this.nivelAcceso = nivelAcceso;
    }

    //metodos
    registrarGastos(monto: number): void {
        if (monto <= 0) {
            throw new Error("El monto de gastos debe ser mayor a 0");
        }

        console.log(`Contador ${this.getNombre()} registró gastos por monto: $${monto}`);
    }

    conciliarFacturas(): void {
        console.log(`Contador ${this.getNombre()} está conciliando facturas`);
    }

    generarBalanceMensual(): void {
        console.log(`Contador ${this.getNombre()} generó balance mensual`);
    }
}