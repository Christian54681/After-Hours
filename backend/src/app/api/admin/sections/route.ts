import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import clientPromise from '../../../../../lib/mongodb';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'mi_secreto_super_seguro');

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get('authorization');
        const token = authHeader?.split(' ')[1];
        if (!token) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
        await jwtVerify(token, JWT_SECRET);

        const { idSucursal, nombreSeccion, idSeccionManual, capacidadMax } = await req.json();
        const client = await clientPromise;
        const db = client.db("after_hours");

        // Crear el objeto de la sección
        const nuevaSeccion = {
            idSeccion: idSeccionManual,
            nombre: nombreSeccion,
            capacidadMax: Number(capacidadMax) || 0,
            mesasIds: [],
            mesasCompletas: []
        };

        // Insertar en la colección global de secciones
        const seccionResult = await db.collection("sections").insertOne(nuevaSeccion);
        const newId = seccionResult.insertedId;

        // Vincular a la sucursal: Objeto embebido + Array de IDs (seccionesIds)
        const updateResult = await db.collection("branches").updateOne(
            { idSucursal: idSucursal },
            {
                $push: {
                    secciones: {
                        _id: newId,
                        ...nuevaSeccion
                    },
                    seccionesIds: newId
                } as any,
                $set: { updatedAt: new Date() }
            }
        );

        if (updateResult.matchedCount === 0) {
            return NextResponse.json({ error: "Sucursal no encontrada para vincular" }, { status: 404 });
        }

        return NextResponse.json({ success: true, idSeccionDB: newId });

    } catch (error) {
        console.error("Error al crear sección:", error);
        return NextResponse.json({ error: "Error al crear y vincular sección" }, { status: 500 });
    }
}