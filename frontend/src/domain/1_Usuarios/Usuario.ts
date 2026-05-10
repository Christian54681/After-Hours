//Usuario
export class Usuario {

    //atributos
    public nombreCompleto: string;
    public email: string;
    public telefono: string;
    public estado: string;
    public username: string;
    public createdAt: Date;

    constructor(
        nombreCompleto: string,
        email: string,
        telefono: string,
        estado: string = 'activo',
        username?: string,
        createdAt?: Date
    ) {
        this.nombreCompleto = nombreCompleto;
        this.email = email;
        this.telefono = telefono;
        this.estado = estado;
        this.username = username || email.split('@')[0];
        this.createdAt = createdAt
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