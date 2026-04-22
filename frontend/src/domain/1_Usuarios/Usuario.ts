export class Usuario {
    //atributos
    public id: string;
    public nombre: string;
    public email: string;
    public telefono: string;
    public estado: string;

    constructor(
        id: string,
        nombre: string,
        email: string,
        telefono: string,
        estado: string = 'activo'
    ){
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.telefono = telefono;
        this.estado = estado;
    }

    //metodos
    login(): boolean{
        console.log(`${this.nombre} inició sesión`); //verificar en consola q el método se ejecutó
        return true;
    }

    actualizaarDatos(): void{
        console.log(`Datos de ${this.nombre} actualizados`); //igual para este
    }

    //gets
    getId(): string{
        return this.id;
    }

    getNombre(): string{
        return this.nombre;
    }

    getEmail(): string{
        return this.email;
    }

    getEstado(): string{
        return this.estado;
    }

}