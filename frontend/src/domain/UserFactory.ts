// domain/UserFactory.ts
import { AdminGeneral } from "./1_Usuarios/AdminGeneral";
import { AdminSucursal } from "./1_Usuarios/AdminSucursal";
import { Bartender } from "./1_Usuarios/Bartender";
import { Cajero } from "./1_Usuarios/Cajero";
import { Contador } from "./1_Usuarios/Contador";
import { Mesero } from "./1_Usuarios/Mesero";
import { PersonalOperativo } from "./1_Usuarios/PersonalOperativo";
import { Usuario } from "./1_Usuarios/Usuario";

export class UserFactory {

    static crearUsuario(data: any) {
        // Asegúrate de que createdAt esté disponible en 'data'
        const { tipo, email, username, info, createdAt } = data;

        if (!tipo || !info) {
            throw new Error("Datos insuficientes para crear usuario");
        }

        // Convertimos a Date real
        const fechaCreacion = createdAt ? new Date(createdAt) : new Date();

        // Caso Usuario Base
        if (tipo === "Usuario" || tipo === "usuario" || tipo === "Cliente" || tipo === "cliente") {
            return new Usuario(
                info.nombreCompleto || info.nombre || "Usuario Anónimo",
                email,
                info.telefono || "",
                info.estado || 'activo',
                username, // username
                undefined, // password
                fechaCreacion
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
                        info.mesasACargo || 0,
                        fechaCreacion

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
                        info.todasLasSucursales || [],
                        fechaCreacion // <--- Orden correcto
                    );

                // ... (Aplica la misma lógica para los demás roles asegurando el orden)

                default:
                    throw new Error(`Rol de empleado no reconocido: ${rol}`);
            }
        }

        throw new Error(`Tipo de usuario desconocido: ${tipo}`);
    }
}