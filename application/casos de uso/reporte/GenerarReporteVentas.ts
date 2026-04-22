import { AdminGeneral } from "../../../domain/1_Usuarios/AdminGeneral";
import {ReporteGerencial} from "../../domain/7_Reportes/ReporteGerencial"


export interface FiltrosReporteVentas {
  idSucursal?: number;
  fechaInicio: Date;
  fechaFin: Date;
  tipoReporte: string;        // "Ingresos por Ventas", "Utilidad Neta", etc.
  formatoSalida: string;      // "PDF", "Excel", etc.
}

export interface ResultadoReporteVentas {
  success: boolean;
  mensaje: string;
  reporte?: ReporteGerencial;
  urlDescarga?: string;
}

export class GenerarReporteVentasCasoDeUso {

  constructor() {
    // Más adelante inyectarás:
    // private reporteRepository: IReporteRepository
    // private ventaRepository: IVentaRepository
  }

  async execute(
    admin: AdminGeneral,
    filtros: FiltrosReporteVentas
  ): Promise<ResultadoReporteVentas> {

    try {
      // 1. Validaciones según la especificación del documento
      if (!filtros.fechaInicio || !filtros.fechaFin) {
        return {
          success: false,
          mensaje: "Las fechas de inicio y fin son obligatorias"
        };
      }

      if (filtros.fechaInicio > filtros.fechaFin) {
        return {
          success: false,
          mensaje: "La fecha de inicio no puede ser mayor a la fecha de fin"
        };
      }

      if (!filtros.tipoReporte) {
        return {
          success: false,
          mensaje: "El tipo de reporte es obligatorio"
        };
      }

      console.log(`AdminGeneral ${admin.getNombre()} está generando reporte de ventas`);

      // 2. Validar rango de fechas (Excepción E2 del documento)
      const diasDiferencia = (filtros.fechaFin.getTime() - filtros.fechaInicio.getTime()) / (1000 * 3600 * 24);
      
      if (diasDiferencia > 365) {
        return {
          success: false,
          mensaje: "El rango de fechas no puede superar 1 año"
        };
      }

      // 3. Aquí se consultaría la base de datos para obtener los datos de ventas
      // const ventas = await this.ventaRepository.obtenerVentasPorFiltros(filtros);

      console.log(`Procesando reporte del periodo: ${filtros.fechaInicio.toLocaleDateString()} - ${filtros.fechaFin.toLocaleDateString()}`);
      console.log(`Sucursal: ${filtros.idSucursal || 'Todas las sucursales'}`);
      console.log(`Tipo de reporte: ${filtros.tipoReporte}`);

      // 4. Crear el reporte usando la clase de dominio
      const reporte = new ReporteGerencial(
        Date.now(),                                   // idReporte
        `${filtros.fechaInicio.toLocaleDateString()} - ${filtros.fechaFin.toLocaleDateString()}`, // periodo
        125450.75,                                    // utilidadNeta (simulación)
        filtros.idSucursal ? 1 : 4                    // sucursalesAnalizadas
      );

      // 5. Ejecutar métodos del dominio
      reporte.consolidarVentasTotales();
      reporte.identificarProductoMasVendido();
      reporte.identificarMejorSucursal();

      // 6. Exportar a PDF si se solicitó (como indica el documento)
      if (filtros.formatoSalida === "PDF") {
        reporte.exportarPDF();
      }

      // 7. Registrar auditoría
      console.log(`AUDITORÍA: Reporte de ventas generado por ${admin.getNombre()}`);

      return {
        success: true,
        mensaje: "Reporte de ventas generado correctamente",
        reporte: reporte,
        urlDescarga: `/reportes/ventas/${reporte.idReporte}.pdf`   // simulación
      };

    } catch (error: any) {
      console.error("Error al generar reporte de ventas:", error);
      return {
        success: false,
        mensaje: "Error interno al generar el reporte de ventas"
      };
    }
  }
}