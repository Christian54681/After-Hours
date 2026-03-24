import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import clientPromise from '../../../../../lib/mongodb';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'nosecreto');

export async function POST(req: Request) {
    try {
        const { username, password, email, tipo, datosEmpleado } = await req.json();

        // LÓGICA DE SEGURIDAD PARA EMPLEADOS
        if (tipo === "empleado") {
            const authHeader = req.headers.get('authorization');
            const token = authHeader?.split(' ')[1];

            if (!token) {
                return NextResponse.json({ error: "No autenticado" }, { status: 401 });
            }

            try {
                const { payload } = await jwtVerify(token, JWT_SECRET);
                
                const rolesAutorizados = ['AdminGeneral', 'AdminSucursal'];
                const usuarioEsGerente = rolesAutorizados.includes(payload.tipoRol as string);

                if (!usuarioEsGerente) {
                    return NextResponse.json({ error: "No tienes permiso para crear empleados" }, { status: 403 });
                }
            } catch (err) {
                return NextResponse.json({ error: "Token inválido o expirado" }, { status: 401 });
            }
        }

        const client = await clientPromise;
        const db = client.db("after_hours");

        // Verificar duplicados
        const existe = await db.collection("users").findOne({ $or: [{ username }, { email }] });
        if (existe) return NextResponse.json({ error: "El usuario o email ya existe" }, { status: 400 });

        const hashedPassword = await bcrypt.hash(password, 10);

        const nuevoUsuario: any = {
            username,
            email,
            password: hashedPassword,
            tipo,
            createdAt: new Date(),
        };

        if (tipo === "empleado" && datosEmpleado) {
            nuevoUsuario.empleadoInfo = {
                idEmpleado: Math.floor(Math.random() * 10000),
                telefono: datosEmpleado.telefono,
                tipoRol: datosEmpleado.tipoRol,
                estado: "Activo",
                idSucursal: datosEmpleado.idSucursal
            };
        } else {
            nuevoUsuario.clienteInfo = { puntosLealtad: 0, preferencias: [] };
        }

        await db.collection("users").insertOne(nuevoUsuario);
        return NextResponse.json({ success: true, message: "Usuario creado correctamente" });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
    }
}