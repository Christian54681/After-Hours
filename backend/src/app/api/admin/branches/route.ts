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
        // 1. Crear las Mesas y obtener sus IDs
        const seccionesConIds = await Promise.all(secciones.map(async (sec: any) => {
            // Insertar todas las mesas de esta sección
            const mesasResult = await db.collection("tables").insertMany(
                sec.mesas.map((m: any) => ({ ...m, estado: 1 })) // 1 = Libre
            );

            // 2. Crear la Sección vinculada a esas mesas
            const seccionResult = await db.collection("sections").insertOne({
                idSeccion: sec.idSeccion,
                nombre: sec.nombreSeccion,
                idMesas: Object.values(mesasResult.insertedIds)
            });

            return seccionResult.insertedId;
        }));

        // 3. Crear la Sucursal vinculada a las secciones
        const nuevaSucursal = {
            idSucursal,
            nombre,
            direccion,
            tipoBar,
            idSecciones: seccionesConIds,
            createdAt: new Date(),
            creadoPor: payload.username
        };

        await db.collection("branches").insertOne(nuevaSucursal);

        return NextResponse.json({ success: true, message: "Sucursal y toda su infraestructura creada" });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al crear la infraestructura" }, { status: 500 });
    }
}

// GET: Obtener todas las sucursales
export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("after_hours");

        const branches = await db.collection("branches").aggregate([
            {
                // Unir con Secciones
                $lookup: {
                    from: "sections",
                    localField: "idSecciones",
                    foreignField: "_id",
                    as: "seccionesCompletas"
                }
            },
            {
                // "Desenrollar" secciones para poder buscar sus mesas
                $unwind: { path: "$seccionesCompletas", preserveNullAndEmptyArrays: true }
            },
            {
                // Unir con Mesas
                $lookup: {
                    from: "tables",
                    localField: "seccionesCompletas.idMesas",
                    foreignField: "_id",
                    as: "seccionesCompletas.mesasCompletas"
                }
            },
            {
                // Volver a agrupar todo en la sucursal original
                $group: {
                    _id: "$_id",
                    idSucursal: { $first: "$idSucursal" },
                    nombre: { $first: "$nombre" },
                    direccion: { $first: "$direccion" },
                    tipoBar: { $first: "$tipoBar" },
                    secciones: { $push: "$seccionesCompletas" }
                }
            }
        ]).toArray();

        return NextResponse.json(branches);
    } catch (error) {
        return NextResponse.json({ error: "Error al reconstruir sucursales" }, { status: 500 });
    }
}