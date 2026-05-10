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

// backend/api/admin/branches/[id]/route.ts

export async function PUT(req: Request, { params }: { params: any }) {
    try {
        const authHeader = req.headers.get('authorization');
        const token = authHeader?.split(' ')[1];
        if (!token) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

        const { payload } = await jwtVerify(token, JWT_SECRET);
        if (payload.tipoRol !== 'AdminGeneral') {
            return NextResponse.json({ error: "No autorizado" }, { status: 403 });
        }

        const body = await req.json();
        const { id } = await params; // ESTE es el ID de la sucursal (ej: 69ee4b31...)

        const { _id, ...datosParaActualizar } = body;

        const client = await clientPromise;
        const db = client.db("after_hours");

        console.log("--- DEBUG ASIGNACIÓN ---");
        console.log("ID Sucursal (Params):", id);
        console.log("Body recibido:", JSON.stringify(body, null, 2));

        // 1. Actualizamos la sucursal
        const resultado = await db.collection("branches").updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    ...datosParaActualizar,
                    updatedAt: new Date()
                }
            }
        );

        if (resultado.matchedCount === 0) {
            return NextResponse.json({ error: "Sucursal no encontrada" }, { status: 404 });
        }

        // 2. ACTUALIZAMOS AL EMPLEADO
        if (datosParaActualizar.encargado) {
            const encargadoId = String(datosParaActualizar.encargado);

            // Solo si recibimos un ID de 24 caracteres (el _id de JJ)
            if (ObjectId.isValid(encargadoId)) {
                // Usamos el idSucursal que viene en el body (ej: "SUC_003")
                const idTexto = datosParaActualizar.idSucursal;

                await db.collection("users").updateOne(
                    { _id: new ObjectId(encargadoId) },
                    {
                        $set: {
                            "empleadoInfo.idSucursalACargo": idTexto,
                            "empleadoInfo.idSucursal": idTexto,
                            "updatedAt": new Date()
                        }
                    }
                );
                console.log(`actualizado con éxito a la sucursal ${idTexto}`);
            } else {
                console.error(`El valor "${encargadoId}" no es un ID de MongoDB válido.`);
            }
        }

        return NextResponse.json({ success: true, message: "Actualizado" });

    } catch (error: any) {
        console.error("Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}