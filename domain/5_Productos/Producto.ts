export class Producto{
    public idProd: number;
    public nombre: string;
    public precioUnitario: number;
    public categoria: string;
    public esAlcoholica: boolean;

    constructor(
        idProd: number,
        nombre: string,
        precioUnitario: number,
        categoria: string,
        esAlcoholica: boolean,
    ){
        this.idProd = idProd;
        this.nombre = nombre;
        this.precioUnitario = precioUnitario;
        this.categoria = categoria;
        this.esAlcoholica = esAlcoholica;
    }

    //métodos
    actualizarPrecio(nuevoPrecio: number): void{
        //aún por completar
    }

    obtenerInformacion(): string{
        //aún por completar
        return this.categoria;
    }
}