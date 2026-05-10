import { NextResponse } from 'next/server';
import clientPromise from '../../../../../lib/mongodb';

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("after_hours");
        const providers = await db.collection("providers").find({}).toArray();
        return NextResponse.json(providers);
    } catch (error) {
        return NextResponse.json({ error: "Error al obtener proveedores" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const client = await clientPromise;
        const db = client.db("after_hours");

        const nuevoProveedor = {
            idProvedor: Number(body.idProvedor),
            empresa: body.empresa,
            contacto: body.contacto,
            tiempoEntregaDias: Number(body.tiempoEntregaDias),
            estado: "Activo",
            createdAt: new Date()
        };

        const result = await db.collection("providers").insertOne(nuevoProveedor);
        return NextResponse.json({ success: true, id: result.insertedId });
    } catch (error) {
        return NextResponse.json({ error: "Error al crear proveedor" }, { status: 500 });
    }
}