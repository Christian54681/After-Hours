//Empleado
import { Usuario } from "./Usuario";

export class Empleado extends Usuario {

    //atributos
    public idEmpleado: string;
    public tipoRol: string;

    constructor(
        nombreCompleto: string,
        email: string,
        telefono: string,
        estado: string = 'activo',
        tipoRol: string,
        idEmpleado: string,
        username?: string,
        createdAt?: Date,
    ) {
        super(nombreCompleto, email, telefono, estado, username, createdAt);
        this.idEmpleado = idEmpleado;
        this.tipoRol = tipoRol;
    }

    //metodos
    registrarEntrada(): void {
        console.log(`${this.nombreCompleto} (${this.tipoRol}) registró su entrada`);
    }

    registrarSalida(): void {
        console.log(`${this.nombreCompleto} (${this.tipoRol}) registró su salida`);
    }

    actualizarDatos(): void {
        console.log(`Datos del empleado ${this.nombreCompleto} (${this.tipoRol}) han sido actualizados`);
        // Aquí más adelante se actualizarían los datos en base de datos
    }

    override login(): boolean {
        console.log(`Empleado ${this.nombreCompleto} (${this.tipoRol}) inició sesión`);
        return true;
    }
}