import { NextResponse } from 'next/server';

import { jwtVerify } from 'jose';
import clientPromise from '../../../../../lib/mongodb';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'mi_secreto_super_seguro');

// POST: Crear una nueva sucursal con sus secciones y mesas
export async function POST(req: Request) {
    try {
        // Validar Token y Rol
        const authHeader = req.headers.get('authorization');
        const token = authHeader?.split(' ')[1];

        if (!token) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

        const { payload } = await jwtVerify(token, JWT_SECRET);

        // Solo AdminGeneral puede crear sucursales
        if (payload.tipoRol !== 'AdminGeneral') {
            return NextResponse.json({ error: "Acceso denegado: Se requiere ser AdminGeneral" }, { status: 403 });
        }

        const body = await req.json();
        const { idSucursal, nombre, direccion, tipoBar, secciones } = body;

        // Validar campos obligatorios
        if (!idSucursal || !nombre || !tipoBar) {
            return NextResponse.json({ error: "Faltan campos obligatorios (id, nombre o tipo)" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("after_hours");

        // Evitar duplicados
        const existe = await db.collection("branches").findOne({ idSucursal });
        if (existe) {
            return NextResponse.json({ error: "El ID de sucursal ya existe" }, { status: 400 });
        }

        // Insertar con la estructura anidada para facilitar la POO
        const nuevaSucursal = {
            idSucursal,
            nombre,
            direccion,
            tipoBar,
            secciones: secciones || [],
            createdAt: new Date(),
            creadoPor: payload.username
        };

        await db.collection("branches").insertOne(nuevaSucursal);

        return NextResponse.json({
            success: true,
            message: `Sucursal '${nombre}' creada con éxito`
        });

    } catch (error) {
        console.error("Error en Branches:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}

// GET: Obtener todas las sucursales
export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("after_hours");
        const branches = await db.collection("branches").find({}).toArray();
        return NextResponse.json(branches);
    } catch (error) {
        return NextResponse.json({ error: "Error al obtener sucursales" }, { status: 500 });
    }
}