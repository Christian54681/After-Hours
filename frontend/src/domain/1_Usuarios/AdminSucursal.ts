//AdminSucursal
import { Empleado } from "./Empleado";

export class AdminSucursal extends Empleado {
    //atributos
    public idSucursalACargo: string;
    public presupuestoSucursal: number;

    constructor(
        nombreCompleto: string,
        email: string,
        telefono: string,
        estado: string = 'activo',
        tipoRol: string,
        idEmpleado: string,
        idSucursalACargo: string,
        presupuestoSucursal: number,
        username?: string,
        createdAt?: Date,
        idSucursal?: string
    ) {
        super(nombreCompleto, email, telefono, estado, tipoRol, idEmpleado, username, createdAt, idSucursal);
        this.idSucursalACargo = idSucursalACargo;
        this.presupuestoSucursal = presupuestoSucursal;
    }

    //métodfos
    supervisarInventario(): void {
        console.log(`AdminSucursal ${this.getNombre()} está supervisando inventario de la sucursal ${this.idSucursalACargo}`);
    }

    autorizarOrdenCompra(idOrden: number, monto: number): boolean {
        if (monto <= this.presupuestoSucursal) {
            console.log(`AdminSucursal ${this.getNombre()} autorizó orden de compra #${idOrden} por $${monto}`);
            this.presupuestoSucursal -= monto;
            return true;
        } else {
            console.log(`AdminSucursal ${this.getNombre()} rechazó orden de compra #${idOrden} (presupuesto insuficiente)`);
            return false;
        }
    }

    gestionarHorarios(): void {
        console.log(`AdminSucursal ${this.getNombre()} está gestionando horarios del personal`);
    }

    asignarRoles(idEmpleado: string, nuevoRol: string): void {
        console.log(`AdminSucursal ${this.getNombre()} asignó rol "${nuevoRol}" al empleado ${idEmpleado}`);
    }

}