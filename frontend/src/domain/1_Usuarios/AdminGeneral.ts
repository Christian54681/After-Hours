import { Empleado } from "./Empleado";

export class AdminGeneral extends Empleado {
    //atributos
    public idGlobal: number;
    public todasLasSucursales: number[];

    constructor(
        id: string,
        nombreCompleto: string,
        email: string,
        telefono: string,
        estado: string = 'activo',
        tipoRol: string,
        idEmpleado: string,
        idGlobal: number,
        todasLasSucursales: number[] = [],
    ) {
        super(id, nombreCompleto, email, telefono, estado, tipoRol, idEmpleado);
        this.idGlobal = idGlobal;
        this.todasLasSucursales = todasLasSucursales;
    }

    //métodfos
    crearSucursal(
        nombreCompleto: string,
        direccion: string,
        tipoBar: string
    ): void {
        console.log(`AdminGeneral ${this.getNombre()} está creando una nueva sucursal:`);
        console.log(`Nombre: ${nombreCompleto}`);
        console.log(`Dirección: ${direccion}`);
        console.log(`Tipo de Bar: ${tipoBar}`);

        console.log(`Sucursal "${nombreCompleto}" creada exitosamente por ${this.getNombre()}`);
    }

    asignarRoles(idEmpleado: string, nuevoRol: string): void {
        console.log(`AdminGeneral ${this.getNombre()} está asignando rol:`);
        console.log(`Empleado ID: ${idEmpleado}`);
        console.log(`Nuevo Rol: ${nuevoRol}`);

        if (!nuevoRol || nuevoRol.trim() === '') {
            throw new Error("El rol no puede estar vacío");
        }


        console.log(`Rol "${nuevoRol}" asignado correctamente al empleado ${idEmpleado}`);
    }

}