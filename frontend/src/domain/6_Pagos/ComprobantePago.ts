export class ComprobantePago {
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
    ) {
        this.numFactura = numFactura;
        this.fechaEmision = fechaEmision;
        this.metodoPago = metodoPago;
        this.iva = iva;
    }

    //métodos
    imprimirTicket(): void {
        console.log("=".repeat(50));
        console.log("TICKET / FACTURA");
        console.log("=".repeat(50));
        console.log(`Factura No: ${this.numFactura}`);
        console.log(`Fecha: ${this.fechaEmision.toLocaleString()}`);
        console.log(`Método de Pago: ${this.metodoPago}`);
        console.log(`IVA: ${this.iva}%`);
        console.log("=".repeat(50));
        console.log("Ticket impreso correctamente.");
    }

    enviarPorCorreo(email: string): void {
        if (!email || !email.includes('@')) {
            throw new Error("Debe proporcionar un correo electrónico válido");
        }

        console.log(`Enviando comprobante de pago ${this.numFactura} al correo: ${email}`);
        console.log(`Fecha de emisión: ${this.fechaEmision.toLocaleDateString()}`);
        console.log(`Método de pago: ${this.metodoPago}`);

        console.log(`✅ Comprobante enviado exitosamente a ${email}`);
    }
}