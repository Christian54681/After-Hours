import { PersonalOperativo } from "./PersonalOperativo";

export class Bartender extends PersonalOperativo {
    //atributos
    public especialidad: string;
    public barraAsignada: string;      

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
        especialidad: string,
        barraAsignada: string,
    ) {
        super(id, nombre, email, telefono, estado, tipoRol, idEmpleado, areaActual, activo);

        this.especialidad = especialidad;
        this.barraAsignada = barraAsignada;
    }

    //métodos

    prepararBebida(idPedido: number): void{
        //aún por completar
        console.log()
    }

    notificarPedidoListo(): void{
        //aún por completar
        console.log()
    }

    registrarMermaEnBarra(): void{
        //aún por completar
        console.log()
    }
}