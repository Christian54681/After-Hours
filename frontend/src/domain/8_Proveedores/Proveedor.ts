export class Proveedor {
    //atributod
    public idProveedor: number;
    public empresa: string;
    public contacto: string;
    public tiempoEntregaDias: number;

    constructor(
        idProveedor: number,
        empresa: string,
        contacto: string,
        tiempoEntregaDias: number,
    ) {
        this.idProveedor = idProveedor;
        this.empresa = empresa;
        this.contacto = contacto;
        this.tiempoEntregaDias = tiempoEntregaDias;
    }

    //métodos
    consultarDeudas(): number {
        console.log(`Consultando deudas del proveedor ${this.empresa} (ID: ${this.idProveedor})`);
        console.log(`Contacto: ${this.contacto} | Tiempo de entrega: ${this.tiempoEntregaDias} días`);

        const deudaTotal = 0;

        console.log(`Deuda total actual del proveedor ${this.empresa}: $${deudaTotal}`);

        return deudaTotal;
    }
}