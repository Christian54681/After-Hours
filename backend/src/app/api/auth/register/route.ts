import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import clientPromise from '../../../../../lib/mongodb';


export async function POST(req: Request) {
    try {
        const { username, email, password } = await req.json();

        if (!username || !email || !password) {
            return NextResponse.json({ error: "Todos los campos son obligatorios" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("after_hours");

        // Verificar si ya existe
        const existe = await db.collection("users").findOne({
            $or: [{ username }, { email }]
        });
        
        if (existe) {
            return NextResponse.json({ error: "El usuario o email ya existe" }, { status: 400 });
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear documento de Cliente
        const nuevoCliente = {
            username: username.toLowerCase().trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            tipo: "cliente", // Forzamos tipo cliente
            createdAt: new Date(),
            clienteInfo: {
                puntosLealtad: 0
            }
        };

        await db.collection("users").insertOne(nuevoCliente);

        return NextResponse.json({
            success: true,
            message: "Usuario registrado con éxito"
        });

    } catch (error) {
        console.error("Error en Registro Cliente:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}