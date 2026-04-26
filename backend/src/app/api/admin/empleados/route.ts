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
            if (!['AdminGeneral', 'AdminSucursal'].includes(payload.tipoRol as string)) {
                return NextResponse.json({ error: "No autorizado" }, { status: 403 });
            }
        } catch {
            return NextResponse.json({ error: "Token inválido" }, { status: 401 });
        }

        // Validación de datos mínimos
        if (!email || !password || !datosEmpleado?.nombreCompleto) {
            return NextResponse.json({ error: "Email, contraseña y nombre son obligatorios" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("after_hours");

        // Generación de Username Único
        const baseUsername = datosEmpleado.nombreCompleto
            .toLowerCase()
            .trim()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/ñ/g, "n")
            .split(/\s+/)
            .slice(0, 2)
            .join('.');

        const existeUsername = await db.collection("users").findOne({ username: baseUsername });
        const finalUsername = existeUsername
            ? `${baseUsername}${Math.floor(Math.random() * 999)}`
            : baseUsername;

        // Verificar Duplicados
        const existeEmail = await db.collection("users").findOne({ email: email.toLowerCase().trim() });
        if (existeEmail) return NextResponse.json({ error: "Este correo ya está registrado" }, { status: 400 });

        // Encriptar Contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Construir Objeto Final
        const nuevoEmpleado = {
            username: finalUsername,
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            tipo: "empleado",
            createdAt: new Date(),
            empleadoInfo: {
                nombreCompleto: datosEmpleado.nombreCompleto,
                telefono: datosEmpleado.telefono || "",
                tipoRol: datosEmpleado.tipoRol || "Empleado",
                idSucursal: datosEmpleado.idSucursal,
                estado: "Activo",
            }
        };

        await db.collection("users").insertOne(nuevoEmpleado);

        // AQUÍ IRÍA LA FUNCIÓN DE ENVIAR CORREO
        console.log(`Enviando correo a ${email} con user: ${finalUsername} y pass: ${password}`);

        return NextResponse.json({
            success: true,
            message: "Empleado creado con éxito",
            username: finalUsername
        });

    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }
}