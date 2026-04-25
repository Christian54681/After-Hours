// domain/UserFactory.ts
import { Cliente } from "./9_Cliente/Cliente";
import { Mesero } from "./1_Usuarios/Mesero";
import { AdminSucursal } from "./1_Usuarios/AdminSucursal";

export class UserFactory {
    static crearUsuario(data: any) {
        const { tipo, email, username, info, _id } = data;

        if (tipo === "Cliente") {
            return new Cliente(_id, username, email, info, tipo);
        }

        if (tipo === "empleado") {
            switch (info.tipoRol) {
                case "Mesero":
                    return new Mesero(
                        _id,                     // 1. id
                        info.nombreCompleto,    // 2. nombre
                        email,                  // 3. email
                        info.telefono || "",    // 4. telefono
                        info.estado || 'activo',// 5. estado
                        info.tipoRol,           // 6. tipoRol
                        info.idEmpleado.toString(), // 7. idEmpleado
                        info.areaActual,        // 8. areaActual
                        info.activo ?? true,    // 9. activo (boolean)
                        info.zonaAsignada,      // 10. zonaAsignada
                        info.mesasACargo || []  // 11. mesasACargo
                    );

                case "AdminSucursal":
                case "AdminGeneral":
                    return new AdminSucursal(
                        _id,
                        info.nombreCompleto,
                        email,
                        info.telefono || "",
                        info.estado || 'activo',
                        info.tipoRol,
                        info.idEmpleado.toString(),
                        info.idSucursalACargo || 0,
                        info.presupuestoSucursal || 0
                    );

                
                default:
                    throw new Error(`Rol de empleado no reconocido: ${info.tipoRol}`);
            }
        }
        throw new Error("Tipo de usuario desconocido");
    }
}