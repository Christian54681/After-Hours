import { Empleado } from "./Empleado";

export class AdminSucursal extends Empleado {
    //atributos
    public idSucursalACargo: number;
    public presupuestoSucursal: number;

    constructor(
        id: string,
        nombre: string,
        email: string,
        telefono: string,
        estado: string = 'activo',
        tipoRol: string,
        idEmpleado: string,
        idSucursalACargo: number,
        presupuestoSucursal: number,
    ) {
        super(id, nombre, email, telefono, estado, tipoRol, idEmpleado);
        this.idSucursalACargo = idSucursalACargo;
        this.presupuestoSucursal = presupuestoSucursal;
    }

    //métodfos
    supervisarInventario(): void {

    }

    autorizarOrdenCompra(idOrden: number, monto: number): boolean {
        if (monto <= this.presupuestoSucursal) {
            console.log(`El administrador de sucursal: ${this.getNombre()} autorizó orden de compra #${idOrden} por $${monto}`);
            this.presupuestoSucursal -= monto;
            return true;
        } else {
            console.log(`El administrador de sucursal: ${this.getNombre()} rechazó orden de compra #${idOrden} (no alcanzó)`);
            return false;
        }
    }

    gestionarHorarios(): void {
    }

    asignarRoles(idEmpleado: string, nuevoRol: string): void {

    }

}