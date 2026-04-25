import { NextResponse } from 'next/server';

import { jwtVerify } from 'jose';
import clientPromise from '../../../../../../lib/mongodb';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'mi_secreto_super_seguro');

export async function GET(req: Request) {
    try {
        // extraer y verificar el Token
        const authHeader = req.headers.get('authorization');
        const token = authHeader?.split(' ')[1];

        if (!token) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

        const { payload } = await jwtVerify(token, JWT_SECRET);

        // Validar rol (AdminGeneral ve todo, AdminSucursal ve solo su sucursal)
        const rolesAdmitidos = ['AdminGeneral', 'AdminSucursal'];
        const rolUsuario = payload.tipoRol as string;

        if (!rolesAdmitidos.includes(rolUsuario)) {
            return NextResponse.json({ error: "No tienes permisos para esta acción" }, { status: 403 });
        }

        const client = await clientPromise;
        const db = client.db("after_hours");

        let filtro: any = { tipo: "empleado" };

        // Si es AdminSucursal, solo permitimos ver empleados de su ID de sucursal
        if (rolUsuario === 'AdminSucursal') {
            filtro["empleadoInfo.idSucursal"] = payload.idSucursal;
        }

        const empleados = await db.collection("users")
            .find(filtro)
            .project({ password: 0 })
            .toArray();

        return NextResponse.json({
            success: true,
            count: empleados.length,
            contexto: {
                rolSolicitante: rolUsuario,
                sucursalFiltrada: rolUsuario === 'AdminGeneral' ? "Global" : payload.idSucursal
            },
            data: empleados
        });

    } catch (error) {
        console.error("Error en GET Employees:", error);
        return NextResponse.json({ error: "Token inválido o error de servidor" }, { status: 401 });
    }
}