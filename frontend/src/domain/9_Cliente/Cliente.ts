export class Cliente {
    //atributod
    public idCliente: object;
    public username: string;
    public email: string;
    public info: any;
    public tipo: string;

    constructor(
        idCliente: object,
        username: string,
        email: string,
        info: any,
        tipo: string
    ) {
        this.idCliente = idCliente;
        this.username = username;
        this.email = email;
        this.info = info;
        this.tipo = tipo;
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