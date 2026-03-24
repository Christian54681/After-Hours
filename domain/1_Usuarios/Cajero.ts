import { PersonalOperativo } from "./PersonalOperativo";

export class Cajero extends PersonalOperativo {
    //atributos
    public numeroCaja: number[];
    public fondoInicial: number[];
    public montoActual: number[];      

    constructor(
        id: string,
        nombre: string,
        email: string,
        telefono: string,
        estado: string = 'activo',
        tipoRol: string,
        idEmpleado: string,
        areaActual: string,
        activo: boolean = true,
        numeroCaja: number[] = [],
        fondoInicial: number[] = [],
        montoActual: number[] = [],

    ) {
        super(id, nombre, email, telefono, estado, tipoRol, idEmpleado, areaActual, activo);

        this.numeroCaja = numeroCaja;
        this.fondoInicial = fondoInicial;
        this.montoActual = montoActual;
    }

    //métodos

    procesarPago(idPedido: number, metodo: string): void{
        //aún por completar
    }

    generarFactura(): void{
        //aún por completar
    }

    realizarCorteCaja(): void{
        //aún por completar
    }
}