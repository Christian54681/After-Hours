import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '../../../../../lib/mongodb';

export async function POST(req: Request) {
    try {
        const { idSucursal, idSeccion, numeroMesa, nombreTitular, numeroPersonas } = await req.json();

        const client = await clientPromise;
        const db = client.db("after_hours");

        // El sistema consulta la BD" y filtra disponibilidad
        const sucursal = await db.collection("branches").findOne({
            idSucursal,
            "secciones.idSeccion": idSeccion
        });

        const seccion = sucursal?.secciones.find((s: any) => s.idSeccion === idSeccion);
        const mesa = seccion?.mesas.find((m: any) => m.numeroMesa === numeroMesa);

        // Hay mesas disponibles?
        if (!mesa || mesa.estado !== 1) { // 1 = Libre
            return NextResponse.json({ error: "La mesa no está disponible en este momento" }, { status: 400 });
        }

        // Identificar mesero asignado a la sección
        const meseroEncargado = await db.collection("users").findOne({
            "empleadoInfo.idSucursal": idSucursal,
            "empleadoInfo.tipoRol": "Mesero",
            "empleadoInfo.estado": "Activo"
            // Aquí podrías filtrar por sección si los vinculas previamente
        });

        if (!meseroEncargado) {
            return NextResponse.json({ error: "No hay meseros disponibles para esta sección" }, { status: 400 });
        }

        // Actualiza estado, Relaciona titular y Asigna mesero
        // Cambiamos la mesa a Ocupada (estado: 2)
        await db.collection("branches").updateOne(
            { idSucursal, "secciones.idSeccion": idSeccion, "secciones.mesas.numeroMesa": numeroMesa },
            { $set: { "secciones.$[sec].mesas.$[mes].estado": 2 } },
            { arrayFilters: [{ "sec.idSeccion": idSeccion }, { "mes.numeroMesa": numeroMesa }] }
        );

        // Creamos la "Orden/Comanda" para vincular todo
        const nuevaOrden = {
            idSucursal,
            mesa: numeroMesa,
            seccion: idSeccion,
            titular: nombreTitular,
            comensales: numeroPersonas,
            idMesero: meseroEncargado._id,
            nombreMesero: meseroEncargado.username,
            status: "abierta",
            total: 0,
            productos: [],
            createdAt: new Date()
        };

        const resultadoOrden = await db.collection("orders").insertOne(nuevaOrden);

        return NextResponse.json({
            success: true,
            message: "Mesa asignada correctamente",
            orderId: resultadoOrden.insertedId,
            meseroAsignado: meseroEncargado.username
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error interno del sistema" }, { status: 500 });
    }
}