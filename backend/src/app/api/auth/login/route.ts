import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import clientPromise from '../../../../../lib/mongodb';


const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'nosecreto');

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        const client = await clientPromise;
        const db = client.db("after_hours");

        // Buscar usuario por EMAIL
        const usuario = await db.collection("users").findOne({ email });

        if (!usuario) {
            return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 });
        }

        // Verificar la contraseña
        const passwordValido = await bcrypt.compare(password, usuario.password);
        if (!passwordValido) {
            return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 });
        }

        // Determinar el rol
        const rol = usuario.tipo === 'empleado' ? usuario.empleadoInfo?.tipoRol : 'Cliente';

        // Generar el Token
        const token = await new SignJWT({
            id: usuario._id,
            email: usuario.email,
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
                id: usuario._id,
                email: usuario.email,
                username: usuario.username,
                tipo: usuario.tipo,
                createdAt: usuario.createdAt,
                info: usuario.tipo === 'empleado' ? { ...usuario.empleadoInfo, idEmpleado: usuario._id, idSucursal: usuario.empleadoInfo?.idSucursal } : usuario.tipo === "Cliente" || usuario.tipo === "cliente" ? { ...usuario.clienteInfo } : null
            }
        });

    } catch (error) {
        console.error("Error en Login:", error);
        return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
    }
}