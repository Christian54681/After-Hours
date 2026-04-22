import { Usuario } from "../../../domain/1_Usuarios/Usuario";

export interface Credenciales {
  email: string;
  password: string;
}

export interface ResultadoInicioSesion {
  success: boolean;
  usuario?: Usuario;
  mensaje?: string;
  token?: string;           
}

export class IniciarSesionCasoDeUso {

  constructor() {

  }

  async execute(credenciales: Credenciales): Promise<ResultadoInicioSesion> {
    
    try {
      //validaciones bascicas
      if (!credenciales.email || !credenciales.password) {
        return {
          success: false,
          mensaje: "Email y contraseña son obligatorios"
        };
      }

      console.log(`Iniciando sesión: ${credenciales.email}`);

      const usuarioSimulado = new Usuario(
        "usr-001",
        "tilin tilin",
        credenciales.email,
        "555-123-4567",
        "activo"
      );

      const esValido = true; //simulacion

      if (!esValido) {
        return {
          success: false,
          mensaje: "Credenciales incorrectas"
        };
      }

      usuarioSimulado.login();

      console.log(`✅ Inicio de sesión exitoso para: ${credenciales.email}`);

      return {
        success: true,
        usuario: usuarioSimulado,
        mensaje: "Inicio de sesión exitoso",
      };

    } catch (error: any) {
      console.error("Error en inicio de sesión:", error);
      return {
        success: false,
        mensaje: "Error interno del sistema. Intente más tarde."
      };
    }
  }
}