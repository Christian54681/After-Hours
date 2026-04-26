import { PersonalOperativo } from "./PersonalOperativo";

export class Bartender extends PersonalOperativo {
    //atributos
    public especialidad: string;
    public barraAsignada: string;      

    constructor(
        id: string,
        nombreCompleto: string,
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
        super(id, nombreCompleto, email, telefono, estado, tipoRol, idEmpleado, areaActual, activo);

        this.especialidad = especialidad;
        this.barraAsignada = barraAsignada;
    }

    //métodos
    prepararBebida(idPedido: number): void {
        console.log(`Bartender ${this.getNombre()} está preparando bebida para pedido ${idPedido} en barra ${this.barraAsignada}`);
    }

    notificarBebidaLista(): void {
        console.log(`Bartender ${this.getNombre()} notificó que la bebida está lista`);
    }

    registrarMermaEnBarra(cantidad: number, motivo: string): void {
        console.log(`Bartender ${this.getNombre()} registró merma de ${cantidad} unidades por: ${motivo}`);
    }
}