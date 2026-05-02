import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '../../../../../../lib/mongodb';

const toMin = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
};

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        // En Next.js 15+ params es una Promise, si usas versiones anteriores quita el await
        const { id } = await params;

        const client = await clientPromise;
        const db = client.db("after_hours");

        // Construimos el array de condiciones de forma segura
        const orConditions: any[] = [{ empleadoId: id }];

        // Solo intentamos crear el ObjectId si el string es válido (24 caracteres hex)
        if (ObjectId.isValid(id)) {
            orConditions.push({ empleadoId: new ObjectId(id) });
        }

        // CORRECCIÓN: Pasamos el query directo, sin envolverlo en {} de nuevo
        const horarios = await db.collection("schedules").find({
            $or: orConditions
        }).toArray();;

        if (!horarios || horarios.length === 0) {
            return NextResponse.json(
                { message: "Horario no encontrado para este empleado" },
                { status: 404 }
            );
        }

        return NextResponse.json(horarios);
    } catch (error) {
        console.error("Error al obtener horario:", error);
        return NextResponse.json(
            { error: "Error interno del servidor", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}

// ACTUALIZAR (PUT)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const client = await clientPromise;
        const db = client.db("after_hours");
        const body = await req.json();
        const { id } = await params;

        const { empleadoId, sucursalId, entrada, salida, dias, rolEnTurno } = body;

        // Validaciones básicas
        if (!empleadoId || !entrada || !salida || !dias || !Array.isArray(dias)) {
            return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
        }

        // Verificar traslapes (Conflict Check)
        // Excluimos el ID actual para que no choque consigo mismo al editar
        const turnosExistentes = await db.collection("schedules").find({
            _id: { $ne: new ObjectId(id) },
            empleadoId: new ObjectId(empleadoId),
            dias: { $in: dias }
        }).toArray();

        const nuevoInicio = toMin(entrada);
        let nuevoFin = toMin(salida);
        if (nuevoFin <= nuevoInicio) nuevoFin += 1440;

        for (const turno of turnosExistentes) {
            const diasComunes = turno.dias.filter((d: string) => dias.includes(d));
            if (diasComunes.length > 0) {
                const exInicio = toMin(turno.entrada);
                let exFin = toMin(turno.salida);
                if (exFin <= exInicio) exFin += 1440;

                if (nuevoInicio < exFin && nuevoFin > exInicio) {
                    return NextResponse.json({
                        error: `Conflicto: El empleado ya tiene otro turno en (${diasComunes.join(', ')}) de ${turno.entrada} a ${turno.salida}`
                    }, { status: 409 });
                }
            }
        }

        // Ejecutar actualización
        const updateResult = await db.collection("schedules").updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    empleadoId: new ObjectId(empleadoId),
                    sucursalId: new ObjectId(sucursalId),
                    dias,
                    entrada,
                    salida,
                    rolEnTurno: rolEnTurno || "Personal",
                    updatedAt: new Date()
                }
            }
        );

        if (updateResult.matchedCount === 0) {
            return NextResponse.json({ error: "Turno no encontrado" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Horario actualizado" });

    } catch (error) {
        console.error("Error en PUT schedules:", error);
        return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }
}

// ELIMINAR (DELETE)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const client = await clientPromise;
        const db = client.db("after_hours");
        const { id } = await params;

        const deleteResult = await db.collection("schedules").deleteOne({
            _id: new ObjectId(id)
        });

        if (deleteResult.deletedCount === 0) {
            return NextResponse.json({ error: "Turno no encontrado" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Turno eliminado correctamente" });

    } catch (error) {
        console.error("Error en DELETE schedules:", error);
        return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
    }
}