export class Sucursal {
    //atributos
    public idSucursal: number;
    public nombre: string;
    public direccion: string;
    public tipoBar: string;

    constructor(
        idSucursal: number,
        nombre: string,
        direccion: string,
        tipoBar: string
    ) {
        this.idSucursal = idSucursal;
        this.nombre = nombre;
        this.direccion = nombre;
        this.tipoBar = tipoBar;
    }

    //métodos
    abrirEstablecimiento(): void {
        console.log(`Abriendo establecimiento: ${this.nombre} (ID: ${this.idSucursal})`);
        console.log(`Dirección: ${this.direccion}`);
        console.log(`Tipo de bar: ${this.tipoBar}`);

        console.log(`Establecimiento ${this.nombre} abierto correctamente.`);
    }

    cerrarEstablecimiento(): void {
        console.log(`Cerrando establecimiento: ${this.nombre} (ID: ${this.idSucursal})`);

        console.log(`Establecimiento ${this.nombre} cerrado correctamente.`);
    }
}