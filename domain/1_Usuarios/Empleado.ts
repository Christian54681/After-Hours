import { Usuario } from "./Usuario";

export class Empleado extends Usuario{
    //atributos
    public idEmpleado: string
    public tipoRol: string

    constructor(
        id: string,
        nombre: string,
        email: string,
        telefono: string,
        estado: string = 'activo',
        idEmpleado: string,
        tipoRol: string,

    ){
        super(id, nombre, email, telefono, estado);//llamada a los atributos de Usuario.ts

        this.idEmpleado = idEmpleado || id;//idEmpleado o id
        this.tipoRol = tipoRol;

    }

    //métodos
    registrarEntrada(): void{
        console.log(`${this.getNombre()} (${this.tipoRol}) registró su entrada`);   
    }

    registrarSalida(): void{
        console.log(`${this.getNombre()} (${this.tipoRol}) registró su salida`);   

    }

    override login(): boolean {
        console.log(`${this.nombre} inició sesión`);
        return true;
    }

}