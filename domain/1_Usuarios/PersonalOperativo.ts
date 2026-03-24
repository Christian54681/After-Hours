import { Empleado } from "./Empleado";

export class PersonalOperativo extends Empleado{
    //atributos
    public areaActual: string
    
    constructor(
        id: string,
        nombre: string,
        email: string,
        telefono: string,
        estado: string = 'activo',
        idEmpleado: string,
        tipoRol: string,
        areaActual: string,
        activo: boolean = true
    ){
        super(id, nombre, email, telefono, estado, idEmpleado, tipoRol);
        this.areaActual = areaActual
    }

    //métodos
    consultarTareas(): any[]{
        console.log(`${this.getNombre()} está consultando sus tareas en el área: ${this.areaActual}`);
        return [];

    }

    actualizarEstadoTarea(): void{
    console.log(`🔄 ${this.getNombre()} actualizó una tarea`);        
    }

}