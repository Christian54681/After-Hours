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

        const { idSeccionDB, numeroMesa, capacidad, idSucursal } = await req.json();
        const client = await clientPromise;
        const db = client.db("after_hours");

        // Crear la mesa en la colección global
        const nuevaMesa = {
            numeroMesa: Number(numeroMesa),
            capacidad: Number(capacidad),
            estado: 1
        };
        const mesaResult = await db.collection("tables").insertOne(nuevaMesa);
        const mesaId = mesaResult.insertedId;

        // Vincular a la colección 'sections'
        await db.collection("sections").updateOne(
            { _id: new ObjectId(idSeccionDB as string) },
            { $push: { mesasIds: mesaId } as any }
        );

        // Meter la mesa en los arrays de la sucursal
        const updateBranchResult = await db.collection("branches").updateOne(
            {
                idSucursal: idSucursal,
                $or: [
                    { "secciones._id": new ObjectId(idSeccionDB as string) },
                    { "secciones._id": idSeccionDB as string }
                ]
            },
            {
                $push: {
                    "secciones.$.mesasCompletas": {
                        _id: mesaId,
                        ...nuevaMesa
                    },
                    "secciones.$.mesasIds": mesaId
                } as any,
                $set: { updatedAt: new Date() }
            }
        );

        if (updateBranchResult.matchedCount === 0) {
            console.error(`No se encontró: Sucursal ${idSucursal} con Sección ${idSeccionDB}`);
            return NextResponse.json({ error: "No se encontró la sucursal o sección para vincular la mesa" }, { status: 404 });
        }

        return NextResponse.json({ success: true, idMesaDB: mesaId });
    } catch (error) {
        console.error("Error al crear mesa:", error);
        return NextResponse.json({ error: "Error al crear mesa" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const estado = searchParams.get('estado');

        const client = await clientPromise;
        const db = client.db("after_hours");

        let query: any = {};
        if (estado) query.estado = parseInt(estado);

        const tables = await db.collection("tables").find(query).toArray();

        return NextResponse.json(tables);
    } catch (error) {
        return NextResponse.json({ error: "Error al obtener mesas" }, { status: 500 });
    }
}