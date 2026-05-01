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
export async function PUT(req: Request, { params }: { params: any }) {
    const admin = await verificarAdmin(req);
    if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

    try {
        const resolvedParams = await params;
        const id = resolvedParams.id;

        if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
            return NextResponse.json({ error: "Formato de ID inválido" }, { status: 400 });
        }

        const body = await req.json();
        const client = await clientPromise;
        const db = client.db("after_hours");

        // Definir los campos permitidos por cada rol para limpiar basura
        const camposPorRol: Record<string, string[]> = {
            "Mesero": ["zonaAsignada", "mesasACargo"],
            "Bartender": ["especialidad", "barraAsignada"],
            "Contador": ["numCedula", "nivelAcceso"],
            "Cajero": ["numCaja", "fondoInicial", "montoActual"],
            "AdminSucursal": [],
            "AdminGeneral": []
        };

        const nuevoRol = body.tipoRol || "Empleado";

        // Esto ELIMINA cualquier campo que no esté en esta lista
        const nuevaInfo: any = {
            nombreCompleto: body.nombreCompleto,
            idSucursal: body.idSucursal,
            tipoRol: nuevoRol,
            telefono: body.telefono || "",
            estado: body.estado || "Activo",
        };

        // Solo agregar los campos que corresponden al rol actual
        if (camposPorRol[nuevoRol]) {
            camposPorRol[nuevoRol].forEach(campo => {
                if (body[campo] !== undefined) {
                    nuevaInfo[campo] = body[campo];
                }
            });
        }

        // Preparar el objeto de actualización principal
        const updateData: any = {
            updatedAt: new Date(),
            empleadoInfo: nuevaInfo
        };

        if (body.username) updateData.username = body.username;
        if (body.email) updateData.email = body.email;

        // Ejecutar la actualización
        const result = await db.collection("users").updateOne(
            { _id: new ObjectId(id), tipo: "empleado" },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: "Empleado no encontrado" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Empleado actualizado y perfil limpiado" });

    } catch (error: any) {
        console.error("Error detallado:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}

// ELIMINAR
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const admin = await verificarAdmin(req);
    if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

    try {
        const resolvedParams = await params;
        const id = resolvedParams.id;

        if (!id || id.length !== 24) {
            return NextResponse.json({ error: "ID inválido" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("after_hours");

        // cambiamos el estado a Inactivo
        const result = await db.collection("users").updateOne(
            { _id: new ObjectId(id), tipo: "empleado" },
            { $set: { "empleadoInfo.estado": "Inactivo" } }
        );

        if (result.matchedCount === 0) return NextResponse.json({ error: "Empleado no encontrado" }, { status: 404 });

        return NextResponse.json({ success: true, message: "Empleado dado de baja (Inactivo)" });
    } catch (error) {
        console.error("Error en DELETE:", error);
        return NextResponse.json({ error: "Error al procesar la baja" }, { status: 400 });
    }
}