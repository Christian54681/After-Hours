import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import clientPromise from '../../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'mi_secreto_super_seguro');

export async function DELETE(req: Request, { params }: { params: any }) {
    try {
        // Validar Token y Rol
        const authHeader = req.headers.get('authorization');
        const token = authHeader?.split(' ')[1];
        if (!token) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

        const { payload } = await jwtVerify(token, JWT_SECRET);
        if (payload.tipoRol !== 'AdminGeneral') {
            return NextResponse.json({ error: "Permisos insuficientes para eliminar sucursales" }, { status: 403 });
        }

        // Resolver params
        const resolvedParams = await params;
        const id = resolvedParams.id;

        const client = await clientPromise;
        const db = client.db("after_hours");

        // Cambiar estado a Inactivo
        const resultado = await db.collection("branches").updateOne(
            { _id: new ObjectId(id) }, // { _id: new ObjectId(id) }
            {
                $set: {
                    estado: "Inactivo",
                    updatedAt: new Date()
                }
            }
        );

        if (resultado.matchedCount === 0) {
            return NextResponse.json({ error: "Sucursal no encontrada" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Sucursal dada de baja (Inactiva) correctamente"
        });

    } catch (error) {
        console.error("Error en DELETE sucursal:", error);
        return NextResponse.json({ error: "Error interno al procesar la baja" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: any }) {
    try {
        // Validar Token y Rol
        const authHeader = req.headers.get('authorization');
        const token = authHeader?.split(' ')[1];
        if (!token) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

        const { payload } = await jwtVerify(token, JWT_SECRET);
        if (payload.tipoRol !== 'AdminGeneral') {
            return NextResponse.json({ error: "No autorizado" }, { status: 403 });
        }

        const body = await req.json(); // Leemos el form completo que manda el front
        const resolvedParams = await params;
        const id = resolvedParams.id;

        const client = await clientPromise;
        const db = client.db("after_hours");

        // Actualizar en MongoDB
        const resultado = await db.collection("branches").updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    ...body, // Esparcimos los campos que vengan (nombre, dirección, etc.)
                    updatedAt: new Date()
                }
            }
        );

        if (resultado.matchedCount === 0) {
            return NextResponse.json({ error: "Sucursal no encontrada" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Sucursal actualizada correctamente"
        });

    } catch (error) {
        console.error("Error en PUT sucursal:", error);
        return NextResponse.json({ error: "Error al actualizar sucursal" }, { status: 500 });
    }
}