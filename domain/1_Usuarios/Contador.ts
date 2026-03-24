import { PersonalOperativo } from "./PersonalOperativo";

export class Contador extends PersonalOperativo {
    //atributos
    public numCedula: string;
    public nivelAcceso: number[];      

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
        numCedula: string,
        nivelAcceso: number[] = [],
    ) {
        super(id, nombre, email, telefono, estado, tipoRol, idEmpleado, areaActual, activo);

        this.numCedula = numCedula;
        this.nivelAcceso = nivelAcceso;
    }

    //métodos
    registrarGastos(monto: GLfloat): void{
        //aún por completar
    }

    conciliarFacturas(): void{
        //aún por completar
    }

    generarBalanceMensual(): void{
        //aún por completar
    }
}