import { PersonalOperativo } from "./PersonalOperativo";

export class Mesero extends PersonalOperativo {
    // Atributos
    public zonaAsignada: string;
    public mesasACargo: number[];

    constructor(
        id: string,
        nombre: string,
        email: string,
        telefono: string,
        estado: string = 'activo',
        tipoRol: string = 'Mesero', // Por defecto ya sabemos que es Mesero
        idEmpleado: string,
        areaActual: string,
        activo: boolean = true,
        zonaAsignada: string,
        mesasACargo: number[] = []
    ) {
        // Llamada al constructor de la clase padre (PersonalOperativo -> Empleado)
        super(
            id,
            nombre,
            email,
            telefono,
            estado,
            tipoRol,
            idEmpleado,
            areaActual,
            activo
        );

        this.zonaAsignada = zonaAsignada;
        this.mesasACargo = mesasACargo;
    }

    //métodos
    abrirPedido(idMesa: number): void {
        console.log(`El mesero: ${this.getNombre()} abrió pedido en la mesa ${idMesa} (zona: ${this.zonaAsignada})`);
    }

    agregarProductoAPedido(idProd: number): void {
        console.log(`El mesero: ${this.getNombre()} agregó producto ${idProd} al pedido`);
    }

    solicitarCierreCuenta(): void {
        console.log(`El mesero: ${this.getNombre()} solicitó cierre de cuenta`);
    }

}