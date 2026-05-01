import { NextResponse } from 'next/server';
import clientPromise from '../../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

// ACTUALIZAR SECCIÓN
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { nombreSeccion, idSeccionManual, capacidadMax, idSucursal } = await req.json();

        const client = await clientPromise;
        const db = client.db("after_hours");

        // Actualizar en la colección independiente de secciones
        await db.collection("sections").updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    nombre: nombreSeccion,
                    idSeccion: idSeccionManual,
                    capacidadMax: Number(capacidadMax)
                }
            }
        );

        // Actualizar dentro del array 'secciones' de la sucursal
        const updateBranch = await db.collection("branches").updateOne(
            { idSucursal: idSucursal, "secciones._id": new ObjectId(id) },
            {
                $set: {
                    "secciones.$.nombre": nombreSeccion,
                    "secciones.$.idSeccion": idSeccionManual,
                    "secciones.$.capacidadMax": Number(capacidadMax)
                }
            }
        );

        return NextResponse.json({ success: true, message: "Sección actualizada en cascada" });
    } catch (error) {
        return NextResponse.json({ error: "Error al actualizar sección" }, { status: 500 });
    }
}

// ELIMINAR SECCIÓN
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const client = await clientPromise;
        const db = client.db("after_hours");

        // Eliminar de la colección independiente
        await db.collection("sections").deleteOne({ _id: new ObjectId(id) });

        // Eliminar de TODAS las sucursales que la contengan
        // Usamos $pull para remover el objeto del array 'secciones'
        await db.collection("branches").updateMany(
            {},
            { $pull: { secciones: { _id: new ObjectId(id) } } as any }
        );

        return NextResponse.json({ success: true, message: "Sección eliminada del sistema" });
    } catch (error) {
        return NextResponse.json({ error: "Error al eliminar sección" }, { status: 500 });
    }
}