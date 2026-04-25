import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { jwtVerify } from 'jose';
import clientPromise from '../../../../../../lib/mongodb';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'nosecreto');

// verificar si es Admin
async function verificarAdmin(req: Request) {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    if (!token) return null;
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return ['AdminGeneral', 'AdminSucursal'].includes(payload.tipoRol as string) ? payload : null;
    } catch { return null; }
}

// MODIFICAR EMPLEADO (PUT)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const admin = await verificarAdmin(req);
    if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

    try {
        const body = await req.json();
        const client = await clientPromise;
        const db = client.db("after_hours");

        // Preparamos los campos a actualizar del diagrama
        const updateData: any = {};
        if (body.username) updateData.username = body.username;
        if (body.email) updateData.email = body.email;

        // Campos específicos de empleadoInfo
        if (body.empleadoInfo) {
            for (const key in body.empleadoInfo) {
                updateData[`empleadoInfo.${key}`] = body.empleadoInfo[key];
            }
        }

        const result = await db.collection("users").updateOne(
            { _id: new ObjectId(params.id), tipo: "empleado" },
            { $set: updateData }
        );

        if (result.matchedCount === 0) return NextResponse.json({ error: "Empleado no encontrado" }, { status: 404 });

        return NextResponse.json({ success: true, message: "Empleado actualizado" });
    } catch (error) {
        return NextResponse.json({ error: "ID inválido o error de servidor" }, { status: 400 });
    }
}

// ELIMINAR
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const admin = await verificarAdmin(req);
    if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

    try {
        const client = await clientPromise;
        const db = client.db("after_hours");

        // cambiamos el estado a Inactivo
        const result = await db.collection("users").updateOne(
            { _id: new ObjectId(params.id), tipo: "empleado" },
            { $set: { "empleadoInfo.estado": "Inactivo" } }
        );

        if (result.matchedCount === 0) return NextResponse.json({ error: "Empleado no encontrado" }, { status: 404 });

        return NextResponse.json({ success: true, message: "Empleado dado de baja (Inactivo)" });
    } catch (error) {
        return NextResponse.json({ error: "Error al procesar la baja" }, { status: 400 });
    }
}