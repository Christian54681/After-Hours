import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import clientPromise from '../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'mi_secreto_super_seguro');

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get('authorization');
        const token = authHeader?.split(' ')[1];
        if (!token) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
        await jwtVerify(token, JWT_SECRET);

        const { idSeccionDB, numeroMesa, capacidad } = await req.json();
        const client = await clientPromise;
        const db = client.db("after_hours");

        // 1. Crear la mesa
        const mesaResult = await db.collection("tables").insertOne({
            numeroMesa,
            capacidad,
            estado: 1 // 1 = Libre
        });

        // 2. Vincular la mesa a la sección usando el _id (ObjectId)
        await db.collection("sections").updateOne(
            { _id: new ObjectId(idSeccionDB as string) },
            { $push: { idMesas: mesaResult.insertedId } as any}
        );

        return NextResponse.json({ success: true, idMesaDB: mesaResult.insertedId });
    } catch (error) {
        return NextResponse.json({ error: "Error al crear mesa" }, { status: 500 });
    }
}