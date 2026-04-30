// domain/UserFactory.ts
import { AdminGeneral } from "./1_Usuarios/AdminGeneral";
import { AdminSucursal } from "./1_Usuarios/AdminSucursal";
import { Bartender } from "./1_Usuarios/Bartender";
import { Cajero } from "./1_Usuarios/Cajero";
import { Contador } from "./1_Usuarios/Contador";
import { Mesero } from "./1_Usuarios/Mesero";
import { PersonalOperativo } from "./1_Usuarios/PersonalOperativo";
import { Usuario } from "./1_Usuarios/Usuario";
import { Empleado } from "./1_Usuarios/Empleado";
import { Cliente } from "./9_Cliente/Cliente";

export class UserFactory {
    static crearUsuario(data: any) {
        const { tipo, email, username, info, createdAt , password} = data;
        
        if (!tipo) {
            throw new Error("Datos insuficientes: falta el tipo de usuario");
        }
        
        const fechaCreacion = createdAt ? new Date(createdAt) : new Date();

        const datosInfo = info || {};

        //caso base: usuario o clienet
        if (tipo === "Cliente" || tipo === "cliente") {
            return new Cliente(
                data.idCliente || 0,
                username || email.split('@')[0],
                email,
                createdAt,
                info || []
            );
        }

        if (tipo === "Empleado" || tipo === "empleado") {
            if (!info) {
                throw new Error("Datos insuficientes: los empleados requieren información adicional (info)");
            }

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