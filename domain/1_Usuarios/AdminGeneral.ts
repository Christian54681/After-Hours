import { Empleado } from "./Empleado";

export class AdminGeneral extends Empleado {
    //atributos
    public idGlobal: number;
    public todasLasSucursales: number[];

    constructor(
        id: string,
        nombre: string,
        email: string,
        telefono: string,
        estado: string = 'activo',
        tipoRol: string,
        idEmpleado: string,
        idGlobal: number,
        todasLasSucursales: number[]= [],
    ) {
        super(id, nombre, email, telefono, estado, tipoRol, idEmpleado);
        this.idGlobal = idGlobal;
        this.todasLasSucursales = todasLasSucursales;
    }

    //métodfos
    crearSucursal(): void{

    }

    asignarRoles(): void{

    }

}