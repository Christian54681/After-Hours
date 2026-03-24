export class Proveedor{
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
    ){
        this.idProveedor = idProveedor;
        this.empresa = empresa;
        this.contacto = contacto;
        this.tiempoEntregaDias = tiempoEntregaDias;
    }

    //métodos
    consultarDeudas(): number{
        //aún por completar
        return this.tiempoEntregaDias;
    }

}