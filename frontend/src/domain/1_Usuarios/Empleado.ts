//Empleado
import { Usuario } from "./Usuario";

export class Empleado extends Usuario {

    //atributos
    public idEmpleado: string;
    public tipoRol: string;  

    constructor(
        id: string,
        nombreCompleto: string,           
        email: string,
        telefono: string,
        estado: string = 'activo',
        tipoRol: string,
        idEmpleado: string,
        username?: string,
        password?: string
    ) {
        super(id, nombreCompleto, email, telefono, estado);

        this.idEmpleado = idEmpleado || id;
        this.tipoRol = tipoRol;
        this.nombreCompleto = nombreCompleto;
        this.username = username || email.split('@')[0];
        this.password = password || "";           
        this.createdAt = new Date();
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