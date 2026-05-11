export interface MockProduct {
    idProd: number;
    nombre: string;
    precioUnitario: number;
    categoria: string;
}

export const MOCK_PRODUCTS: MockProduct[] = [
    { idProd: 101, nombre: "Cerveza Lager 355ml", precioUnitario: 22.50, categoria: "Bebidas" },
    { idProd: 102, nombre: "Cerveza Artesanal IPA", precioUnitario: 45.00, categoria: "Bebidas" },
    { idProd: 103, nombre: "Refresco de Cola 600ml", precioUnitario: 18.00, categoria: "Bebidas" },
    { idProd: 104, nombre: "Whisky Etiqueta Roja 750ml", precioUnitario: 450.00, categoria: "Licores" },
    { idProd: 105, nombre: "Tequila Reposado 700ml", precioUnitario: 380.00, categoria: "Licores" },
    { idProd: 106, nombre: "Bolsa de Hielo 5kg", precioUnitario: 25.00, categoria: "Varios" },
    { idProd: 107, nombre: "Servilletas (Paquete 500)", precioUnitario: 55.00, categoria: "Varios" },
];