import { AdminGeneral } from "../../../domain/1_Usuarios/AdminGeneral";
import { Empleado } from "../../../domain/1_Usuarios/Empleado";


export interface DatosTurno {
  idEmpleado: string;
  idSucursal: number;
  horarioEntrada: string;     
  horarioSalida: string;      
  diasSemana: string[];       
}

export interface ResultadoControlTurnos {
  success: boolean;
  mensaje: string;
  turnoId?: string;
}

export class ControlDeTurnosCasoDeUso {

  constructor() {

  }

  async execute(
    admin: AdminGeneral, 
    datosTurno: DatosTurno
  ): Promise<ResultadoControlTurnos> {

    try {
      if (!datosTurno.idEmpleado || !datosTurno.idSucursal) {
        return {
          success: false,
          mensaje: "El ID del empleado y de la sucursal son obligatorios"
        };
      }

      if (!datosTurno.horarioEntrada || !datosTurno.horarioSalida) {
        return {
          success: false,
          mensaje: "Horario de entrada y salida son obligatorios"
        };
      }

      if (datosTurno.diasSemana.length === 0) {
        return {
          success: false,
          mensaje: "Debe seleccionar al menos un día de la semana"
        };
      }
      console.log(`AdminGeneral ${admin.getNombre()} está asignando un nuevo turno`);

      const tieneConflicto = false; //simulacion

      if (tieneConflicto) {
        return {
          success: false,
          mensaje: "El empleado ya tiene un turno asignado en ese horario"
        };
      }

      //crea un gaurda un turno de ejemplo
      const turnoId = `turno-${Date.now()}`;

      console.log(`Turno asignado correctamente:`);
      console.log(`- Empleado ID: ${datosTurno.idEmpleado}`);
      console.log(`- Sucursal ID: ${datosTurno.idSucursal}`);
      console.log(`- Horario: ${datosTurno.horarioEntrada} - ${datosTurno.horarioSalida}`);
      console.log(`- Días: ${datosTurno.diasSemana.join(", ")}`);


      return {
        success: true,
        mensaje: "Turno asignado correctamente",
        turnoId: turnoId
      };

    } catch (error: any) {
      console.error("Error al asignar turno:", error);
      return {
        success: false,
        mensaje: "Error interno al procesar el control de turnos"
      };
    }
  }
}