import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '../../../../../../lib/mongodb';

// ACTUALIZAR (PUT)
export async function PUT(req: Request, { params }: { params: any }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const client = await clientPromise;
        const db = client.db("after_hours");

        // Extraemos los datos para evitar que se intente actualizar el _id
        const { _id, ...datosAActualizar } = body;

        // Convertimos tipos de datos si vienen en el body para asegurar consistencia
        if (datosAActualizar.idProvedor) datosAActualizar.idProvedor = Number(datosAActualizar.idProvedor);
        if (datosAActualizar.tiempoEntregaDias) datosAActualizar.tiempoEntregaDias = Number(datosAActualizar.tiempoEntregaDias);

        const result = await db.collection("providers").updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    ...datosAActualizar,
                    updatedAt: new Date()
                }
            }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: "Proveedor no encontrado" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Proveedor actualizado con éxito" });
    } catch (error: any) {
        console.error("Error en PUT Provider:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// ELIMINAR (DELETE)
export async function DELETE(req: Request, { params }: { params: any }) {
    try {
        const { id } = await params;
        const client = await clientPromise;
        const db = client.db("after_hours");

        // Pero por ahora, eliminación directa:
        const result = await db.collection("providers").deleteOne({
            _id: new ObjectId(id)
        });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "No se pudo encontrar el proveedor para eliminar" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Proveedor eliminado permanentemente" });
    } catch (error: any) {
        console.error("Error en DELETE Provider:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}