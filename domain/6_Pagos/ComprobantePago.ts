export class ComprobantePago{
    //atributod
    public numFactura: string;
    public fechaEmision: Date;
    public metodoPago: string;
    public iva: number;

    constructor(
        numFactura: string,
        fechaEmision: Date,
        metodoPago: string,
        iva: number,
    ){
        this.numFactura = numFactura;
        this.fechaEmision = fechaEmision;
        this.metodoPago = metodoPago;
        this.iva = iva;
    }

    //métodos
    imprimirTicket(): void{
        //aún por completar
    }

    enviarPorCorreo(email: string): void{
        //aún por completar
    }
}