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

        const { idSucursal, nombreSeccion, idSeccionManual } = await req.json();
        const client = await clientPromise;
        const db = client.db("after_hours");

        // 1. Insertar la sección
        const seccionResult = await db.collection("sections").insertOne({
            idSeccion: idSeccionManual,
            nombre: nombreSeccion,
            idMesas: [] // Inicia sin mesas
        });

        // 2. Vincularla a la sucursal mediante el idSucursal
        const updateResult = await db.collection("branches").updateOne(
            { idSucursal: idSucursal },
            { $push: { idSecciones: seccionResult.insertedId } as any }
        );

        if (updateResult.matchedCount === 0) {
            return NextResponse.json({ error: "Sucursal no encontrada" }, { status: 404 });
        }

        return NextResponse.json({ success: true, idSeccionDB: seccionResult.insertedId });
    } catch (error) {
        return NextResponse.json({ error: "Error al crear sección" }, { status: 500 });
    }
}