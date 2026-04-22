export class Seccion {
    //atributos
    public idSeccion: number;
    public nombre: string;
    public capacidadMax: number;

    constructor(
        idSeccion: number,
        nombre: string,
        capacidadMax: number,
    ) {
        this.idSeccion = idSeccion;
        this.nombre = nombre;
        this.capacidadMax = capacidadMax;
    }

    //métodos
    obtenerMesasDisponibles(): any[] {
        console.log(`Consultando mesas disponibles en la seccion ${this.nombre} (ID: ${this.idSeccion})`);

        return [];
    }

    asignarMesero(idEmpleado: number): void {
        if (idEmpleado <= 0) {
            throw new Error("El ID del empleado debe ser un número válido mayor a 0");
        }

        console.log(`Asignando mesero con ID ${idEmpleado} a la seccion ${this.nombre} (ID: ${this.idSeccion})`);

        console.log(`Mesero ${idEmpleado} asignado correctamente a la seccion ${this.nombre}`);
    }
}