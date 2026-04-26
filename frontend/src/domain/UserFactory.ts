// domain/UserFactory.ts
import { AdminGeneral } from "./1_Usuarios/AdminGeneral";
import { AdminSucursal } from "./1_Usuarios/AdminSucursal";
import { Bartender } from "./1_Usuarios/Bartender";
import { Cajero } from "./1_Usuarios/Cajero";
import { Contador } from "./1_Usuarios/Contador";
import { Mesero } from "./1_Usuarios/Mesero";
import { PersonalOperativo } from "./1_Usuarios/PersonalOperativo";
import { Usuario } from "./1_Usuarios/Usuario";
//import { Empleado } from "./1_Usuarios/Empleado";


export class UserFactory {
    static crearUsuario(data: any) {
        const { tipo, email, username, info, createdAt } = data;
        if (!tipo || !info) {
            throw new Error("Datos insuficientes para crear usuario");
        }
        const fechaCreacion = createdAt ? new Date(createdAt) : new Date();

        //caso base de usuario
        if (tipo === "Usuario" || tipo === "usuario" || tipo === "Cliente" || tipo === "cliente") {
            return new Usuario(
                info.nombreCompleto || info.nombre || "Usuario Anónimo",
                email,
                info.telefono || "",
                info.estado || 'activo',
                //fechaCreacion
            );

        }

        // Caso Empleado
        if (tipo === "Empleado" || tipo === "empleado") {
            const rol = info.tipoRol || "";
            switch (rol) {
                case "Mesero":
                    return new Mesero(
                        info.nombreCompleto,
                        email,
                        info.telefono || "",
                        info.estado || 'activo',
                        info.tipoRol,
                        info.idEmpleado?.toString(),
                        info.areaActual || "Sin asignar",
                        info.activo ?? true,
                        info.zonaAsignada || "Sin zona",
                        info.mesasACargo || 0
                    );

                case "Bartender":
                    return new Bartender(
                        info.nombreCompleto,
                        email,
                        info.telefono || "",
                        info.estado || 'activo',
                        info.tipoRol,
                        info.idEmpleado?.toString(),
                        info.areaActual || "Bar",
                        info.activo ?? true,
                        info.especialidad || "General",
                        info.barraAsignada || "Barra Principal"

                    );

                case "Contador":
                    return new Contador(
                        info.nombreCompleto,
                        email,
                        info.telefono || "",
                        info.estado || 'activo',
                        info.tipoRol,
                        info.idEmpleado?.toString(),
                        info.areaActual || "Contabilidad",
                        info.activo ?? true,
                        info.numCedula || "",
                        info.nivelAcceso || 2
                    );

                case "Cajero":
                    return new Cajero(
                        info.nombreCompleto,
                        email,
                        info.telefono || "",
                        info.estado || 'activo',
                        info.tipoRol,
                        info.idEmpleado?.toString(),
                        info.areaActual || "Caja",
                        info.activo ?? true,
                        info.numeroCaja || 1,
                        info.fondoInicial || 0
                    );

                case "AdminSucursal":
                    return new AdminSucursal(
                        info.nombreCompleto,
                        email,
                        info.telefono || "",
                        info.estado || 'activo',
                        info.tipoRol,
                        info.idEmpleado?.toString(),
                        info.idSucursalACargo || 0,
                        info.presupuestoSucursal || 0
                    );



                case "AdminGeneral":
                    return new AdminGeneral(
                        info.nombreCompleto,
                        email,
                        info.telefono || "",
                        info.estado || 'activo',
                        info.tipoRol,
                        info.idEmpleado?.toString(),
                        info.idGlobal || 1,
                        info.todasLasSucursales || []
                    );

                case "PersonalOperativo":
                    return new PersonalOperativo(
                        info.nombreCompleto,
                        email,
                        info.telefono || "",
                        info.estado || 'activo',
                        info.tipoRol,
                        info.idEmpleado?.toString(),
                        info.areaActual || "Operaciones",
                        info.activo ?? true
                    );
                default:
                    throw new Error(`Rol de empleado no reconocido: ${rol}`);
            }
        }
        throw new Error(`Tipo de usuario desconocido: ${tipo}`);

    }

}