import { NextResponse } from 'next/server';
import clientPromise from '../../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

interface RouteParams {
    params: { id: string };
}

// DELETE
export async function DELETE(req: Request, { params }: RouteParams) {
    try {
        const { id } = await params;

        if (!id) return NextResponse.json({ error: "ID no proporcionado" }, { status: 400 });

        const client = await clientPromise;
        const db = client.db("after_hours");

        const objectId = new ObjectId(id);

        // Borrar de la colección global
        await db.collection("tables").deleteOne({ _id: objectId });

        // Limpiar referencias en secciones
        await db.collection("sections").updateMany(
            { idMesas: objectId },
            { $pull: { idMesas: objectId } as any }
        );

        // Limpiar en sucursales
        await db.collection("branches").updateOne(
            { "secciones.mesasCompletas._id": objectId },
            { $pull: { "secciones.$.mesasCompletas": { _id: objectId } } as any }
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error en DELETE mesa:", error);
        return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }
}

// PUT
export async function PUT(req: Request, { params }: RouteParams) {
    try {
        const { id } = await params;
        const { numeroMesa, capacidad, idSucursal } = await req.json();

        const client = await clientPromise;
        const db = client.db("after_hours");
        const objectId = new ObjectId(id);

        const updateData = {
            numeroMesa: Number(numeroMesa),
            capacidad: Number(capacidad)
        };

        // Update Global
        await db.collection("tables").updateOne(
            { _id: objectId },
            { $set: updateData }
        );

        // Update en Branch (Array Filters)
        await db.collection("branches").updateOne(
            {
                idSucursal: idSucursal,
                "secciones.mesasCompletas._id": objectId
            },
            {
                $set: {
                    "secciones.$[].mesasCompletas.$[m].numeroMesa": updateData.numeroMesa,
                    "secciones.$[].mesasCompletas.$[m].capacidad": updateData.capacidad
                }
            },
            {
                arrayFilters: [{ "m._id": objectId }]
            }
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error en PUT mesa:", error);
        return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }
}