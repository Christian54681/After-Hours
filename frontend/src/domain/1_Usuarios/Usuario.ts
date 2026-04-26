export class Usuario {

    //atributos
    public id: string;
    public nombreCompleto: string;   
    public email: string;
    public telefono: string;
    public estado: string;
    public username: string;
    public password: string;
    public createdAt: Date;

    constructor(
        id: string,
        nombreCompleto: string,
        email: string,
        telefono: string,
        estado: string = 'activo',
        username?: string,
        password?: string
    ) {
        this.id = id;
        this.nombreCompleto = nombreCompleto;
        this.email = email;
        this.telefono = telefono;
        this.estado = estado;
        this.username = username || email.split('@')[0];
        this.password = password || "";           
        this.createdAt = new Date();
    }

    //metodos
    login(): boolean {
        console.log(`${this.nombreCompleto} inició sesión`);
        return true;
    }

    actualizarDatos(): void {
        console.log(`Datos de ${this.nombreCompleto} han sido actualizados`);
    }

    // Getters
    getId(): string {
        return this.id;
    }

    getNombre(): string {
        return this.nombreCompleto;
    }

    getEmail(): string {
        return this.email;
    }

    getEstado(): string {
        return this.estado;
    }

    getUsername(): string {
        return this.username;
    }
}