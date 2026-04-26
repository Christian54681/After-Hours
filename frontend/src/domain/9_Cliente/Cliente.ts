//Cliente
export class Proveedor {
    //atributod
    public idCliente: number;
    public username: string;
    public email: string;
    public password: string;
    public createdAt: number;
    public clienteInfo: number[];


    constructor(
        idCliente: number,
        username: string,
        email: string,
        password: string,
        createdAt: number,
        clienteInfo: number[],
    ) {
        this.idCliente = idCliente;
        this.username = username;
        this.email = email;      
        this.password = password;
        this.createdAt = createdAt;
        this.clienteInfo = clienteInfo;
    }

    //métodos
    verMenu(): void {
        console.log(`Cliente ${this.username} (ID: ${this.idCliente}) está viendo el menú`);

        console.log("Mostrando menú actual...");
    }

    realizarReservacion(): void {
        console.log(`Cliente ${this.username} está realizando una reservación`);

        console.log("Procesando reservación...");
    }

    elegirMesa(): void {
        console.log(`Cliente ${this.username} está eligiendo una mesa`);

        console.log("Mesa seleccionada correctamente.");
    }

}