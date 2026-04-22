import { AdminGeneral } from "../../../domain/1_Usuarios/AdminGeneral";
import { Empleado } from "../../../domain/1_Usuarios/Empleado";


export interface DatosRegistroEmpleado {
    nombreCompleto: string;
    rol: string;
    idSucursal: number;
    email: string;
    telefono: string;
}

export interface ResultadoRegistroEmpleado {
    success: boolean;
    mensaje: string;
    empleadoId?: string;
    emailTemporal?: string;   //clave temporal
}

export class RegistrarEmpleadoCasoDeUso {

    constructor() {
    }

    async execute(
        admin: AdminGeneral,
        datos: DatosRegistroEmpleado
    ): Promise<ResultadoRegistroEmpleado> {

        try {
            if (!datos.nombreCompleto || datos.nombreCompleto.trim() === '') {
                return { success: false, mensaje: "El nombre completo es obligatorio" };
            }

            if (!datos.rol || datos.rol.trim() === '') {
                return { success: false, mensaje: "El rol es obligatorio" };
            }

            if (!datos.idSucursal) {
                return { success: false, mensaje: "La sucursal es obligatoria" };
            }

            if (!datos.email || !datos.email.includes('@')) {
                return { success: false, mensaje: "El email debe ser válido" };
            }

            if (!datos.telefono) {
                return { success: false, mensaje: "El teléfono es obligatorio" };
            }

            console.log(`AdminGeneral ${admin.getNombre()} está registrando un nuevo empleado`);

            const existeEmail = false;
            if (existeEmail) {
                return {
                    success: false,
                    mensaje: "El email ya está registrado en el sistema"
                };
            }

            const nuevoEmpleado = new Empleado(
                crypto.randomUUID(),           //id de ejemplo
                datos.nombreCompleto,
                datos.email,
                datos.telefono,
                'activo',                      //inicia en activo
                datos.rol,
                crypto.randomUUID()            //id de ejemplo
            );


            const claveTemporal = `temp-${Math.random().toString(36).slice(2, 10)}`;

            console.log(`Empleado registrado exitosamente:`);
            console.log(`Nombre: ${datos.nombreCompleto}`);
            console.log(`Rol: ${datos.rol}`);
            console.log(`Sucursal ID: ${datos.idSucursal}`);
            console.log(`Email: ${datos.email}`);
            console.log(`Clave temporal generada: ${claveTemporal}`);

            console.log(`Nuevo empleado registrado por ${admin.getNombre()}`);

            return {
                success: true,
                mensaje: "Empleado registrado correctamente",
                empleadoId: nuevoEmpleado.getId(),
                emailTemporal: claveTemporal
            };

        } catch (error: any) {
            console.error("Error al registrar empleado:", error);
            return {
                success: false,
                mensaje: "Error interno al registrar el empleado"
            };
        }
    }
}