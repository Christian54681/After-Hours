export class Proveedor {
    //atributod
    public idCliente: number;
    public nombre: string;


    constructor(
        idCliente: number,
        nombre: string,
    ) {
        this.idCliente = idCliente;
        this.nombre = nombre;
    }

    //métodos
    verMenu(): void {
        console.log(`Cliente ${this.nombre} (ID: ${this.idCliente}) está viendo el menú`);

        console.log("Mostrando menú actual...");
    }

    realizarReservacion(): void {
        console.log(`Cliente ${this.nombre} está realizando una reservación`);

        console.log("Procesando reservación...");
    }

    elegirMesa(): void {
        console.log(`Cliente ${this.nombre} está eligiendo una mesa`);

        console.log("Mesa seleccionada correctamente.");
    }

}