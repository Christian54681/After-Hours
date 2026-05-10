// domain/1_Usuarios/PersonalOperativo.ts
import { Empleado } from "./Empleado";

export class PersonalOperativo extends Empleado {
    public areaActual: string;

    constructor(
        nombreCompleto: string,
        email: string,
        telefono: string,
        estado: string = 'activo',
        tipoRol: string,
        idEmpleado: string,
        areaActual: string,
        createdAt?: Date,
        username?: string,
        idSucursal?: string
    ) {
        super(nombreCompleto, email, telefono, estado, tipoRol, idEmpleado, username, createdAt, idSucursal);
        
        this.areaActual = areaActual;
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