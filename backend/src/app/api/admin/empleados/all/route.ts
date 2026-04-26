import { NextResponse } from 'next/server';

import { jwtVerify } from 'jose';
import clientPromise from '../../../../../../lib/mongodb';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'mi_secreto_super_seguro');

export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get('authorization');
        const token = authHeader?.split(' ')[1];
        if (!token) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

        const { payload } = await jwtVerify(token, JWT_SECRET);
        const rolUsuario = payload.tipoRol as string;

        // Verificación de seguridad
        if (rolUsuario !== 'AdminGeneral' && rolUsuario !== 'AdminSucursal') {
            return NextResponse.json({ error: "No autorizado" }, { status: 403 });
        }

        const client = await clientPromise;
        const db = client.db("after_hours");
        let filtro: any = { tipo: "empleado", "empleadoInfo.estado": "Activo" };

        // Filtro Inteligente
        if (rolUsuario === 'AdminSucursal') {
            // Si por algún error el token no trae idSucursal, lanzamos error para no mostrar nada
            if (!payload.idSucursal) {
                return NextResponse.json({ error: "Sesión sin sucursal asignada" }, { status: 400 });
            }
            filtro["empleadoInfo.idSucursal"] = payload.idSucursal;
        }

        const empleados = await db.collection("users")
            .find(filtro)
            .project({ password: 0 })
            .toArray();

        // Respuesta limpia
        return NextResponse.json({
            success: true,
            data: empleados // El front usará response.data.data para el map
        });

    } catch (error: any) {
        if (error.code === 'ERR_JWT_EXPIRED') {
            return NextResponse.json({ error: "Sesión expirada" }, { status: 401 });
        }
        return NextResponse.json({ error: "Error de servidor" }, { status: 500 });
    }
}