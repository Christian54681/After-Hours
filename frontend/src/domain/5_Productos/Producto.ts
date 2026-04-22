export class Producto {
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
    ) {
        this.idProd = idProd;
        this.nombre = nombre;
        this.precioUnitario = precioUnitario;
        this.categoria = categoria;
        this.esAlcoholica = esAlcoholica;
    }

    //métodos
    actualizarPrecio(nuevoPrecio: number): void {
        if (nuevoPrecio <= 0) {
            throw new Error("El precio unitario debe ser mayor a 0");
        }

        const precioAnterior = this.precioUnitario;
        this.precioUnitario = nuevoPrecio;

        console.log(`Precio actualizado del producto ${this.idProd} - ${this.nombre}`);
        console.log(`Precio anterior: $${precioAnterior} → Nuevo precio: $${nuevoPrecio}`);
    }

    obtenerInformacion(): string {
        const tipo = this.esAlcoholica ? "Alcohólica" : "No alcohólica";

        return `Producto: ${this.nombre} 
                | ID: ${this.idProd}
                | Categoría: ${this.categoria}
                | Precio: $${this.precioUnitario}
                | Tipo: ${tipo}`;
    }
}