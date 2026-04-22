import { AdminGeneral } from "../../../domain/1_Usuarios/AdminGeneral";
import { Empleado } from "../../../domain/1_Usuarios/Empleado";


export interface DatosBajaEmpleado {
  idEmpleado: string;
  motivo: string;         
}

export interface ResultadoBajaEmpleado {
  success: boolean;
  mensaje: string;
  empleadoId?: string;
}

export class DarDeBajaEmpleadoCasoDeUso {

  constructor() {

  }

  async execute(
    admin: AdminGeneral,
    datos: DatosBajaEmpleado
  ): Promise<ResultadoBajaEmpleado> {

    try {
      if (!datos.idEmpleado || datos.idEmpleado.trim() === '') {
        return {
          success: false,
          mensaje: "El ID del empleado es obligatorio"
        };
      }

      if (!datos.motivo || datos.motivo.trim() === '') {
        return {
          success: false,
          mensaje: "El motivo de baja es obligatorio"
        };
      }

      console.log(`AdminGeneral ${admin.getNombre()} está procesando baja de empleado`);

      //buscar al empleado por irse a chingar a su madre

      //ejemplo si hay un empleado
      console.log(`Empleado encontrado con ID: ${datos.idEmpleado}`);

      const tieneProcesosPendientes = false; 

      if (tieneProcesosPendientes) {
        return {
          success: false,
          mensaje: "No se puede dar de baja al empleado porque tiene procesos pendientes (ej. caja abierta)"
        };
      }

      console.log(`Empleado ${datos.idEmpleado} dado de baja correctamente`);
      console.log(`Motivo: ${datos.motivo}`);

      console.log(`AUDITORÍA: Baja de empleado realizada por ${admin.getNombre()}. Motivo: ${datos.motivo}`);

      return {
        success: true,
        mensaje: `Empleado ${datos.idEmpleado} dado de baja correctamente`,
        empleadoId: datos.idEmpleado
      };

    } catch (error: any) {
      console.error("Error al dar de baja empleado:", error);
      return {
        success: false,
        mensaje: "Error interno al procesar la baja del empleado"
      };
    }
  }
}