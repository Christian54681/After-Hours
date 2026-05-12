// api/employee/tables/[id]/status/route.ts
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '../../../../../../../lib/mongodb';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = await params;
        const { estado } = await req.json(); // Recibimos 0 o 1

        const client = await clientPromise;
        const db = client.db("after_hours");
        const objectId = new ObjectId(id);

        await db.collection("tables").updateOne(
            { _id: objectId },
            { $set: { estado: Number(estado) } }
        );

        // Actualización en la colección branches
        // Usamos updateMany para asegurar que se actualice en cualquier branch que la contenga
        await db.collection("branches").updateMany(
            { "secciones.mesasCompletas._id": objectId },
            {
                $set: { "secciones.$[].mesasCompletas.$[m].estado": Number(estado) }
            },
            {
                arrayFilters: [{ "m._id": objectId }]
            }
        );

        return NextResponse.json({ success: true, nuevoEstado: estado });
    } catch (error) {
        console.error("Error al cambiar estado de mesa:", error);
        return NextResponse.json({ error: "No se pudo actualizar la mesa" }, { status: 500 });
    }
}