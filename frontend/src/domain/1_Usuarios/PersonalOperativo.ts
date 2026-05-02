// domain/1_Usuarios/PersonalOperativo.ts
import { Empleado } from "./Empleado";

export class PersonalOperativo extends Empleado {
    public areaActual: string;
    public activo: boolean;

    constructor(
        nombreCompleto: string,
        email: string,
        telefono: string,
        estado: string = 'activo',
        tipoRol: string,
        idEmpleado: string,
        areaActual: string,
        activo: boolean = true,
        createdAt?: Date,
        username?: string,
    ) {
        super(nombreCompleto, email, telefono, estado, tipoRol, idEmpleado, username, createdAt);
        
        this.areaActual = areaActual;
        this.activo = activo;
    }

    //metodos
    consultarTareas(): any[] {
        console.log(`${this.getNombre()} está consultando sus tareas en el área: ${this.areaActual}`);
        return [];
    }

    actualizarEstadoTarea(idTarea: number): void {
        console.log(`${this.getNombre()} actualizó la tarea con ID: ${idTarea}`);
    }
}