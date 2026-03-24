export class Sucursal{
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
    ){
        this.idSucursal = idSucursal;
        this.nombre = nombre;
        this.direccion = nombre;
        this.tipoBar = tipoBar;
    }

    //métodos
    abrirEstablecimiento(): void{
        //aún por completar
    }

    cerrarEstablecimiento(): void{
        //aún por completar
    }
}