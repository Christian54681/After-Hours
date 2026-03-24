import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import clientPromise from '../../../../../lib/mongodb';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'nosecreto');

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();

        const client = await clientPromise;
        const db = client.db("after_hours");

        // Buscar usuario por username
        const usuario = await db.collection("users").findOne({ username });

        if (!usuario) {
            return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 });
        }

        // verificar la contraseña
        const passwordValido = await bcrypt.compare(password, usuario.password);
        if (!passwordValido) {
            return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 });
        }

        const rol = usuario.tipo === 'empleado' ? usuario.empleadoInfo.tipoRol : 'Cliente';

        const token = await new SignJWT({
            id: usuario._id,
            username: usuario.username,
            tipo: usuario.tipo,
            tipoRol: rol,
            idSucursal: usuario.empleadoInfo?.idSucursal || null
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('8h')
            .sign(JWT_SECRET);

        return NextResponse.json({
            success: true,
            token,
            user: {
                username: usuario.username,
                tipo: usuario.tipo,
                rol: rol
            }
        });

    } catch (error) {
        console.error("Error en Login:", error);
        return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
    }
}