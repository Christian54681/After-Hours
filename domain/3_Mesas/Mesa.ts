export class Mesa {
    //atributos
    public numeroMesa: number;
    public capacidad: number;
    public estado: number;           // 0: libre, 1: ocupado, 2: reservado, 3: en limpieza

    constructor(
        numeroMesa: number,
        capacidad: number,
        estado: number = 0           
    ) {
        this.numeroMesa = numeroMesa;
        this.capacidad = capacidad;
        this.estado = estado;
    }

    //métodos
    cambiarEstado(nuevoEstado: number): void {
        const estadosValidos = [0, 1, 2, 3];

        if (!estadosValidos.includes(nuevoEstado)) {
            throw new Error(`Estado inválido: ${nuevoEstado}.`);
        }

        this.estado = nuevoEstado;

        const descripcion = this.obtenerDescripcionEstado();
        console.log(`Mesa ${this.numeroMesa} cambió a estado: ${nuevoEstado} (${descripcion})`);
    }

    reservar(fecha: Date): boolean {
        if (this.estado === 0) {                    
            this.estado = 2;                        
            console.log(`Mesa ${this.numeroMesa} reservada para el ${fecha.toLocaleDateString()}`);
            return true;
        } else {
            console.log(`No se puede reservar la mesa ${this.numeroMesa}. Estado actual: ${this.obtenerDescripcionEstado()}`);
            return false;
        }
    }

    private obtenerDescripcionEstado(): string {
        switch (this.estado) {
            case 0: return 'libre';
            case 1: return 'ocupado';
            case 2: return 'reservado';
            case 3: return 'en limpieza';
            default: return 'libre';
        }
    }


}