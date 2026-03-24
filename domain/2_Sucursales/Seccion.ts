export class Seccion{
    //atributos
    public idSeccion: number;
    public nombre: string;
    public capacidadMax: number;

    constructor(
        idSeccion: number,
        nombre: string,
        capacidadMax: number,
    ){
        this.idSeccion = idSeccion;
        this.nombre = nombre;
        this.capacidadMax = capacidadMax;
    }

    //métodos
    obtenerMesasDisponibles(): any{

    }

    asignarMesero(idEmpleado: number): void{

    }
}