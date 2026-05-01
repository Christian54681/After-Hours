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

        // Insertar en la colección de secciones (opcional, pero buena práctica)
        const seccionResult = await db.collection("sections").insertOne(nuevaSeccion);

        // Agregamos el objeto completo al array 'secciones' de la sucursal
        const updateResult = await db.collection("branches").updateOne(
            { idSucursal: idSucursal },
            {
                $push: {
                    secciones: {
                        _id: seccionResult.insertedId,
                        ...nuevaSeccion
                    }
                } as any
            }
        );

        if (updateResult.matchedCount === 0) {
            return NextResponse.json({ error: "Sucursal no encontrada para vincular" }, { status: 404 });
        }

        return NextResponse.json({ success: true, idSeccionDB: seccionResult.insertedId });
    } catch (error) {
        return NextResponse.json({ error: "Error al crear y vincular sección" }, { status: 500 });
    }
}