import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

import { jwtVerify } from 'jose';
import clientPromise from '../../../../../lib/mongodb';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'nosecreto');

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password, datosEmpleado } = body;

        // Verificar Token del Admin
        const authHeader = req.headers.get('authorization');
        const token = authHeader?.split(' ')[1];

        if (!token) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

        try {
            const { payload } = await jwtVerify(token, JWT_SECRET);
            const rolesAutorizados = ['AdminGeneral', 'AdminSucursal'];

            if (!rolesAutorizados.includes(payload.tipoRol as string)) {
                return NextResponse.json({ error: "No tienes permisos de administrador" }, { status: 403 });
            }
        } catch (err) {
            return NextResponse.json({ error: "Token inválido o expirado" }, { status: 401 });
        }

        // VALIDACIÓN DE DATOS
        if (!datosEmpleado || !datosEmpleado.nombreCompleto) {
            return NextResponse.json({ error: "El nombre completo es obligatorio para empleados" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("after_hours");

        // GENERACIÓN AUTOMÁTICA DEL USERNAME (ej: nombre.apellido)
        const baseUsername = datosEmpleado.nombreCompleto
            .toLowerCase()
            .trim()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Quitar acentos
            .split(/\s+/)
            .slice(0, 2)
            .join('.');

        // Evitar colisión de usernames
        const existeUsername = await db.collection("users").findOne({ username: baseUsername });
        const finalUsername = existeUsername
            ? `${baseUsername}${Math.floor(Math.random() * 99)}`
            : baseUsername;

        // VERIFICAR EMAIL DUPLICADO
        const existeEmail = await db.collection("users").findOne({ email });
        if (existeEmail) return NextResponse.json({ error: "El email ya está registrado" }, { status: 400 });

        // ENCRIPTAR Y GUARDAR
        const hashedPassword = await bcrypt.hash(password, 10);

        const nuevoEmpleado = {
            username: finalUsername,
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            tipo: "empleado",
            createdAt: new Date(),
            empleadoInfo: {
                idEmpleado: Math.floor(Math.random() * 10000),
                nombreCompleto: datosEmpleado.nombreCompleto,
                telefono: datosEmpleado.telefono || "",
                tipoRol: datosEmpleado.tipoRol, // Mesero, Bartender, etc.
                estado: "Activo",
                idSucursal: datosEmpleado.idSucursal
            }
        };

        await db.collection("users").insertOne(nuevoEmpleado);

        return NextResponse.json({
            success: true,
            message: "Empleado creado con éxito",
            usernameGenerado: finalUsername
        });

    } catch (error) {
        console.error("Error en Creación Empleado:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}