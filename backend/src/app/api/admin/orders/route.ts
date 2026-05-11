import { NextResponse } from 'next/server';
import clientPromise from '../../../../../lib/mongodb';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const client = await clientPromise;
        const db = client.db("after_hours");

        // Creamos la orden de compra real en la DB
        const result = await db.collection("purchase_orders").insertOne({
            ...body,
            createdAt: new Date(),
        });

        return NextResponse.json({ success: true, id: result.insertedId });
    } catch (error) {
        return NextResponse.json({ error: "Error al procesar la orden" }, { status: 500 });
    }
}

// GET para ver historial (Para el Dashboard)
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const sucursal = searchParams.get('sucursal');
        
        const client = await clientPromise;
        const db = client.db("after_hours");

        // Si mandamos sucursal, filtramos. Si no (Admin Gen), vemos todo.
        const query = sucursal && sucursal !== "GLOBAL_DIST" ? { idSucursal: sucursal } : {};
        
        const orders = await db.collection("purchase_orders")
            .find(query)
            .sort({ createdAt: -1 })
            .toArray();

        return NextResponse.json(orders);
    } catch (error) {
        return NextResponse.json({ error: "Error al obtener órdenes" }, { status: 500 });
    }
}