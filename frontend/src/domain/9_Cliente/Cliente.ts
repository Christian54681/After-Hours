//Cliente
export class Cliente {
    //atributod
    public idCliente: number;
    public username: string;
    public email: string;
    public createdAt: Date;
    public clienteInfo: number[];
    public tipo: string = "cliente";


    constructor(
        idCliente: number,
        username: string,
        email: string,
        createdAt: Date,
        clienteInfo: number[],
    ) {
        this.idCliente = idCliente;
        this.username = username;
        this.email = email;
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

    login(): void {
        console.log(`Cliente ${this.username} está iniciando sesión`);

        console.log("Autenticación exitosa. Bienvenido, " + this.username + "!");
    }

}