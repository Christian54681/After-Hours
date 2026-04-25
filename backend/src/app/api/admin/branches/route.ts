import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import clientPromise from '../../../../../lib/mongodb';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'mi_secreto_super_seguro');

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get('authorization');
        const token = authHeader?.split(' ')[1];
        if (!token) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

        const { payload } = await jwtVerify(token, JWT_SECRET);
        if (payload.tipoRol !== 'AdminGeneral') {
            return NextResponse.json({ error: "Permisos insuficientes" }, { status: 403 });
        }

        const { idSucursal, nombre, direccion, tipoBar } = await req.json();
        const client = await clientPromise;
        const db = client.db("after_hours");

        const existe = await db.collection("branches").findOne({ idSucursal });
        if (existe) return NextResponse.json({ error: "ID de sucursal ya existe" }, { status: 400 });

        const nuevaSucursal = {
            idSucursal,
            nombre,
            direccion,
            tipoBar,
            encargado: payload.username || payload.sub || "Admin",
            seccionesIds: [], // Inicia vacía para ser llenada luego
            createdAt: new Date(),
        };

        await db.collection("branches").insertOne(nuevaSucursal);
        await db.collection("users").updateOne(
            { username: payload.username },
            {
                $push: {
                    "empleadoInfo.todasLasSucursales": idSucursal
                }
            }
        );

        return NextResponse.json({ success: true, message: "Sucursal creada correctamente" });
    } catch (error: any) {
        console.error("ERROR CRÍTICO EN POST BRANCHES:", error.message);
        return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
    }
}

// GET: Obtener todas las sucursales
export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("after_hours");

        const branches = await db.collection("branches").aggregate([
            {
                $lookup: {
                    from: "sections",
                    localField: "seccionesIds",
                    foreignField: "_id",
                    as: "seccionesCompletas"
                }
            },
            // Usamos unwind pero aseguramos que NO elimine sucursales sin secciones
            { $unwind: { path: "$seccionesCompletas", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "tables",
                    localField: "seccionesCompletas.mesasIds",
                    foreignField: "_id",
                    as: "seccionesCompletas.mesasCompletas"
                }
            },
            {
                $group: {
                    _id: "$_id",
                    idSucursal: { $first: "$idSucursal" },
                    nombre: { $first: "$nombre" },
                    direccion: { $first: "$direccion" },
                    tipoBar: { $first: "$tipoBar" },
                    encargado: { $first: "$encargado" }, // Ahora sí coincide con tu POST
                    // Filtramos para no meter objetos vacíos si no hay secciones
                    secciones: {
                        $push: {
                            $cond: [
                                { $gt: [{ $ifNull: ["$seccionesCompletas._id", 0] }, 0] },
                                "$seccionesCompletas",
                                "$$REMOVE"
                            ]
                        }
                    }
                }
            }
        ]).toArray();

        return NextResponse.json(branches);
    } catch (error) {
        console.error("Error en GET sucursales:", error);
        return NextResponse.json({ error: "Error al obtener sucursales" }, { status: 500 });
    }
}