import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import clientPromise from '../../../../../lib/mongodb';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'nosecreto');

export async function POST(req: Request) {
    try {
        const body = await req.json();
        // Extraemos los datos según tu estructura
        const { password, email, tipo, datosEmpleado } = body;
        let { username } = body; // Username manual para clientes

        const client = await clientPromise;
        const db = client.db("after_hours");

        // 1. LÓGICA DE SEGURIDAD Y GENERACIÓN DE USERNAME PARA EMPLEADOS
        if (tipo === "empleado") {
            // SEGURIDAD: Verificar Token del Admin
            const authHeader = req.headers.get('authorization');
            const token = authHeader?.split(' ')[1];

            if (!token) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

            try {
                const { payload } = await jwtVerify(token, JWT_SECRET);
                const rolesAutorizados = ['AdminGeneral', 'AdminSucursal'];
                if (!rolesAutorizados.includes(payload.tipoRol as string)) {
                    return NextResponse.json({ error: "No tienes permiso" }, { status: 403 });
                }
            } catch (err) {
                return NextResponse.json({ error: "Token inválido" }, { status: 401 });
            }

            // --- GENERACIÓN AUTOMÁTICA DEL USERNAME DESDE datosEmpleado ---
            if (datosEmpleado && datosEmpleado.nombreCompleto) {
                const baseUsername = datosEmpleado.nombreCompleto
                    .toLowerCase()
                    .trim()
                    .split(/\s+/) 
                    .slice(0, 2)   
                    .join('.');
                
                // Evitar duplicados en la base de datos
                const existeUsername = await db.collection("users").findOne({ username: baseUsername });
                username = existeUsername ? `${baseUsername}${Math.floor(Math.random() * 100)}` : baseUsername;
            } else {
                return NextResponse.json({ error: "El nombre completo es obligatorio para empleados" }, { status: 400 });
            }
        }

        // 2. VERIFICAR DUPLICADOS
        const existe = await db.collection("users").findOne({ $or: [{ username }, { email }] });
        if (existe) return NextResponse.json({ error: "El usuario o email ya existe" }, { status: 400 });

        // 3. ENCRIPTAR CONTRASEÑA
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. ESTRUCTURA FINAL DEL DOCUMENTO
        const nuevoUsuario: any = {
            username, // El generado automáticamente
            email,
            password: hashedPassword,
            tipo,
            createdAt: new Date(),
        };

        if (tipo === "empleado" && datosEmpleado) {
            nuevoUsuario.empleadoInfo = {
                idEmpleado: Math.floor(Math.random() * 10000),
                nombreCompleto: datosEmpleado.nombreCompleto, // <--- Aquí vive ahora
                telefono: datosEmpleado.telefono,
                tipoRol: datosEmpleado.tipoRol,
                estado: "Activo",
                idSucursal: datosEmpleado.idSucursal
            };
        } else {
            nuevoUsuario.clienteInfo = { puntosLealtad: 0 };
        }

        await db.collection("users").insertOne(nuevoUsuario);

        return NextResponse.json({ 
            success: true, 
            message: "Empleado creado con éxito",
            usernameGenerado: username // Para que el Admin se lo dé al empleado
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
    }
}